import React, { useEffect, useState } from "react";
import "../styles.css";
import { fetchGameState } from "../core/api";
import { useKeylessAccounts } from "../core/useKeylessAccounts";

interface Square {
  id: number;
  digs: number;
}

interface MapProps {
  squares: Square[];
  setSquares: React.Dispatch<React.SetStateAction<Square[]>>;
  growingSquare: number | null;
  mapImage: string;
}

interface UserGridState {
  address: string;
  new_grid_state: number[];
}

const MapComponent: React.FC<MapProps> = ({
  squares,
  setSquares,
  growingSquare,
  mapImage,
}) => {
  const { activeAccount } = useKeylessAccounts();
  let [otherUserState, setOtherUserState] = useState<UserGridState[]>([]);

  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [userIndex, setUserIndex] = useState(0);
  const [gridIndex, setGridIndex] = useState(0);

  const resetMap = () => {
    setSquares(squares.map((square) => ({ ...square, digs: 0 })));
  };

  useEffect(() => {
    if (squares.every((square) => square.digs >= 100)) {
      resetMap();
    }
  }, [squares]);

  const growingEffect = async () => {
    fetchGameState(activeAccount?.accountAddress.toString()).then(
      (response: UserGridState[]) => {
        setOtherUserState([...response]);
        setUserIndex(0);
      }
    );
  };

  useEffect(() => {
    if (otherUserState.length === 0) return;

    const intervalId = setInterval(() => {
      const currentUser = otherUserState[userIndex];

      if (currentUser && gridIndex < currentUser.new_grid_state.length) {
        setCurrentValue(currentUser.new_grid_state[gridIndex]);
        setGridIndex((prevIndex) => prevIndex + 1);
      } else {
        setUserIndex((prevIndex) => prevIndex + 1);
        setGridIndex(0);
      }

      if (userIndex >= otherUserState.length) {
        clearInterval(intervalId);
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, [otherUserState, userIndex, gridIndex]);

  useEffect(() => {
    if (userIndex >= otherUserState.length) {
      setCurrentValue(-1);
      growingEffect();
    }
  }, [userIndex]);

  useEffect(() => {
    let timerId = setTimeout(function tick() {
      if (otherUserState.length === 0) {
        setCurrentValue(-1);
        growingEffect();
      }
      timerId = setTimeout(tick, 1000); // (*)
    }, 1000);
    return () => clearInterval(timerId); // Cleanup on component unmount
  }, []);

  return (
    <div
      className="grid grid-cols-9 bg-center bg-no-repeat bg-cover shadow-custom cursor-pointer w-[65%] h-[80%]"
      // style={{ backgroundImage: `url(${mapImage})` }}
    >
      {squares.map((square) => (
        <div
          key={square.id}
          className={`flip-container w-7 h-6 border border-gray text-center text-sm relative ${
            growingSquare === square.id ? "shake-enlarge" : ""
          }  ${currentValue === square.id ? "shake-enlarge" : ""}`}
        >
          <div className={`flip-card ${square.digs >= 100 ? "flipped" : ""}`}>
            <div
              className={`flip-front w-full h-full bg-no-repeat bg-yellow-50 ${
                square.digs >= 100 ? "hidden" : "block"
              }`}
              style={{
                backgroundImage: `url(${mapImage})`,
                backgroundPosition: `${(square.id % 9) * 11.1}% ${
                  Math.floor(square.id / 9) * 16.6
                }%`,
                backgroundSize: `calc(100% * 9) calc(100% * 6)`,
              }}
            >
              <div
                className={`absolute bottom-0 left-0 w-full h-full ${
                  growingSquare === square.id ? "change-enlarge" : ""
                }  ${currentValue === square.id ? "change-enlarge" : ""} ${
                  growingSquare === square.id ? "change-color" : ""
                } ${currentValue === square.id ? "change-color-other" : ""}`}
                style={{
                  backgroundColor: "#d2b48c", // Sand color
                  height: `${100 - (square.digs / 100) * 100}%`,
                  zIndex: 1,
                }}
              />
              <div
                className="relative transition-transform flex justify-center items-center w-full h-full duration-700 ease-in-out"
                style={{ zIndex: 2 }}
              >
                {square.digs}
              </div>
            </div>
            <div
              className="flip-back bg-no-repeat w-full h-full"
              style={{
                backgroundImage: `url(${mapImage})`,
                backgroundPosition: `${(square.id % 9) * 11.1}% ${
                  Math.floor(square.id / 9) * 16.6
                }%`,
                backgroundSize: `calc(100% * 9) calc(100% * 6)`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MapComponent;
