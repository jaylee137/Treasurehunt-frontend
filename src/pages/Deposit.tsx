import React, { useState } from "react";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { CopyOutlined, CopyFilled } from "@ant-design/icons";

const Deposit: React.FC = () => {
  const { activeAccount } = useKeylessAccounts();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const address = activeAccount?.accountAddress?.toString() || "";
    navigator.clipboard.writeText(address);
    setCopied(true);
  };

  return (
    <div className="h-screen bg-[url('/img/beige.png')] bg-100 bg-no-repeat flex flex-col w-full justify-center items-center pt-10">
      <h1 className="text-xl font-bold mb-4">Deposit</h1>
      <div className=" p-10 rounded-lg w-full max-w-sm mb-8">
        <div className="mb-4 text-sm">
          <label className="block font-bold mb-1">Address:</label>
          <div className="flex items-center">
            <span className="break-all">
              {activeAccount?.accountAddress?.toString()}
            </span>
            <button
              onClick={handleCopy}
              className="ml-2 my-5 text-sm text-blue-500 hover:text-blue-700"
            >
              {copied ? <CopyFilled /> : <CopyOutlined />}
            </button>
          </div>
          <p className="mt-2 text-sm text-center text-gray-600">
            Only deposit APT, $GUI, and approved NFTs.
          </p>
        </div>
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

export default Deposit;
