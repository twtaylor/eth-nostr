import { RelayPool } from 'nostr-relaypool'
import { Event as NostrEvent, getEventHash, getPublicKey, signEvent } from 'nostr-tools';
import crypto from 'crypto'
import * as secp256k1 from '@noble/secp256k1'
import yargs from 'yargs';
import { Wallet } from './wallet';
import { exit } from 'process';

const relays = [
    'wss://relay.nostr.info',
    // 'wss://nostr.openchain.fr',
    // 'wss://relay.damus.io',
    // having issues?
    // 'wss://nostr-relay.wlvs.space',
    'wss://relay.nostr.ch'
];


// TODO: set defaults
const args = {
    relays: { type: 'array', default: false }, 
    mnemonic: { type: 'string', alias: 'm' },
    ethPrv: { type: 'string', alias: 'ep' },
    nostrPrv: { type: 'string', alias: 'np' },
}

const argv = yargs(process.argv.slice(2)).options(args).argv;

// generateMnemonic()
const wallet = new Wallet(argv.mnemonic, argv.ethPrv, argv.nostrPrv);

console.dir(wallet)

exit()

let relayPool = new RelayPool(relays)

console.log('using relays: ' + relays.join(', '))

async function publishRegistrationMsg(ethereumAddress: string, linkedNostrPub: string) {
    // the assumption for a registration message is the registrant is using their eth address => pub of the event published
    const ethMessage = `REGISTER ${wallet.ethereumWallet.address} `;
    const signedMsg = await wallet.ethereumWallet.signMessage(ethMessage);
    const totalMsg = wallet.ethereumWallet.address + ethMessage + ' ' + signedMsg
    const evt: any = {
        created_at: Math.floor(Date.now() / 1000),
        kind: 1, 
        pubkey: wallet.nostrPub, 
        tags: [],
        content: totalMsg,
    };
    
    evt.id = getEventHash(evt);
    evt.sig = signEvent(evt, wallet.nostrPrv);
    
    relayPool.publish(evt, relays);

    console.log('publish complete')
}

/**
 * Creates an encrypted direct msg for a private key and pub key.
 * @param privateKey 
 * @param destPubKey 
 * @param text 
 * @returns 
 */
function createEncryptedDirectMsgEvent(privateKey: string, destPubKey: string, text: string): NostrEvent {
    // TODO: check on the compressed key for derived keys
    let sharedPoint = secp256k1.utils.bytesToHex(secp256k1.getSharedSecret(privateKey, '02' + destPubKey))
    let sharedX = sharedPoint.substr(2, 64)

    let iv = crypto.randomFillSync(new Uint8Array(16))
    var cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(sharedX, 'hex'),
        iv
    );

    let encryptedMessage = cipher.update(text, 'utf8', 'base64')
    encryptedMessage += cipher.final('base64')
    
    let ivBase64 = Buffer.from(iv.buffer).toString('base64')

    const pub = getPublicKey(wallet.nostrPub);

    return {
        pubkey: pub,
        created_at: Math.floor(Date.now() / 1000),
        kind: 4,
        tags: [['p', destPubKey]],
        content: encryptedMessage + '?iv=' + ivBase64
    };
}

function getMsg() {
    // retrieve our event
    let unsub = relayPool.subscribe([
        { authors: [ wallet.nostrPub ] },
        { kinds: [ 1 ] }
        ], 
        relays,
        (event, isAfterEose, relayURL) => { console.log(event, isAfterEose, relayURL) },
        undefined,
        (events, relayURL) => { console.log(events, relayURL); }
    );

    relayPool.onerror = (err) => {
        console.log("RelayPool error", err);
    }
    relayPool.onnotice((notice) => {
        console.log("RelayPool notice", notice);
    })
}

// publishMsg().then(() => getMsg())

