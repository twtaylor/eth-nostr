import { RelayPool } from 'nostr-relaypool'

const examplePrv = '5ed42a672d404e366de7f67a5544fff871e73fd03ec53120d4e1e50cc214de24';
const examplePub = 'ca80e3d4a52eb6c0c707e42bff9174de9e0ea3e99312590de95b669fcfe4ca86';

const webRelays = [
    'wss://relay.nostr.info',
    'wss://nostr.openchain.fr',
    'wss://relay.damus.io',
    // having issues?
    // 'wss://nostr-relay.wlvs.space',
    'wss://relay.nostr.ch'
];

let stockRelays = [
    "wss://relay.damus.io",
    "wss://nostr.fmt.wiz.biz",
    "wss://nostr.bongbong.com"
];

const relays = webRelays

let relayPool = new RelayPool(relays)

console.log('using relays: ' + relays.join(', '))

let unsub = relayPool.subscribe([
        { authors: [ examplePub ] },
        // { kinds: [0], authors: [ examplePub ], relay: "wss://nostr.sandwich.farm" }
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