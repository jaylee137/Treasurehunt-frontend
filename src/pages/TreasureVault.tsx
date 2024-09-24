import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { CopyOutlined, CopyFilled } from "@ant-design/icons";
import {
  fetchAptBalance,
  fetchGuiBalance,
  fetchTotalDigs,
  fetchTotalRewards,
  optInDirectTransfer,
} from "../core/api";
import { fetchNftBalance } from "../core/apiAptos";

const TreasureVault: React.FC = () => {
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();
  const [walletAddress, setWalletAddress] = useState("");
  const [aptBalance, setAptBalance] = useState<number | null>(null);
  const [guiBalance, setGuiBalance] = useState<number | null>(null);
  const [nftBalance, setNFTBalance] = useState<number | null>(null);
  const [totalDigs, setTotalDigs] = useState<number | null>(null);
  const [totalRewards, setTotalRewards] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [recievingNft, setRecivingNft] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeAccount && !recievingNft) {
      optInDirectTransfer(activeAccount).then(setRecivingNft);
    }
  }, []);

  useEffect(() => {
    if (activeAccount) {
      const address = activeAccount.accountAddress.toString();
      setWalletAddress(address);

      fetchAptBalance(address).then(setAptBalance);
      fetchGuiBalance(address).then(setGuiBalance);
      fetchNftBalance(address).then(setNFTBalance);
      fetchTotalDigs(address).then(setTotalDigs);
      fetchTotalRewards(address).then(setTotalRewards);
    }
  }, [activeAccount]);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Wallet address copied to clipboard!");
  };

  const handleCopy = () => {
    const address = activeAccount?.accountAddress?.toString() || "";
    navigator.clipboard.writeText(address);
    setCopied(true);
  };

  const handleDisconnect = () => {
    disconnectKeylessAccount();
    navigate("/");
  };

  return (
    <div className="h-screen bg-[url('img/beige_border2.png')] bg-100 bg-no-repeat flex flex-col w-full justify-center items-center pt-10">
      <h1 className="text-xl font-bold mb-4">Treasure Vault</h1>
      <div className=" p-10 rounded-lg w-full max-w-sm mb-8">
        <div className="mb-4 text-sm">
          <label className="block font-bold mb-1">Address:</label>
          <div className="flex items-center">
            <span
              className="break-all cursor-pointer"
              onClick={() => copyToClipboard(walletAddress)}
            >
              {walletAddress}
            </span>
            <button
              onClick={handleCopy}
              className="ml-2 my-5 text-sm text-blue-500 hover:text-blue-700"
            >
              {copied ? <CopyFilled /> : <CopyOutlined />}
            </button>
          </div>
        </div>
        <div className="mb-4 text-sm">
          <label className="block font-bold mb-1">APT Balance:</label>
          <span>
            {aptBalance !== null ? `${aptBalance} APT` : "Loading..."}
          </span>
        </div>
        <div className="mb-4 text-sm">
          <label className="block font-bold mb-1">$GUI Balance:</label>
          <span>
            {guiBalance !== null ? `${guiBalance} $GUI` : "Loading..."}
          </span>
        </div>
        <div className="mb-4 text-sm">
          <label className="block font-bold mb-1">NFT Balance:</label>
          <span>{nftBalance !== null ? `${nftBalance}` : "Loading..."}</span>
        </div>
        <div className="mb-4 text-sm">
          <label className="block font-bold mb-1">Total Digs:</label>
          <span>{totalDigs}</span>
        </div>
        <div className="mb-4 text-sm">
          <label className="block font-bold mb-1">Total Rewards:</label>
          <span>{totalRewards}</span>
        </div>
        <div className="flex justify-between my-5">
          <button
            onClick={() => navigate("/deposit")}
            className="px-2 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-800 transition"
          >
            Deposit
          </button>
          <button
            onClick={handleDisconnect}
            className="px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-700 transition"
          >
            Disconnect
          </button>
          <button
            onClick={() => navigate("/withdraw")}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
          >
            Withdraw
          </button>
        </div>
      </div>
      <div className="flex w-[24rem] justify-center items-center">
        <button
          className="bg-[url('img/button.png')] bg-100 bg-no-repeat text-black font-bold text-sm py-1 px-1 w-1/3 mt-2"
          onClick={() => window.history.back()}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TreasureVault;
