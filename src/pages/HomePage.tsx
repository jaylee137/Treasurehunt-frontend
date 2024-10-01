import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import GoogleLogo from "../components/GoogleLogo";
import { collapseAddress } from "../core/utils";
import {
  Aptos,
  AptosConfig,
  Network,
  NetworkToNetworkName,
} from "@aptos-labs/ts-sdk";
import Footer2 from "../layouts/Footer2";

const APTOS_NETWORK: Network =
  NetworkToNetworkName[import.meta.env.VITE_APTOS_NETWORK] || Network.TESTNET;

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

function HomePage() {
  const navigate = useNavigate();

  const { activeAccount } = useKeylessAccounts();

  useEffect(() => {
    if (!activeAccount) navigate("/");
    else {
      connectGame();
    }
  }, [activeAccount, navigate]);

  const connectGame = async () => {
    try {
      if (activeAccount) {
        const transaction = await aptos.transaction.build.simple({
          sender: activeAccount.accountAddress,
          data: {
            function: `${import.meta.env.VITE_TREASUREHUNT_SC_ADDRESS
              }::treasurehunt::connect_game`,
            functionArguments: [],
          },
        });

        const senderAuthenticator = aptos.transaction.sign({
          signer: activeAccount,
          transaction,
        });

        const submittedTransaction = await aptos.transaction.submit.simple({
          transaction,
          senderAuthenticator,
        });

        await aptos.waitForTransaction({
          transactionHash: submittedTransaction.hash,
        });

        navigate("/");
      }
    } catch (error1) {
      console.log(`error1 -> ${error1}`)
      try {
        if (activeAccount) {
          await aptos.fundAccount({
            accountAddress: activeAccount?.accountAddress,
            amount: 10_000_000,
          });
          setTimeout(() => {
            connectGame();
          }, 500);
        }
      } catch (error2) {
        console.log(`error2 -> ${error2}`)
        setTimeout(() => {
          connectGame();
        }, 500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen px-4 bg-[url('/img/beige.png')] bg-100 bg-no-repeat h-[100dvh] relative">
      <div className="max-w-md relative">
        <h1 className="text-[18px] font-bold mb-2 font-Blackpearl flex gap-[6px] justify-center">
          <span>Welcome</span>
          <span>to</span>
          <span>The</span>
          <span>Treasure</span>
          <span>Hunt</span>
        </h1>
        <p className="text-center text-base mb-4 font-TreasureMapDeadhand">
          Powered by Aptos
        </p>
        <div className="text-center [text-wrap:balance] from-slate-200/60 to-50% to-slate-200 mb-3">
          Preparing
          <span className="text-blue-500 text-base inline-flex flex-col h-[calc(theme(fontSize.base)*theme(lineHeight.tight))] md:h-[calc(theme(fontSize.base)*theme(lineHeight.tight))] overflow-hidden">
            <ul className="block animate-text-slide-7 text-base leading-tight [&_li]:block mx-1 text-center">
              <li>move ecosystem</li>
              <li>parallel processing</li>
              <li>treasure map</li>
              <li>smart contracts</li>
              <li>tap game</li>
              <li>multiplayer</li>
              <li>on chain</li>
              <li aria-hidden="true">move ecosystem</li>
            </ul>
          </span>
          treasure hunt
        </div>
        <div className="grid gap-2">
          {activeAccount ? (
            <div className="flex justify-center items-center border bg-yellow-100 rounded-lg px-10 py-1 shadow-sm cursor-not-allowed">
              <GoogleLogo />
              {collapseAddress(activeAccount?.accountAddress.toString())}
            </div>
          ) : (
            <p>Not logged in</p>
          )}
        </div>
      </div>
      <div className="max-w-md w-full absolute bottom-10">
        <Footer2 />
      </div>
    </div>
  );
}

export default HomePage;
