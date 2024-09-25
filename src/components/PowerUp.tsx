import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useGesture } from "@use-gesture/react";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
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

const POWER_UP_DURATIONS: { [key: number]: number } = {
  1.5: 15 * 60, // 15 minutes
  3: 30 * 60, // 30 minutes
  5: 60 * 60, // 60 minutes
};
interface PowerUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletConnected: boolean;
  onPowerUp: (multiplier: number, duration: number) => void;
  activePowerUp: number | null; // Add this prop to track the active power-up
}

const PowerUpModal: React.FC<PowerUpModalProps> = ({
  isOpen,
  onClose,
  onPowerUp,
  walletConnected,
  activePowerUp, // Use this prop
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const { activeAccount } = useKeylessAccounts();
  const navigate = useNavigate();
  
  const bind = useGesture({
    onDrag: ({ direction: [, yDir], velocity: [, yVel] }) => {
      if (yVel > 0.5 && yDir > 0) {
        onClose();
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 500); // Duration of slide-down animation
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const purchasePowerUp = async (plan: number, multiplier: number) => {
    try {
      if (activeAccount) {
        const transaction = await aptos.transaction.build.simple({
          sender: activeAccount.accountAddress,
          data: {
            function: `${
              import.meta.env.VITE_TREASUREHUNT_SC_ADDRESS
            }::treasurehunt::purchase_powerup`,
            functionArguments: [plan],
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

        const executedTransaction = await aptos.waitForTransaction({
          transactionHash: submittedTransaction.hash,
        });
        console.log(executedTransaction);

        onPowerUp(multiplier, POWER_UP_DURATIONS[multiplier]);
      }
    } catch (error) {
      alert("You don't have enough GUI token");
      console.log(error);
    }
  };

  return ReactDOM.createPortal(
    <div
      {...bind()}
      className={`fixed inset-0 flex items-end justify-center z-50 h-screen ${
        isOpen ? "slide-up" : "slide-down"
      } bg-gray-800 bg-opacity-50 transition-transform`}
    >
      <div
        id="content"
        className=" flex justify-center items-center flex-col  shadow-xl h-screen w-full py-4 px-4"
      >
        <div className="mx-auto flex flex-col justify-center relative items-center max-w-sm gap-4 ">
          <div className="flex items-center justify-center">
            <img
              src="/img/ship-powerups.png"
              alt="Sample image"
              className="object-contain w-40"
            />
            <div className="flex gap-2 absolute right-6 top-8">
            {walletConnected ? (
                <button
                  onClick={() => {
                    navigate("/treasurevault");
                  }}
                >
                  <img src="/img/treasure1.png" className="w-7 h-7"></img>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  <img src="/img/treasure2.png" className="w-9 h-9" />
                </button>
              )}
              <button onClick={onClose} className="text-3xl ">
                &#9776;
              </button>
            </div>
          </div>

          <div
            className="w-[100%] bg-[url('/img/framepannel.png')] bg-100 bg-no-repeat 
                         pt-12 pb-8 flex items-center justify-center flex-col gap-2 relative"
          >
            <div className="absolute top-[-23px] left-0 w-[100%] flex justify-center">
              <img
                src="/img/pu-title.png"
                alt="title"
                className="w-80 object-contain "
              />
            </div>
            <div className=" flex justify-center items-center gap-2 ml-[-15px]">
              <img src="/img/lightning_yellow.png" alt="symbol" width={20} />
              <p
                className="bg-[url('/img/text-field.png')] bg-100 bg-no-repeat
               text-white px-2 py-1 text-center text-[8px] text-transform: uppercase w-[40%]"
              >
                Dig Fast, Captain! Buy a power up to auto dig faster for a
                period of time
              </p>
            </div>

            <button
              onClick={() => !activePowerUp && purchasePowerUp(1, 1.5)}
              className="relative bg-[url('/img/digbutton1.5x.png')] bg-100 bg-no-repeat text-black font-bold
                           flex flex-col items-center justify-center gap-1 text-[11px] px-4 pt-2 pb-4"
            >
              <img
                src="/img/Icon8.png"
                alt="icon"
                width={12}
                className="absolute top-[-2px] right-0"
              />
              <p className=" text-center"> Dig Speed 1.5x</p>
              <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col items-center">
                  <img src="/img/clock_stroke.png" alt="clock icon" width={10} />
                  <p className="text-[9px] leading-3">
                    <span className="text-[11px]">Duration</span> <br /> 15
                    Minutes
                  </p>
                </div>
                <img src="/img/1.5x.png" alt="boat image" width={40} />
                <div className="flex flex-col items-center">
                  <img src="/img/money_stroke.png" alt="clock icon" width={10} />
                  <p className="text-[9px] leading-3">
                    <span className="text-[11px]">Cost</span> <br /> 250k $GUI
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => !activePowerUp && purchasePowerUp(2, 3)}
              className="relative bg-[url('/img/digbutton3x.png')] bg-100 bg-no-repeat text-black font-bold
                           flex flex-col items-center justify-center gap-1 text-[11px] px-4 pt-2 pb-4"
            >
              <img
                src="/img/Icon8.png"
                alt="icon"
                width={12}
                className="absolute top-[-2px] right-0"
              />
              <p className=" text-center"> Dig Speed 3x</p>
              <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col items-center">
                  <img src="/img/clock_stroke.png" alt="clock icon" width={10} />
                  <p className="text-[9px] leading-3">
                    <span className="text-[11px]">Duration</span> <br /> 30
                    Minutes
                  </p>
                </div>
                <img src="/img/3x.png" alt="boat image" width={40} />
                <div className="flex flex-col items-center">
                  <img src="/img/money_stroke.png" alt="clock icon" width={10} />
                  <p className="text-[9px] leading-3">
                    <span className="text-[11px]">Cost</span> <br /> 500k $GUI
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => !activePowerUp && purchasePowerUp(3, 5)}
              className="relative bg-[url('/img/digbutton5x.png')] bg-100 bg-no-repeat text-black font-bold
                           flex flex-col items-center justify-center gap-1 text-[11px] px-4 pt-2 pb-4"
            >
              <img
                src="/img/Icon8.png"
                alt="icon"
                width={12}
                className="absolute top-[-2px] right-0"
              />
              <p className=" text-center"> Dig Speed 5x</p>
              <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col items-center">
                  <img src="/clock_stroke.png" alt="clock icon" width={10} />
                  <p className="text-[9px] leading-3">
                    <span className="text-[11px]">Duration</span> <br /> 30
                    Minutes
                  </p>
                </div>
                <img src="/img/5x.png" alt="boat image" width={40} />
                <div className="flex flex-col items-center">
                  <img src="/money_stroke.png" alt="clock icon" width={10} />
                  <p className="text-[9px] leading-3">
                    <span className="text-[11px]">Cost</span> <br /> 500k $GUI
                  </p>
                </div>
              </div>
            </button>

            <div className=" flex justify-center items-center gap-2 ml-[-15px]">
              <img src="/img/!_yellow.png" alt="symbol" width={10} />
              <p
                className="bg-[url('/img/text-field.png')] bg-100 bg-no-repeat
               text-white px-2 py-1 text-center text-[8px] text-transform: uppercase w-[35%]"
              >
                power up purchases fund the daily reward pool that gets
                distributed back to players 80% of all daily $GUI from power ups
              </p>
            </div>
          </div>

          <button
            className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                       text-sm py-1 px-1 w-1/3 "
            onClick={onClose}
          >
            Close
          </button>
        <Footer2 />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PowerUpModal;
