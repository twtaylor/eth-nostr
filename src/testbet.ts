import { RelayPool } from 'nostr-relaypool'

let relays = [
    "wss://relay.damus.io",
    "wss://nostr.fmt.wiz.biz",
    "wss://nostr.bongbong.com"
];

let relayPool = new RelayPool(relays)

let unsub = relayPool.subscribe([
        { authors: [ '32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245' ] },
        { kinds: [0], authors: [ '0000000035450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245' ],
        relay: "wss://nostr.sandwich.farm" }
    ], 
    relays,
    (event, isAfterEose, relayURL) => { console.log(event, isAfterEose, relayURL) },
    undefined,
    (events, relayURL) => { console.log(events, relayURL); }
    )
    
relayPool.onerror = (err) => {
    console.log("RelayPool error", err);
}
relayPool.onnotice((notice) => {
    console.log("RelayPool notice", notice);
})