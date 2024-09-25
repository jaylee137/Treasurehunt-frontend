import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useGesture } from "@use-gesture/react";
import Footer2 from "../layouts/Footer2";

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  loggedIn: boolean;
  walletConnected: boolean;
  disconnectWallet: () => void;
  onPowerUpClick: () => void;
}

const SlideOutMenu: React.FC<SlideOutMenuProps> = ({
  isOpen,
  onClose,
  loggedIn,
  onPowerUpClick,
  walletConnected,
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const bind = useGesture({
    onDrag: ({ direction: [xDir], velocity: [xVel] }) => {
      if (xVel > 0.5 && xDir > 0) {
        onClose();
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 500); // Duration of slide-out animation
    }
  }, [isOpen]);

  return ReactDOM.createPortal(
    <div
      {...bind()}
      className={`fixed inset-0 flex justify-end items-start z-50 transition-transform ${
        isOpen ? "slide-in" : "slide-out"
      } ${isVisible ? "visible" : "slide-out-menu"}`}
    >
      <div
        id="content"
        className="flex flex-col relative justify-center items-center shadow-xl h-screen gap-20 w-full p-3"
      >
        <div className="w-full mx-auto flex flex-col justify-center h-full items-center max-w-sm ">
          <div className="relative w-full mb-2 flex items-center justify-center">
            <img
              src="/img/image.png"
              alt="Sample image"
              className="object-contain w-40"
            />
            <div className="flex gap-2 absolute right-2 top-8">
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
          {loggedIn ? (
            <div
              className="w-[90%] bg-[url('/img/framepannel.png')] bg-100 bg-no-repeat 
                         py-12 pb-8 flex items-center justify-center flex-col gap-6 relative"
            >
              <div className="absolute top-[-20px] left-0 w-[100%] flex justify-center">
                <img
                  src="/img/m-title.png"
                  alt="title"
                  className="w-72 object-contain "
                />
              </div>
              <button
                onClick={() => navigate("/treasurevault")}
                className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                flex items-center gap-2 text-sm py-2 px-2 w-1/2 relative"
              >
                <img
                  src="/treasure.png"
                  alt="icon"
                  width={15}
                  className="ml-4 absolute"
                />
                <span className="flex-1 text-center">Treasure Vault</span>
              </button>
              <button
                onClick={() => navigate("/leaderboard")}
                className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                flex items-center gap-2 text-sm py-2 px-2 w-1/2 relative"
              >
                <img
                  src="/img/off_yellow.png"
                  alt="icon"
                  width={15}
                  className="ml-4 absolute"
                />
                <span className="flex-1 text-center"> Leaderboard</span>{" "}
              </button>
              <button
                onClick={onPowerUpClick}
                className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                flex items-center gap-2 text-sm py-2 px-2 w-1/2 relative"
              >
                <img
                  src="/img/lightning_yellow.png"
                  alt="icon"
                  width={15}
                  className="ml-4 absolute"
                />
                <span className="flex-1 text-center"> Power Ups</span>{" "}
              </button>
              <button
                onClick={() => navigate("/findtreasure")}
                className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                flex items-center gap-2 text-sm py-2 px-2 w-1/2 relative"
              >
                <img
                  src="/img/zoom_yellow.png"
                  alt="icon"
                  width={15}
                  className="ml-4 absolute"
                />
                <span className="flex-1 text-center"> Find Treasure</span>{" "}
              </button>
            </div>
          ) : (
            <div
              className="w-[90%] bg-[url('/img/menu-bg.png')] bg-100 bg-no-repeat 
                         py-16 pb-12 flex items-center justify-center flex-col gap-6"
            >
              <button
                onClick={() => navigate("/login")}
                className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                           flex items-center gap-2 text-sm py-2 px-2 w-1/2 relative"
              >
                <img
                  src="/img/person_yellow.png"
                  alt="icon"
                  width={15}
                  className="ml-4 absolute"
                />
                <span className="flex-1 text-center"> Signup</span>
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                flex items-center gap-2 text-sm py-2 px-2 w-1/2 relative"
              >
                <img
                  src="/img/off_yellow.png"
                  alt="icon"
                  width={15}
                  className="ml-4 absolute"
                />
                <span className="flex-1 text-center"> Login</span>{" "}
              </button>
              <button
                onClick={() => navigate("/leaderboard")}
                className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                flex items-center gap-2 text-sm py-2 px-2 w-1/2 relative"
              >
                <img
                  src="img/off_yellow.png"
                  alt="icon"
                  width={15}
                  className="ml-4 absolute"
                />
                <span className="flex-1 text-center"> Leaderboard</span>
              </button>
              <button
                onClick={onPowerUpClick}
                className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                flex items-center gap-2 text-sm py-2 px-2 w-1/2 relative"
              >
                <img
                  src="/img/lightning_yellow.png"
                  alt="icon"
                  width={15}
                  className="ml-4 absolute"
                />
                <span className="flex-1 text-center"> Power Ups</span>{" "}
              </button>
              <button
                onClick={() => navigate("/findtreasure")}
                className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                flex items-center gap-2 text-sm py-2 px-2 w-1/2 relative"
              >
                <img
                  src="/img/zoom_yellow.png"
                  alt="icon"
                  width={15}
                  className="ml-4 absolute"
                />
                <span className="flex-1 text-center"> Find Treasure</span>
              </button>
            </div>
          )}
          <button
            className="bg-[url('/img/brownbutton.png')] bg-100 bg-no-repeat text-black font-bold
                       text-sm py-1 px-1 w-1/3 mt-4"
            onClick={onClose}
          >
            Close
          </button>
          <div className="mb-4 w-full">
            <Footer2 />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SlideOutMenu;
