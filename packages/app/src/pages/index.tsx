import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import { useFuel } from "@/hooks/useFuel";
import { useIsConnected } from "@/hooks/useIsConnected";
import { Wallet, Address } from "fuels";

import { Modal } from "@/components/Modal";
import { useModal } from "@/hooks/useModal";

import { DidAbi__factory } from "@/types/generated/fuel";
const CONTRACT_ID = "0x2acde21bc9b79c6aa6a820244c48ecb14f725b00d621c562659024fccf34a5e6";

interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
}

const defaultDid = "did:fuel:xxx";

const Home: React.FC = () => {
  const [fuel, notDetected, isLoading] = useFuel();
  const [isConnected] = useIsConnected();
  const [did, setDid] = useState<string>(defaultDid);
  const [verificationMethods, setVerificationMethods] = useState<VerificationMethod[]>([
    {
      id: `${did}`,
      type: "EcdsaSecp256k1RecoveryMethod2020",
      controller: did,
    },
  ]);
  const [credentialPayload, setCredentialPayload] = useState("");
  const [newKeyInput, setNewKeyInput] = useState<string>("");
  const [didDocument, setDidDocument] = useState<Record<string, any>>({
    "@context": ["https://www.w3.org/ns/did/v1"],
    id: did,
    verificationMethod: verificationMethods,
    authentication: [`${did}#controller`],
    assertionMethod: [`${did}#controller`],
  });
  const [credential, setCredential] = useState<any>();

  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    fuel.currentAccount().then((account: any) => {
      if (!account) {
        return;
      }
      setDid(`did:fuel:${account}`);
      console.log(account);
    });
  }, [isConnected, fuel]);

  useEffect(() => {
    if (did === defaultDid) {
      return;
    }
    // TODO: add registered keys
    const process = async () => {
      const account = await fuel.currentAccount();
      const wallet = await fuel.getWallet(account);
      const contract = DidAbi__factory.connect(CONTRACT_ID, wallet);
      const resp = await contract.functions.get_delegates({ Address: { value: wallet.address.toB256() } }).get();
      const addresss = resp.value
        .filter(({ Address: { value } }: any) => {
          return value !== "0x0000000000000000000000000000000000000000000000000000000000000000";
        })
        .map(({ Address: { value } }: any) => {
          return Address.fromB256(value).toString();
        });
      return addresss;
    };
    process().then((addresses) => {
      setVerificationMethods([
        {
          id: `${did}`,
          type: "EcdsaSecp256k1RecoveryMethod2020",
          controller: did,
        },
        ...addresses.map((address) => {
          return {
            id: `did:fuel:${address}`,
            type: "EcdsaSecp256k1RecoveryMethod2020",
            controller: did,
          };
        }),
      ]);
    });
  }, [did]);

  useEffect(() => {
    setDidDocument({
      ...didDocument,
      id: did,
      verificationMethod: verificationMethods,
      authentication: [`${did}#controller`],
      assertionMethod: [`${did}#controller`],
    });
  }, [did, verificationMethods]);

  const handleAddKey = async () => {
    // TODO: send transaction

    try {
      const newWallet = Wallet.fromAddress(newKeyInput);
      const newAddress = newWallet.address.toString();
      const newDID = `did:fuel:${newAddress}`;
      if (verificationMethods.some((method) => method.id === newDID)) {
        alert("This address is already registered.");
        return;
      }

      const account = await fuel.currentAccount();
      const wallet = await fuel.getWallet(account);
      const contract = DidAbi__factory.connect(CONTRACT_ID, wallet);
      await contract.functions
        .add_delegate({ Address: { value: newWallet.address.toB256() } })
        .txParams({ variableOutputs: 1 })
        .call();
      window.location.reload();
    } catch (e) {
      alert(e);
    }
  };

  const createCredential = async () => {
    const account = await fuel.currentAccount();
    const wallet = await fuel.getWallet(account);
    try {
      const parsesd = JSON.parse(credentialPayload);
      const vc = {
        "@context": ["https://www.w3.org/ns/credentials/v2"],
        type: ["VerifiableCredential"],
        issuer: did,
        credentialSubject: parsesd,
      };
      const message = JSON.stringify(vc);
      const signedMessage = await wallet.signMessage(message);
      const credential = {
        ...vc,
        proof: { type: "CustomSignatureWithFuelWallet", signature: signedMessage, verificationMethod: did },
      };
      setCredential(credential);
      openModal();
    } catch (e) {
      alert(e);
    }
    // const hashedMessage = hashMessage(message);
  };

  const handleRevokeKey = async (did: string) => {
    const address = Address.fromString(did.split(":")[2]);
    const account = await fuel.currentAccount();
    const wallet = await fuel.getWallet(account);
    const contract = DidAbi__factory.connect(CONTRACT_ID, wallet);
    await contract.functions
      .revoke_delegate({ Address: { value: address.toB256() } })
      .txParams({ variableOutputs: 1 })
      .call();
    window.location.reload();
  };

  return (
    <main className={`flex min-h-screen flex-col items-center p-12 mx-auto max-w-4xl ${inter.className}`}>
      <img src="/banner.png" className="rounded-lg mb-4 w-80"></img>
      <div className="mb-8 text-center text-lg font-bold min-w-full">Fuel based DID management SDK</div>
      {isLoading && (
        <>
          <p>Loading Fuel Wallet...</p>
        </>
      )}
      {!isLoading && (
        <>
          {notDetected && (
            <>
              <p>Please install the Fuel Wallet.</p>
            </>
          )}
          {!notDetected && (
            <>
              <div className="py-4 px-6 max-w-4xl min-w-full bg-white rounded-lg">
                {!isConnected && (
                  <>
                    <h1 className="mb-4 text-lg font-bold min-w-full text-black">Connect Fuel Wallet</h1>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg min-w-full"
                      onClick={() => {
                        fuel.connect();
                      }}
                    >
                      Connect
                    </button>
                  </>
                )}
                {isConnected && (
                  <>
                    <h1 className="mb-2 font-bold min-w-full text-black">DID</h1>
                    <p className="mb-4 text-sm min-w-full text-black">{did}</p>
                    <h2 className="mb-2 text-sm font-bold text-black">DID Document:</h2>
                    <pre className="mb-4 border rounded p-4 overflow-x-scroll min-w-full bg-gray-100 shadow-inner text-xs">
                      {JSON.stringify(didDocument, null, 2)}
                    </pre>
                    <h2 className="mb-2 text-sm font-bold text-black">Create Credential</h2>
                    <textarea
                      className="mb-2 px-2 py-2 h-24 text-sm rounded-lg min-w-full border border-gray-300"
                      placeholder="Creadential payload in JSON format"
                      value={credentialPayload}
                      onChange={(e) => setCredentialPayload(e.target.value)}
                    />
                    <button
                      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg min-w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={createCredential}
                      disabled={!credentialPayload}
                    >
                      Create
                    </button>
                    <Modal isOpen={isOpen} closeModal={closeModal}>
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Credential Created
                      </h3>
                      <div className="mt-2">
                        {credential && (
                          <pre className="mb-4 border rounded-lg p-4 overflow-x-scroll min-w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-2xl text-xs text-white">
                            {JSON.stringify(credential, null, 2)}
                          </pre>
                        )}
                      </div>
                    </Modal>
                    <h2 className="mb-2 text-sm font-bold text-black">Delegate</h2>
                    <input
                      className="mb-4 px-2 py-2 text-sm rounded-lg min-w-full border border-gray-300"
                      placeholder="Fuel account (bech32Address)"
                      value={newKeyInput}
                      onChange={(e) => setNewKeyInput(e.target.value)}
                    />
                    <button
                      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg min-w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddKey}
                      disabled={!newKeyInput}
                    >
                      Delegate
                    </button>
                    <ul className="min-w-full">
                      {verificationMethods
                        .filter(({ id }) => id !== defaultDid)
                        .map(({ id }) => (
                          <li
                            className="flex justify-between items-center p-2 my-2 min-w-full bg-white rounded-lg"
                            key={id}
                          >
                            <span className="text-sm text-black">{id}</span>
                            <button
                              className="px-2 py-1 bg-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleRevokeKey(id)}
                              disabled={did === id}
                            >
                              Revoke
                            </button>
                          </li>
                        ))}
                    </ul>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
};

export default Home;
