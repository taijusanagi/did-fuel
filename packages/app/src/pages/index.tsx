import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import { useFuel } from "@/hooks/useFuel";
import { useIsConnected } from "@/hooks/useIsConnected";
import { Wallet } from "fuels";

import { Modal } from "@/components/Modal";
import { useModal } from "@/hooks/useModal";

import { GameAbi__factory } from "@/types/generated/fuel";
import { create } from "domain";
const CONTRACT_ID = "0xa34e734287d51938811d691492e68877de4bbe5e7023eca935e0640bb6cb4426";

interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
}

const Home: React.FC = () => {
  const [fuel, notDetected, isLoading] = useFuel();
  const [isConnected] = useIsConnected();
  const [did, setDid] = useState<string>("did:fuel:xxx");
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
    "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/secp256k1recovery-2020/v2"],
    id: did,
    verificationMethod: verificationMethods,
    authentication: [`${did}#controller`],
    assertionMethod: [`${did}#controller`],
  });

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
    // TODO: add registered keys

    setVerificationMethods([
      {
        id: `${did}`,
        type: "EcdsaSecp256k1RecoveryMethod2020",
        controller: did,
      },
    ]);
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

  const handleAddKey = () => {
    // TODO: send transaction

    try {
      const wallet = Wallet.fromAddress(newKeyInput);
      const newAddress = wallet.address.toString();
      const newDID = `did:fuel:${newAddress}`;
      if (verificationMethods.some((method) => method.id === newDID)) {
        alert("This address is already registered.");
        return;
      }
      const newKey: VerificationMethod = {
        id: `did:fuel:${newKeyInput}`,
        type: "EcdsaSecp256k1RecoveryMethod2020",
        controller: did,
      };
      setVerificationMethods([...verificationMethods, newKey]);
      setNewKeyInput("");
    } catch (e) {
      alert(e);
    }
  };

  const createCredential = () => {
    //TODO: implement
  };

  // async function newPlayer() {
  //   const account = await fuel.currentAccount();
  //   const wallet = await fuel.getWallet(account);
  //   const contract = GameAbi__factory.connect(CONTRACT_ID, wallet);
  //   let resp = await contract.functions.new_player().txParams({ variableOutputs: 1 }).call();
  //   console.log("RESPONSE:", resp.value);
  // }

  // async function levelUp() {
  //   const account = await fuel.currentAccount();
  //   const wallet = await fuel.getWallet(account);
  //   const contract = GameAbi__factory.connect(CONTRACT_ID, wallet);
  //   let amount = 100_000_000;
  //   let resp = await contract.functions
  //     .level_up()
  //     .callParams({
  //       forward: [amount, CONTRACT_ID],
  //     })
  //     .call();
  //   console.log("RESPONSE:", resp.value.toNumber());
  // }

  const handleRevokeKey = (id: string) => {
    const newVerificationMethods = verificationMethods.filter((method) => method.id !== id);
    setVerificationMethods(newVerificationMethods);
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
                      className="mb-2 px-2 py-2 text-sm rounded-lg min-w-full border border-gray-300"
                      placeholder="Creadential payload in JSON format"
                      value={credentialPayload}
                      onChange={(e) => setCredentialPayload(e.target.value)}
                    />
                    <button
                      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg min-w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={openModal}
                      disabled={!credentialPayload}
                    >
                      Create
                    </button>
                    <Modal isOpen={isOpen} closeModal={closeModal}>
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Credential Created
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Credential goes here</p>
                      </div>
                    </Modal>
                    <h2 className="mb-2 text-sm font-bold text-black">Delegate</h2>
                    <input
                      className="mb-4 px-2 py-2 text-sm rounded-lg min-w-full border border-gray-300"
                      placeholder="Fuel account (bech32Address)"
                      value={newKeyInput}
                      onChange={(e) => setNewKeyInput(e.target.value)}
                    />
                    {/* <button
                      className="mb-4 px-2 py-2 text-sm rounded-lg min-w-full border border-gray-300"
                      onClick={newPlayer}
                    >
                      newPlayer
                    </button>
                    <button
                      className="mb-4 px-2 py-2 text-sm rounded-lg min-w-full border border-gray-300"
                      onClick={levelUp}
                    >
                      levelUp
                    </button> */}
                    <button
                      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg min-w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddKey}
                      disabled={!newKeyInput}
                    >
                      Delegate
                    </button>
                    <ul className="min-w-full">
                      {verificationMethods.map(({ id }) => (
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
