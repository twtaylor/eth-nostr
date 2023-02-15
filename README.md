ETH Nostr

This application allows for CLI communication between nostr and an ETH address. Think of the nostr network as a persistence.

The way that nostr and Ethereum connect these two together is through nostr metadata, which registers an Ethereum address. To prove that we have control of that address, a sig with a standard payload is stored in the metadata.

# Retrieving an ethereum address for a nostr pub
<tbd>

# Building
```
npx tsc
```

# Communication specification

We have a couple of different actors in nostr. 

- Registered nostr - This registers an ETH address on a relay.
- Unregistered nostr - This has not registered an ETH address but chooses to send or receive messages.

- ETH receivers - These are pure ETH addresses with no recognition of nostr.
- ETH senders - Ethereum users that want to send messages to nostr clients cannot do this without an nostr pub.
- Nostr receivers - A nostr user can accept an encrypted message.

## Scenarios for sending/receiving

- nostr pub to unregistered eth - Not possible without a targetted nostr pub. (Future spec?)
- unregistered eth to nostr - TBD
- registered nostr to registered nostr - base case. both nostr users have signed an ETH tx.

# Current Roadmap

- Define eth event specification
- Publish registration event to user metadata

- Retrieving an ethereum address from a nostr pub
- Sending a signed message 

- Publish change of ETH address (re-registration event)

- Interactive mode

# MAJOR TODO

- implement nostr prv and mnemonic splitting