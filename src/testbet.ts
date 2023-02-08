import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import {  Wallet } from 'ethers';

const prv = generatePrivateKey();
const pub = getPublicKey(prv);

console.log(prv);
console.log(pub);

console.log(new Wallet(prv).address);