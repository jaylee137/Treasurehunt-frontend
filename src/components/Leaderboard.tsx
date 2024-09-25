import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeAccount } = useKeylessAccounts();
  // const [leaderboard, setLeaderboard] = useState([
  //   { wallet: "0x1", digs: 0 },
  //   { wallet: "0x1", digs: 0 },
  //   { wallet: "0x1", digs: 0 },
  // ]);

  // const handleCopy = (walletAddress: string) => {
  //   navigator.clipboard.writeText(walletAddress);
  //   alert("Wallet address copied to clipboard!");
  // };

  const getLeaderBoard = async () => {
    try {
      if (activeAccount) {
        const [result]: any = await aptos.view<[string]>({
          payload: {
            function: `${
              import.meta.env.VITE_TREASUREHUNT_SC_ADDRESS
            }::treasurehunt::game_state`,
            functionArguments: [],
          },
        });

        const leaderBoardArr = [];
        for (let i in result.users_list) {
          leaderBoardArr.push({
            wallet: result.users_list[i],
            digs: parseInt(result.users_state[i].dig),
          });
        }

        leaderBoardArr.sort(
          (
            a: { wallet: any; digs: number },
            b: { wallet: any; digs: number }
          ) => {
            if (a.digs < b.digs) return 1;
            if (a.digs > b.digs) return -1;
            return 0;
          }
        );

        // setLeaderboard([...leaderBoardArr])
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaderBoard();
  }, []);

  return (
    <div
      id="content"
      className="flex flex-col justify-center items-center shadow-xl h-screen w-full pb-4 pt-2"
    >
      <div className="flex flex-col relative w-[24rem] justify-center items-center overflow-hidden h-screen">
        <div className="flex items-center justify-center">
          <img
            src="/img/leadership-board.png"
            alt="Sample image"
            className="object-contain w-40"
          />
          <div className="flex gap-2 absolute right-6 top-8">
            <img src="/img/treasure2.png" className="w-9 object-contain" />
            <button
              onClick={() => {
                navigate("/");
              }}
              className="text-3xl "
            >
              &#9776;
            </button>
          </div>
        </div>
        {/* board */}
        <div
          className="w-[90%] bg-[url('/img/framepannel.png')] bg-100 bg-no-repeat 
                     pt-16 pb-10 px-8 flex flex-col justify-center gap-3 relative"
        >
          <div className="absolute top-[-20px] left-0 w-[100%] flex justify-center">
            <img
              src="/img/ft-title.png"
              alt="title"
              className="w-80 object-contain "
            />
          </div>
          {/* top sec */}
          <div className="flex items-center justify-center relative self-center w-full ">
            <img
              src="/img/big-star.png"
              alt="star"
              className="absolute top-[-30px] z-0 w-10"
            />
            <span className="text-center bg-[url('/img/yellowbutton.png')] bg-100 bg-no-repeat w-[45%] flex justify-between p-2 z-10">
              <p className="text-[11px] font-medium leading-3">
                User# <br /> <span className="text-[9px]">0x82..5487</span>
              </p>
              <p className="text-[11px] font-medium leading-3">
                Dig Count <br /> <span className="text-[9px]">1,666,658</span>
              </p>
            </span>

            {/* 2 coins */}
            <div className="absolute bottom-[-38px] left-[-80px] w-full">
              <div className="flex items-center justify-center relative self-center">
                <img
                  src="/img/2-coins.png"
                  alt="star"
                  className="absolute top-[-30px] left-32 z-0 w-10"
                />

                <span className="text-center bg-[url('/img/yellowbutton.png')] bg-100 bg-no-repeat w-[45%] flex justify-between p-2 z-10">
                  <p className="text-[11px] font-medium leading-3">
                    User# <br /> <span className="text-[9px]">0x82..587</span>
                  </p>
                  <p className="text-[11px] font-medium leading-3">
                    Dig Count <br />{" "}
                    <span className="text-[9px]">1,666,658</span>
                  </p>
                </span>
              </div>
            </div>
            {/* 3 coins */}
            <div className="absolute bottom-[-38px] right-[-90px] w-full">
              <div className="flex items-center justify-center relative self-center w-full ">
                <img
                  src="/img/3-coins.png"
                  alt="star"
                  className="absolute top-[-25px] right-[8.5rem] z-0 w-10"
                />

                <span className="text-center bg-[url('/img/yellowbutton.png')] bg-100 bg-no-repeat w-[45%] flex justify-between p-2 z-10">
                  <p className="text-[11px] font-medium leading-3">
                    User# <br /> <span className="text-[9px]">0x82..587</span>
                  </p>
                  <p className="text-[11px] font-medium leading-3">
                    Dig Count <br />{" "}
                    <span className="text-[9px]">1,666,658</span>
                  </p>
                </span>
              </div>
            </div>
          </div>

          {/* table */}
          <div className="flex flex-col  mt-8 self-center w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((a) => {
              return (
                <div className=" flex gap-4 bg-[url('/img/yellowbutton.png')] bg-100 bg-no-repeat px-2">
                  <span className="text-center  w-[50%] flex justify-between p-2 z-10">
                    <p className="text-[11px] font-medium leading-3">
                      Rank <br /> <span className="text-[9px]">{a}</span>
                    </p>
                    <p className="text-[11px] font-medium leading-3">
                      Holes <br />
                      <span className="text-[9px]">1,334,343</span>
                    </p>
                  </span>

                  <span className="text-center w-[50%] flex justify-between p-2 z-10">
                    <p className="text-[11px] font-medium leading-3">
                      User# <br /> <span className="text-[9px]">0x82..587</span>
                    </p>
                    <p className="text-[11px] font-medium leading-3">
                      Digs
                      <br /> <span className="text-[9px]">1,666,658</span>
                    </p>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                   text-sm py-1 px-1 w-1/3 mt-4"
          onClick={() => {
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

export default Leaderboard;
