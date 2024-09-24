import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer2 from "../layouts/Footer2";

const FindTreasure: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div
      id="content"
      className={` shadow-xl h-screen w-full py-4  ${
        isOpen ? "slide-up" : "slide-down"
      }`}
    >
      <div className=" mx-auto flex relative flex-col justify-center items-center max-w-sm gap-4">
        <div className="flex items-center justify-center">
          <img src="/img/finding-treasure.png" alt="Sample image" className="object-contain w-40" />
          <div className="flex gap-2 absolute right-6 top-8">
            <img src="/img/treasure2.png" className="w-9 object-contain" />
            <button
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => {
                  navigate("/");
                }, 200);
              }}
              className="text-3xl "
            >
              &#9776;
            </button>
          </div>
        </div>

        <div
          className="w-[95%] bg-[url('img/frame.png')] bg-100 bg-no-repeat 
                       pt-12 pb-8 px-8 flex flex-col gap-2 relative"
        >
          <div className="absolute top-[-23px] left-0 w-[100%] flex justify-center" >
          <img src="img/ft-title.png" alt="title" className="w-80 object-contain " />
          </div>
          <div className="w-[90%] bg-[url('img/beige_border2.png')] bg-100 bg-no-repeat p-2 ">
            <h2 className="text-transform: uppercase font-semibold text-[11px]">
              STEP 1: Create treasure vault
            </h2>
            <p className="text-[11px] text-center leading-3 ">
              Using keyless you can create or connect to your Treasure Vault
              Once connected all your gameplay actions are stored on chain,
              forever
            </p>
          </div>

          <div className=" self-end w-[90%] bg-[url('img/beige_border2.png')] bg-100 bg-no-repeat p-2">
            <h2 className="text-transform: uppercase font-semibold text-[11px]">
              Step 2: Fund Treasure Vault
            </h2>
            <p className="text-[11px] text-center leading-3">
              Add Aptos to your Treasure Vault in order to play
            </p>
          </div>

          <div className="w-[90%] bg-[url('img/beige_border2.png')] bg-100 bg-no-repeat p-2 ">
            <h2 className="text-transform: uppercase font-semibold text-[11px]">
              Step 3: DIG!
            </h2>
            <p className="text-[11px] text-center leading-3">
              Each Dig is an on chain transaction that will cost you very little
              APT. Each dig contributes to your total daily dig count and
              increases your share of the daily reward pool
            </p>
          </div>

          <div className="self-end w-[90%] bg-[url('img/beige_border2.png')] bg-100 bg-no-repeat p-2 ">
            <h2 className="text-transform: uppercase font-semibold text-[11px]">
              Step 4: The Daily Pool
            </h2>
            <p className="text-[11px] text-center leading-3">
              Every Power Up purchase contributes $GUI automagically to
              the Daily Reward Pool
            </p>
          </div>

          <div className="w-[90%] bg-[url('img/beige_border2.png')] bg-100 bg-no-repeat p-2 ">
            <h2 className="text-transform: uppercase font-semibold text-[11px]">
              Step 5 - AHOY! Treasure
            </h2>
            <p className="text-[11px] text-center leading-3">
              Every 24 hours, players automagically receive their share of the
              daily reward pool treasure A players treasure is based on their
              daily dig count. More digs, more share of treasure.
            </p>
          </div>

          <div className="self-center w-[99%] bg-[url('img/beige_border2.png')] bg-100 bg-no-repeat p-2 ">
            <h2 className="font-semibold text-[11px] flex items-end">
              <img src="img/gold3.png" alt="gold" width={18} /> What makes
              treasure hunt "On Chain"?
            </h2>
            <p className="text-[11px] text-center leading-3">
              Treasure Hunt is entirely build with smart contracts. There is no
              database. This means each and every players stats, map of squares,
              counter on each square, randomness when digging, each dig, reward
              distribution, global stat counters, and leaderboard are all
              through smart contracts. Even the games logic, game state
              management, and more. All entirely through smart contracts on
              Aptos Move
            </p>
          </div>
        </div>

        <button
          className="bg-[url('img/button.png')] bg-100 bg-no-repeat text-black font-bold
                     text-sm py-1 px-1 w-1/3 mt-2"
          onClick={() => {
            setIsOpen(false);
            setTimeout(() => {
              navigate("/");
            }, 200);
          }}
        >
          Close
        </button>
      <Footer2 />
      </div>
    </div>
  );
};

export default FindTreasure;
