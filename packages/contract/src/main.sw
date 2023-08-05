contract;

use std::auth::msg_sender;
use std::constants::ZERO_B256;

abi MyContract {
    #[storage(read, write)]
    fn add_delegate(delegate: Identity) -> ();

    #[storage(read, write)]
    fn revoke_delegate(delegate: Identity) -> ();

    #[storage(read)]
    fn get_delegates(identity: Identity) -> [Identity; 10];
}

storage {
    delegates: StorageMap<(Identity, u64), Identity> = StorageMap {},
    delegate_count: StorageMap<Identity, u64> = StorageMap {},
}

impl MyContract for Contract {
    
    #[storage(read, write)]
    fn add_delegate(delegate: Identity) -> () {
        let sender = msg_sender().unwrap();
        let count = storage.delegate_count.get(sender).unwrap_or(0);
        require(count <= 10, "delegate limit reached");
        storage.delegates.insert((sender, count), delegate);
        storage.delegate_count.insert(sender, count + 1);
    }

    #[storage(read, write)]
    fn revoke_delegate(delegate_to_remove: Identity) -> () {
        let sender = msg_sender().unwrap();
        let count = storage.delegate_count.get(sender).unwrap_or(0);
        require(count > 0, "no delegates to revoke");
        let mut index_to_remove: u64 = count;
        let mut i: u64 = 0;
        while i < count {
            let delegate = storage.delegates.get((sender, i)).unwrap();
            if delegate == delegate_to_remove {
                index_to_remove = i;
                break;
            }
            i = i + 1;
        }
        if index_to_remove != count {
            i = index_to_remove + 1;
            while i < count {
                let delegate = storage.delegates.get((sender, i)).unwrap();
                storage.delegates.insert((sender, i - 1), delegate);
                i = i + 1;
            }
            storage.delegate_count.insert(sender, count - 1);
        }
    }

    #[storage(read)]
    fn get_delegates(identity: Identity) -> [Identity; 10] {
        let count = storage.delegate_count.get(identity).unwrap_or(0);
        let defaultAddress = Address::from(ZERO_B256);
        let defaultIdentity = Identity::Address(defaultAddress);
        let mut delegates: [Identity; 10] = [defaultIdentity; 10];
        let mut i: u64 = 0;
        while i < count {
            let delegate_identity = storage.delegates.get((identity, i)).unwrap();
            delegates[i] = delegate_identity;
            i = i + 1;
        }
        delegates
    }
}
