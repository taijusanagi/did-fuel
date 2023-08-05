contract;

use std::{logging::log, auth::msg_sender};

struct Log {
    owner: Identity,
    delegate: Identity,
    status: bool,
}

abi MyContract {
    #[storage(write)]
    fn add_delegate(delegate: Identity) -> ();

    #[storage(write)]
    fn revoke_delegate(delegate: Identity) -> ();
}

storage {
    delegates: StorageMap<(Identity, Identity), bool> = StorageMap {},
}

impl MyContract for Contract {
    #[storage(write)]
    fn add_delegate(delegate: Identity) -> () {
        let sender = msg_sender().unwrap();
        storage.delegates.insert((sender, delegate), true);
        log(Log {
            owner: sender,
            delegate: delegate,
            status: true,
        })
    }

    #[storage(write)]
    fn revoke_delegate(delegate: Identity) -> () {
        let sender = msg_sender().unwrap();
        storage.delegates.insert((sender, delegate), false);
        log(Log {
            owner: sender,
            delegate: delegate,
            status: false,
        })
    }
}