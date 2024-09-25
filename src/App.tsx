import React, { useEffect, useState } from "react";
import MapComponent from "./components/Map";
import Footer from "./layouts/footer";
import Header from "./layouts/header";
import SlideOutMenu from "./components/SlideOutMenu";
import PowerUpModal from "./components/PowerUp";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { useKeylessAccounts } from "./core/useKeylessAccounts";
import { useNavigate } from "react-router-dom";
import { useStore } from "./useStore";
import { useGesture } from "@use-gesture/react";
import {
  Aptos,
  AptosConfig,
  Network,
  NetworkToNetworkName,
} from "@aptos-labs/ts-sdk";

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 38,
  height: 22,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 18,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const INITIAL_DIGS = 500;
const REPLENISH_RATE = 5; // DIGs replenished every second
const DEFAULT_DIG_SPEED = 5; // Default speed (5 digs per second)
const POWER_UP_PLAN: { [key: number]: number } = {
  1: 1.5,
  2: 3,
  3: 5,
};
const POWER_UP_DURATIONS: { [key: number]: number } = {
  1.5: 15 * 60, // 15 minutes
  3: 30 * 60, // 30 minutes
  5: 60 * 60, // 60 minutes
};

const APTOS_NETWORK: Network =
  NetworkToNetworkName[import.meta.env.VITE_APTOS_NETWORK] || Network.TESTNET;

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

let squareIndexArr: Array<number> = [];
let digRequesting: boolean = false;
let activePowerUp: number = 0;
let powerUpTimer: number = 0;
let g_energy: number = -1;
let lastDigTime: number = 0;
let gameState: number = -1;

const App: React.FC = () => {
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();
  const navigate = useNavigate();

  const {
    energy,
    autoDig,
    digSpeed,
    growingSquare,
    squares,
    setEnergy,
    setAutoDig,
    setDigSpeed,
    setGrowingSquare,
    setSquares,
  } = useStore();

  const [mapImage, setMapImage] = useState<string>("/img/random-map.png");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu visibility
  const [isPowerUpModalOpen, setIsPowerUpModalOpen] = useState(false); // State for Power Up modal visibility
  const [showDisabledMessage, setShowDisabledMessage] = useState(false);
  const [autoDigFromPowerUp, setAutoDigFromPowerUp] = useState(false); // Track auto-dig activation source

  const [earnedPool, setEarnedPool] = useState("");
  const [totalPool, setTotalPool] = useState("");
  const [dailyPool, setDailyPool] = useState("");
  const [digs, setDigs] = useState(0);
  const [holes, setHoles] = useState(0);
  const [account, setAccount] = useState<number>(0);
  const [transaction, setTransaction] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<Date>();

  const gameInitialize = async () => {
    try {
      if (activeAccount) {
        // get game data from chain
        const [result]: any = await aptos.view<[string]>({
          payload: {
            function: `${import.meta.env.VITE_TREASUREHUNT_SC_ADDRESS
              }::treasurehunt::game_state_with_time`,
            functionArguments: [],
          },
        });

        // set game data to frontend
        let user_index = result.game_state.users_list.indexOf(
          activeAccount.accountAddress.toString()
        );
        if (user_index !== -1) {
          setEarnedPool(result.game_state.users_state[user_index].earned_pool);
          setTotalPool(result.game_state.total_pool);
          setDailyPool(result.game_state.daily_pool);
          setDigs(result.game_state.users_state[user_index].dig);
          setHoles(result.game_state.holes);
          setAccount(result.game_state.users_list.length);
          if (g_energy === -1) {
            setEnergy(
              parseInt(result.game_state.users_state[user_index].energy)
            );
            g_energy = parseInt(
              result.game_state.users_state[user_index].energy
            );
          }
          lastDigTime = new Date().getTime();
          setSquares(
            squares.map((square, index) => {
              return {
                ...square,
                digs: parseInt(result.game_state.grid_state[index]),
              };
            })
          );

          if (result.game_state.start_time) {
            setGameStartTime(new Date(parseInt(result.game_state.start_time) * 1000));
          }
          gameState = result.game_state.status;

          let powerupPurchaseTime: number = parseInt(
            result.game_state.users_state[user_index].powerup_purchase_time
          );
          let serverTime: number = parseInt(result.now_time_second);
          let powerupPlan: number = parseInt(
            result.game_state.users_state[user_index].powerup
          );

          if (
            powerupPlan !== 0 &&
            POWER_UP_DURATIONS[POWER_UP_PLAN[powerupPlan]] -
            (serverTime - powerupPurchaseTime) >
            0
          ) {
            let duration =
              powerupPurchaseTime !== 0
                ? POWER_UP_DURATIONS[POWER_UP_PLAN[powerupPlan]] -
                (serverTime - powerupPurchaseTime)
                : POWER_UP_DURATIONS[POWER_UP_PLAN[powerupPlan]];

            handlePowerUp(POWER_UP_PLAN[powerupPlan], duration);
          }
        }

        // set start timestamp
        if (result.game_state.start_time) {
          setGameStartTime(new Date(parseInt(result.game_state.start_time) * 1000));
        }

        // set transaction count
        setTransaction(parseInt(result.game_state.total_transation));
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderGameStartTime = () => {
    if (gameState == 0 && gameStartTime) {
      return (
        <div className="-mt-1">
          <p className="text-xs">Game starts on {gameStartTime ? gameStartTime?.toString().split(" ")[2] + " " + gameStartTime?.toString().split(" ")[1] + " at " + gameStartTime?.toLocaleTimeString() : ""}</p>
        </div>
      )
    }
  }

  const updateGameState = async () => {
    try {
      if (activeAccount) {
        // get game data from chain
        const [result]: any = await aptos.view<[string]>({
          payload: {
            function: `${import.meta.env.VITE_TREASUREHUNT_SC_ADDRESS
              }::treasurehunt::game_state_with_time`,
            functionArguments: [],
          },
        });
        let user_index = result.game_state.users_list.indexOf(
          activeAccount.accountAddress.toString()
        );
        // set game data to frontend
        if (user_index !== -1) {
          setEarnedPool(result.game_state.users_state[user_index].earned_pool);
          setTotalPool(result.game_state.total_pool);
          setDailyPool(result.game_state.daily_pool);
          setDigs(result.game_state.users_state[user_index].dig);
          setHoles(result.game_state.holes);
          setAccount(result.game_state.users_list.length);
          setSquares(
            squares.map((square, index) => {
              return { ...square, digs: parseInt(result.game_state.grid_state[index]) };
            })
          );
        }
        // set start timestamp
        if (result.game_state.start_time) {
          setGameStartTime(new Date(parseInt(result.game_state.start_time) * 1000));
        }

        // set game state
        gameState = result.game_state.status;
        setTransaction(parseInt(result.game_state.total_transation));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const digTransaction = async (asquareIndexArr: Array<number>) => {
    try {
      if (activeAccount && gameState == 0 && !digRequesting) {
        digRequesting = true;
        const transaction = await aptos.transaction.build.simple({
          sender: activeAccount.accountAddress,
          data: {
            function: `${import.meta.env.VITE_TREASUREHUNT_SC_ADDRESS}::treasurehunt::connect_game`,
            functionArguments: []
          }
        });

        const senderAuthenticator = aptos.transaction.sign({
          signer: activeAccount,
          transaction
        });

        const submittedTransaction = await aptos.transaction.submit.simple({
          transaction,
          senderAuthenticator
        })

        await aptos.waitForTransaction({ transactionHash: submittedTransaction.hash });

        updateGameState();
        digRequesting = false;
      }
      else {
        if (activeAccount && asquareIndexArr.length !== 0 && !digRequesting) {
          digRequesting = true;
          const transaction = await aptos.transaction.build.simple({
            sender: activeAccount.accountAddress,
            data: {
              function: `${import.meta.env.VITE_TREASUREHUNT_SC_ADDRESS
                }::treasurehunt::dig_multi`,
              functionArguments: [asquareIndexArr, g_energy],
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
          squareIndexArr = squareIndexArr.slice(
            asquareIndexArr.length,
            squareIndexArr.length - asquareIndexArr.length
          );
          updateGameState();
          digRequesting = false;
        }
      }
    } catch (error) {
      console.log(error);
      // squareIndexArr = [];
      updateGameState();
      digRequesting = false;
    }
  };

  useEffect(() => {
    gameInitialize();
  }, []);

  useEffect(() => {
    if (gameState !== -1) {
      setInterval(() => {
        digTransaction([...squareIndexArr]);
      }, 10);
    }
  }, [gameState]);

  const handleDig = () => {
    if (!activeAccount) {
      navigate("/login");
      return;
    }

    if (energy > 0 && gameState == 1) {
      // Trigger haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(100); // Vibrate for 100 milliseconds
      }

      setEnergy(Math.max(0, energy - 1));
      g_energy = Math.max(0, energy - 1);
      lastDigTime = new Date().getTime();

      const randomIndex = Math.floor(Math.random() * squares.length);
      setGrowingSquare(randomIndex); // Trigger growth effect for the corresponding digits

      squareIndexArr.push(randomIndex);

      // Vibrate effect
      const digButton = document.getElementById("digButton");
      if (digButton) {
        digButton.classList.add("vibrate");
        setTimeout(() => digButton.classList.remove("vibrate"), 300); // Remove the class after animation
      }

      // Coin bounce effect
      const coinContainer = document.getElementById("coinContainer");
      if (coinContainer) {
        const coin = document.createElement("div");
        coin.className = "coin";
        coin.style.left = `${Math.random() * 100}px`; // Random horizontal position
        coin.style.top = "20%";
        coinContainer.appendChild(coin);
        setTimeout(() => coin.remove(), 1000); // Remove the coin after animation
      }

      setTimeout(() => setGrowingSquare(null), 700); // Remove growth effect after 700ms
    } else {
      if (energy <= 0) {
        console.log("Energy is 0");
        setDigSpeed(1); // Set dig speed to 1 dig per second when energy reaches 0
        if (autoDigFromPowerUp) {
          setAutoDig(false); // Turn off auto-dig if it was activated by a power-up
        }
      }
      else {
        updateGameState();
      }
    }
  };

  const handleAutoDig = () => {
    setAutoDig(!autoDig);
    if (!autoDig) {
      setDigSpeed(DEFAULT_DIG_SPEED); // Set dig speed to default if manually enabled
    }
    setAutoDigFromPowerUp(false); // Reset the source to manual
  };

  const handlePowerUp = (multiplier: number, duration: number) => {
    if (activePowerUp === multiplier) return; // If the same power-up is active, do nothing

    activePowerUp = multiplier;
    setDigSpeed(DEFAULT_DIG_SPEED * multiplier);
    setAutoDig(true); // Enable auto dig
    setAutoDigFromPowerUp(true); // Set the source to power-up
    setIsPowerUpModalOpen(false); // Close Power Up modal

    powerUpTimer = duration;

    const timerInterval = setInterval(() => {
      if (powerUpTimer == 1) {
        clearInterval(timerInterval);
        activePowerUp = 0;
        setDigSpeed(DEFAULT_DIG_SPEED); // Reset to default speed
        setAutoDigFromPowerUp(false); // Reset the source when power-up ends
        powerUpTimer = 0;
      } else {
        powerUpTimer -= 1;
      }
    }, 1000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const togglePowerUpModal = () => {
    setIsPowerUpModalOpen(!isPowerUpModalOpen);
  };

  const bind = useGesture({
    onDrag: ({ direction: [xDir], velocity: [xVel] }) => {
      if (xVel > 0.5 && xDir < 0) {
        setIsMenuOpen(true);
      } else if (xVel > 0.5 && xDir > 0) {
        setIsMenuOpen(false);
      }
    },
  });

  const handleMapReset = () => {
    setMapImage(`/img/random-map-${Math.floor(Math.random() * 10)}.png`); // Use a new random map image
    setSquares(
      squares.map((square) => ({
        ...square,
        digs: 0,
      }))
    );
    // setEnergy(INITIAL_DIGS);
    // g_energy = INITIAL_DIGS;
  };

  useEffect(() => {
    if (squares.every((square) => square.digs >= 100)) {
      handleMapReset();
    }
  }, [squares]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setAutoDig(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (autoDig) {
      const interval = setInterval(
        () => {
          handleDig();
        },
        energy > 0 ? 1000 / digSpeed : 1000
      ); // Dig every second if energy is 0
      return () => clearInterval(interval);
    }
  }, [autoDig, energy, digSpeed]);

  // Handle energy replenishment during pauses
  useEffect(() => {
    const replenishEnergy = () => {
      if (lastDigTime && gameState == 1) {
        const now = new Date();
        const timeSinceLastDig = Math.floor(
          (now.getTime() - lastDigTime) / 1000
        );

        if (timeSinceLastDig >= 1) {
          const replenishedEnergy = Math.min(
            INITIAL_DIGS,
            energy + timeSinceLastDig * REPLENISH_RATE
          );
          setEnergy(replenishedEnergy);
          g_energy = replenishedEnergy;
          lastDigTime = now.getTime(); // Update last dig time to now
        }
      }
    };

    const interval = setInterval(replenishEnergy, 1000);
    return () => clearInterval(interval);
  }, [energy, setEnergy]);

  const renderSwordIndicators = () => {
    const indicators = [];
    if (activePowerUp) {
      if (activePowerUp >= 1.5) {
        indicators.push(
          <img
            key="sword1"
            src="/img/pirate1.png"
            alt="pirate"
            className="animated-sword"
            style={{ position: "absolute", left: "18%" }}
          />
        );
      }
      if (activePowerUp >= 3) {
        indicators.push(
          <img
            key="sword2"
            src="/img/pirate2.png"
            alt="pirate"
            className="animated-sword"
            style={{ position: "absolute", left: "45%" }}
          />
        );
      }
      if (activePowerUp >= 5) {
        indicators.push(
          <img
            key="sword3"
            src="/img/pirate3.png"
            alt="pirate"
            className="animated-sword"
            style={{ position: "absolute", left: "72%" }}
          />
        );
      }
    }
    return indicators;
  };

  const disconnectWallet = () => {
    disconnectKeylessAccount();
    navigate("/");
  };

  const handlePowerUpButtonClick = () => {
    togglePowerUpModal();
    setIsMenuOpen(false); // Close the menu
  };

  if (activeAccount && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce"></div>
          <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce2"></div>
          <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce"></div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
          <p className="text-sm text-gray-500">Your game data is on its way!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div {...bind()} className=" flex justify-center items-center pt-3 h-screen">
        <div className="flex flex-col items-center w-full max-w-sm rounded-custom">
          <Header
            onHamburgerClick={toggleMenu}
            walletConnected={!!activeAccount}
          />

          <div
            className="bg-[url('/img/Scroll.png')] bg-100 w-full bg-contain h-60 bg-no-repeat 
                          flex justify-center place-items-center"
          >
            <MapComponent
              growingSquare={growingSquare}
              mapImage={mapImage}
              squares={squares}
              setSquares={setSquares}
            />
          </div>
          <div className="flex items-center justify-around gap-5">
            <img
              src="img/Icon23.png"
              className="w-6 h-6 mr-[-26px] mt-[-8px] z-10 "
              alt="dig map"
            />
            <img src="img/gold3.png" className="w-12 h-12 " alt="dig map" />
            <h1 className="text-2xl sm:text-xl">{digs}</h1>
          </div>
          <div className="mt-3 flex flex-col justify-center items-center font-semibold font-TreasureMapDeadhand">
            <div className=" w-full text-xs items-center">
              <div className="grid grid-cols-2 w-full text-center ">
                <p className="text-[14px] text-center  ">
                  Earned Pool <br />
                  {earnedPool ? totalPool : 0}
                </p>
                <p className="text-[14px] text-center ">
                  Total Pool <br />
                  {totalPool ? totalPool : 0}
                </p>
              </div>
              <div className="flex justify-center items-center">
                <p className="text-[14px] text-center ">
                  Daily Pool <br />
                  {dailyPool ? dailyPool : 0}
                </p>
              </div>
            </div>
            <div className="relative flex flex-col justify-center items-center">
              <div id="coinContainer " className="w-full flex justify-center items-center mb-1n">
                <div className="relative w-full h-20 flex justify-center items-center text-center bg-center">
                  <button
                    id="digButton"
                    onClick={handleDig}
                    className=" w-16 h-16 sm:w-20 sm:h-20 scale-90 border-2 border-[#333333] 
                  bg-no-repeat rounded-full p-2 overflow-hidden animation-btn "
                  >
                    <img src="/img/shade.png" alt="" />
                  </button>
                </div>
              </div>
              {!activePowerUp && (
                <button
                  onClick={togglePowerUpModal}
                  role="button"
                  className="text-xs flex justify-center items-center mb-1
                  gap-1 px-2 transition
                  bg-[url('/img/yellowbutton.png')] bg-100 bg-no-repeat text-black
                     "
                >
                  <img
                    src="img/lightning_yellow.png"
                    alt=""
                    width={18}
                    height={18}
                  />
                  <span className="text-lg"> Power Ups </span>
                </button>
              )}
              {activePowerUp && powerUpTimer !== null ? (
                <button
                  className={`leading-[15px] text-xs px-2 py-0.5 rounded-lg transition my-3 ${
                    energy >= 300
                      ? "bg-green-600 text-white hover:bg-green-700 glow"
                      : "bg-gray-400 text-gray-800 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (energy >= 300) {
                      setDigSpeed(DEFAULT_DIG_SPEED * activePowerUp);
                      setAutoDig(true); // Continue the original dig
                    } else {
                      setShowDisabledMessage(true);
                      setTimeout(() => setShowDisabledMessage(false), 3000);
                    }
                  }}
                >
                  {activePowerUp}x Power Up ({Math.floor(powerUpTimer / 60)}m{" "}
                  {powerUpTimer % 60 > 9
                    ? powerUpTimer % 60
                    : "0" + (powerUpTimer % 60)}
                  s)
                </button>
              ) : (
                ""
              )}
              {showDisabledMessage && (
                <p className="text-xs text-center text-red-500 mt-2">
                  Please wait for DIG bar to regenerate to 300, before
                  reactivating
                </p>
              )}
            </div>
            <div className="flex flex-col justify-center items-center w-full gap-3 mt-1 relative mb-[-15dpx]">
              <Box sx={{ width: "200px" }}>
                <LinearProgress
                  variant="determinate"
                  value={(energy / INITIAL_DIGS) * 100}
                  sx={{
                    height: 8,
                    borderRadius: "20px",
                    backgroundColor: activePowerUp ? "gold" : "white",
                  }} // Change color when Power Up is active
                />
                {activePowerUp && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    {renderSwordIndicators()}
                  </div>
                )}
              </Box>
              <span className="absolute right-0 top-2">{energy}</span>
            </div>
            <div className="flex justify-center items-center font-TreasureMapDeadhand">
              <FormControlLabel
                onChange={handleAutoDig}
                control={<IOSSwitch checked={autoDig} sx={{ m: 1 }} />}
                label="Auto Dig"
              />
              <img
                onClick={handleAutoDig}
                className="ml-[-12px]"
                src="/img/restart_yellow.png"
                alt="dig again"
                width={15}
              />
            </div>
            {renderGameStartTime()}
            <div className="w-full text-center text-lg pt-1 font-TreasureMapDeadhand font-semibold">
              <div className="flex justify-center items-center ">
                <p className="text-[13px] leading-tight">Total</p>
              </div>
              <div className="grid grid-cols-2 w-full text-center">
                <p className="text-[13px] leading-tight">Digs {digs}</p>
                <p className="text-[13px] leading-tight">Holes Dug {holes}</p>
              </div>
              <div className="w-full grid grid-cols-2 text-center text-lg pt-1">
                <p className="flex flex-col justify-center items-center text-[13px] leading-tight">
                  Accounts {account}
                </p>
                <p className="flex flex-col justify-center items-center text-[13px] leading-tight">
                  Transactions {transaction}
                </p>
              </div>
            </div>
          </div>
          <Footer />
        </div>

        {gameState == 0 && (
          <div className="absolute left-auto text-2xl font-bold bg-yellow-200 border-2 px-3 py-1">
            Event Ended
          </div>
        )}

        {gameState == 2 && (
          <div className=" absolute left-auto text-2xl font-bold bg-yellow-200 border-2 px-3 py-1">
            Game Under Maintenance
          </div>
        )}

        <SlideOutMenu
          isOpen={isMenuOpen}
          onClose={toggleMenu}
          loggedIn={!!activeAccount}
          disconnectWallet={disconnectWallet}
          walletConnected={!!activeAccount}
          onPowerUpClick={handlePowerUpButtonClick} // Pass down the combined handler
        />
        <PowerUpModal
          isOpen={isPowerUpModalOpen}
          onClose={togglePowerUpModal}
          walletConnected={!!activeAccount}
          onPowerUp={handlePowerUp}
          activePowerUp={activePowerUp} // Pass active power-up state
        />
      </div>
    </div>
  );
};

export default App;
