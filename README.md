# DID:Fuel

![banner](./assets/banner.png)

DID:Fuel is a product created for the Sway Summer Hackathon. Our goal is to establish an identity infrastructure for Fuel, offering an SDK that makes it easy to create and manage Decentralized Identifiers (DIDs) on Fuel, and includes a simple frontend demo showcasing the SDK functionality.

## Demo

## Live App

TBD

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
