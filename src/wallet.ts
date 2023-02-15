import * as ecc from 'tiny-secp256k1';
import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import { Wallet as EthereumWallet } from 'ethers';
import { getPublicKey } from 'nostr-tools';

// NIP-06
const NOSTR_PATH = "m/49'/1237'/0'/0/0";

export class Wallet {
    public ethereumWallet: EthereumWallet;
    public nostrPub: string;

    // TODO: make these private
    constructor(private mnemonic?: string, public ethPrv?: string, public nostrPrv?: string) {
        // check to see if we have either:
        // 1) mnemonic 
        // 2) eth prv and nostr prv 
        
        if (mnemonic) {
            // ethereum mnemonic
            this.ethereumWallet = EthereumWallet.fromMnemonic(mnemonic);
            this.deriveNostrKeys();
        } else {
            // TODO: implement
        }
    }

    private deriveNostrKeys() {        
        const bip32 = BIP32Factory(ecc);
        const seed = bip39.mnemonicToSeedSync(this.mnemonic);
        const root = bip32.fromSeed(seed);

        // nostr prv from mnemonic
        const child = root.derivePath(NOSTR_PATH);
        const nostrKey = child.privateKey.toString('hex');
        
        this.nostrPrv = nostrKey;
        this.nostrPub = getPublicKey(this.nostrPrv);
        
        // console.dir(`Our private key: ${nostrKey}`);
        // console.dir(`Our pub key: ${pub}`);
    }
}