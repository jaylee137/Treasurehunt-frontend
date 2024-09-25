import React, { useEffect, useState } from "react";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { fetchAptBalance, fetchGuiBalance } from "../core/api";
import { fetchNftList } from "../core/apiAptos";
import { Aptos, AptosConfig, Network, NetworkToNetworkName } from "@aptos-labs/ts-sdk";

interface NFTData {
  creatorAddress: string | undefined,
  collectionName: string | undefined,
  tokenName: string | undefined,
  amount: number | undefined
}

const APTOS_NETWORK: Network = NetworkToNetworkName[import.meta.env.VITE_APTOS_NETWORK] || Network.TESTNET;

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const Withdraw: React.FC = () => {
  const { activeAccount } = useKeylessAccounts();
  const [selectedAsset, setSelectedAsset] = useState("APT");
  const [nftList, setNftList] = useState<NFTData[]>([]);
  const [selectedNft, setSelectedNft] = useState<string | null>("0");
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>();
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (activeAccount) {
      const address = activeAccount.accountAddress.toString();
      // Fetch balances and NFT list from blockchain
      if (selectedAsset === "APT") {
        fetchAptBalance(address).then(setBalance);
      } else if (selectedAsset === "$GUI") {
        fetchGuiBalance(address).then(setBalance);
      } else {
        fetchNftList(address).then(setNftList);
      }
    }
  }, [activeAccount, selectedAsset]);

  const handleWithdraw = async () => {
    try {
      if (activeAccount) {
        // Implement withdraw logic
        console.log(`Withdrawing ${amount} ${selectedAsset} to ${walletAddress}`);

        if (selectedAsset === "APT" && amount) {
          setWithdrawing(true)
          const transaction = await aptos.transaction.build.simple({
            sender: activeAccount.accountAddress,
            data: {
              function: "0x1::coin::transfer",
              typeArguments: [import.meta.env.VITE_APTOS_COIN],
              functionArguments: [walletAddress, amount * import.meta.env.VITE_APTOS_COIN_DECIMAL],
            }
          })

          const senderAuthenticator = aptos.transaction.sign({
            signer: activeAccount,
            transaction,
          })

          const submittedTransaction = await aptos.transaction.submit.simple({
            transaction,
            senderAuthenticator
          });

          const executedTransaction = await aptos.waitForTransaction({ transactionHash: submittedTransaction.hash });
          console.log(executedTransaction);
          fetchAptBalance(activeAccount.accountAddress.toString()).then(setBalance);
          alert("success");
          setWithdrawing(false)
        }
        else if (selectedAsset === "$GUI" && amount) {
          setWithdrawing(true)
          const transaction = await aptos.transaction.build.simple({
            sender: activeAccount.accountAddress,
            data: {
              function: "0x1::coin::transfer",
              typeArguments: [import.meta.env.VITE_EXGUI_COIN],
              functionArguments: [walletAddress, amount * import.meta.env.VITE_EXGUI_COIN_DECIMAL],
            }
          })

          const senderAuthenticator = aptos.transaction.sign({
            signer: activeAccount,
            transaction,
          })

          const submittedTransaction = await aptos.transaction.submit.simple({
            transaction,
            senderAuthenticator
          });

          const executedTransaction = await aptos.waitForTransaction({ transactionHash: submittedTransaction.hash });
          console.log(executedTransaction);
          fetchGuiBalance(activeAccount.accountAddress.toString()).then(setBalance);
          alert("success");
          setWithdrawing(false)
        }
        else if (selectedAsset === "NFT" && selectedNft !== "-1" && selectedNft !== null) {
          setWithdrawing(true)
          const transaction = await aptos.transaction.build.simple({
            sender: activeAccount.accountAddress,
            data: {
              function: "0x3::token_transfers::offer_script",
              functionArguments: [walletAddress, "0x5470e0f328736e9bd75321888a5478eb46801517e8e1644dcf05273752fbd33c", nftList[parseInt(selectedNft)].collectionName, nftList[parseInt(selectedNft)].tokenName, 0, nftList[parseInt(selectedNft)].amount]
            }
          })

          const senderAuthenticator = aptos.transaction.sign({
            signer: activeAccount,
            transaction,
          })

          const submittedTransaction = await aptos.transaction.submit.simple({
            transaction,
            senderAuthenticator
          });

          const executedTransaction = await aptos.waitForTransaction({ transactionHash: submittedTransaction.hash });
          console.log(executedTransaction);
          fetchNftList(activeAccount.accountAddress.toString()).then(setNftList);
          alert("success");
          setWithdrawing(false)
        }
      }
    } catch (error) {
      console.log(error);
      alert("Not enough token");
      setWithdrawing(false)
    }
  };

  return (
    <div className="h-screen  max-w-sm flex flex-col w-full justify-center items-center pt-10">
      <h1 className="text-xl font-bold mb-4">Withdraw</h1>
      <div className=" p-10 rounded-lg w-full max-w-md mb-8">
        <div className="mb-4 text-sm w-full">
          <label className="block font-bold mb-1">Withdraw Asset:</label>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="APT">APT</option>
            <option value="$GUI">$GUI</option>
            <option value="NFT">NFT</option>
          </select>
        </div>
        {selectedAsset === "NFT" && (
          <div className="mb-4 text-sm">
            <label className="block font-bold mb-1">Select NFT:</label>
            <select
              value={selectedNft || ""}
              onChange={(e) => setSelectedNft(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {nftList.filter(nft => nft.tokenName).map((nft, index) => (
                <option key={index} value={index}>
                  {nft.tokenName}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedAsset !== "NFT" ? (
          <div className="mb-4 text-sm">
            <label className="block font-bold mb-1">Balance:</label>
            <span>{balance !== null ? `${balance} ${selectedAsset}` : "Loading..."}</span>
          </div>
        ) : (<div className="mb-4 text-sm">
          <label className="block font-bold mb-1">Balance:</label>
          <span>{selectedNft !== null ? `${nftList.filter((_, index) => index === parseInt(selectedNft))[0] ? nftList.filter((_, index) => index === parseInt(selectedNft))[0].amount : ""}` : "Loading..."}</span>
        </div>)}

        {selectedAsset !== "NFT" && (
          <div className="mb-4 text-sm">
            <label className="block font-bold mb-1">Amount to Withdraw:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}
        <div className="mb-4 text-sm">
          <label className="block font-bold mb-1">Enter Aptos Wallet Address:</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleWithdraw}
          disabled={withdrawing}
          className={`w-full p-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-700 transition ${withdrawing ? "opacity-60" : ""}`}
        >
          {!withdrawing ? "Withdraw" : "Withdrawing..."}
        </button>
      </div>
      <button
        className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold text-sm py-1 px-1 w-[8rem] mt-2"
        onClick={() => window.history.back()}
      >
        Close
      </button>
    </div>
  );
};

export default Withdraw;
