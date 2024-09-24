import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onHamburgerClick: () => void;
  walletConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onHamburgerClick,
  walletConnected,
}) => {
  const navigate = useNavigate();
  return (
    <header className="w-full px-2 pr-4 flex justify-between items-center">
      <div>
        <h1 className="text-md font-bold ">On Chain Treasure Hunt</h1>
        <div className="left-0 w-full py-1">
          <h3 className="text-xs">Multiplayer tap game </h3>
          <h3 className="text-xs">Dig holes, power up, find treasure</h3>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
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
        <button onClick={onHamburgerClick} className="text-3xl">
          &#9776;
        </button>
      </div>
    </header>
  );
};

export default Header;
