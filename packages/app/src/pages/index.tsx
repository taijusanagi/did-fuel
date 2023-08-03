import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
}

const Home: React.FC = () => {
  const [did, setDid] = useState<string>("did:fuel:xxx");
  const [verificationMethods, setVerificationMethods] = useState<VerificationMethod[]>([
    {
      id: `${did}`,
      type: "EcdsaSecp256k1RecoveryMethod2020",
      controller: did,
    },
  ]);
  const [newKeyInput, setNewKeyInput] = useState<string>("");
  const [didDocument, setDidDocument] = useState<Record<string, any>>({
    "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/secp256k1recovery-2020/v2"],
    id: did,
    verificationMethod: verificationMethods,
    authentication: [`${did}#controller`],
    assertionMethod: [`${did}#controller`],
  });

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
    const newKey: VerificationMethod = {
      id: `did:fuel:${newKeyInput}`,
      type: "EcdsaSecp256k1RecoveryMethod2020",
      controller: did,
    };
    setVerificationMethods([...verificationMethods, newKey]);
    setNewKeyInput("");
  };

  const handleRevokeKey = (id: string) => {
    const newVerificationMethods = verificationMethods.filter((method) => method.id !== id);
    setVerificationMethods(newVerificationMethods);
  };

  return (
    <main className={`flex min-h-screen flex-col items-center p-24 mx-auto max-w-4xl ${inter.className}`}>
      <div className="mb-12 text-center text-5xl font-bold min-w-full">DID:Fuel</div>
      <div className="p-4 max-w-4xl min-w-full bg-white rounded-lg">
        <h1 className="mb-4 text-lg font-bold min-w-full text-black">{did}</h1>
        <h2 className="mb-2 text-sm font-bold text-black">DID Document:</h2>
        <pre className="mb-4 border rounded p-4 overflow-x-scroll min-w-full bg-gray-100 shadow-inner">
          {JSON.stringify(didDocument, null, 2)}
        </pre>
        <h2 className="mb-2 text-sm font-bold text-black">Management</h2>
        <input
          className="mb-4 px-2 py-2 rounded-lg min-w-full border border-gray-300"
          placeholder="Fuel account"
          value={newKeyInput}
          onChange={(e) => setNewKeyInput(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg min-w-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddKey}
          disabled={!newKeyInput}
        >
          Delegate
        </button>
        <ul className="mt-4 min-w-full">
          {verificationMethods.map(({ id }) => (
            <li className="flex justify-between items-center p-2 my-2 min-w-full bg-white rounded-lg" key={id}>
              <span className="text-black">{id}</span>
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
      </div>
    </main>
  );
};

export default Home;
