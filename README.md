# DID:Fuel

![banner](./assets/banner.png)

DID:Fuel is a product created for the Sway Summer Hackathon. Our goal is to establish an identity infrastructure for Fuel, offering an SDK that makes it easy to create and manage Decentralized Identifiers (DIDs) on Fuel, and includes a simple frontend demo showcasing the SDK functionality.

## Live App

https://did-fuel.vercel.app/

## Video

https://youtu.be/ehNCVyPyAWE

## Pitch Deck

https://docs.google.com/presentation/d/1dNgxtGccSfurVQZ-FJj6kw2eq0XCifj0lJGusr-vSZw/edit?usp=sharing

## Benefits

DID:Fuel brings a number of benefits to the Fuel Ecosystem:

1. **Decentralized Identity Infrastructure**: DID:Fuel provides a foundation for identity management in the Fuel Ecosystem. It allows developers to create and manage Decentralized Identifiers (DIDs), empowering end-users with self-sovereign identity.

2. **Credential Issuing**: DID:Fuel serves as a platform for issuing verifiable credentials. These digital attestations can be used for verification purposes, reducing the need for redundant identity checks.

3. **Encrypted Communication**: DID:Fuel will support encrypted messaging, enhancing the security of communication within the ecosystem. This feature ensures that sensitive information is protected from unauthorized access and data breaches.

## Features

- SDK for creating and managing DIDs on Fuel
- A simple frontend demo to visualize and interact with the SDK
- Creating verifiable credentials using the DID

## Design

The product design is based on the ERC-1056: Ethereum Lightweight Identity. It aims to provide a lightweight and flexible solution to identity management.

## Resources

This development references this tutorial which is introduced at DoraHack dashboard.
https://www.youtube.com/watch?v=kNtYYcghzKc

## Restriction

- Fuel ts does not support getting the event log of contract yet so we use get function instead
- Sway does not support array in storage map yet, so we use map to store index and count
- Fuel ts does not support returning Vec yet, so we use fixed array in contract

## Deployment

Contract is deployed on beta-test 3 test network

```
Bytecode size: 6060 bytes
Contract id: 0x2acde21bc9b79c6aa6a820244c48ecb14f725b00d621c562659024fccf34a5e6
Please provide the address of the wallet you are going to sign this transaction with:fuel1jkarlnz276urhqjtswttssl48dhx8yzes56kgnw405lsdga24nhqj7yv35
Transaction id to sign: 3fb55541f439e261dbafdfc496c0fe0d7009a21ca5bfd98ffbc835dd257ef15a
Please provide the signature:dfe23f28bc0815330a0c9ebd87be10e2fcb94d1831f44de179ade4555c041aca1ec3a9139b9b70886a2d1424865a008c69e63d4306b54920bd4b54f73fdd9cea
contract 2acde21bc9b79c6aa6a820244c48ecb14f725b00d621c562659024fccf34a5e6 deployed in block 0xe7849039db812030f84d02b2847942c9d5007c3b35207312e9a9537f7beb9d5f
```
