import create from "zustand";

interface Square {
  id: number;
  digs: number;
}

interface State {
  dig: number;
  energy: number;
  autoDig: boolean;
  digSpeed: number;
  growingSquare: number | null;
  squares: Square[];
  activePowerUp: number | null;
  powerUpTimer: number;
  lastDigTime: Date | null;
  setDig: (dig: number) => void;
  setEnergy: (energy: number) => void;
  setAutoDig: (autoDig: boolean) => void;
  setDigSpeed: (digSpeed: number) => void;
  setGrowingSquare: (growingSquare: number | null) => void;
  setSquares: (squares: Square[] | ((prev: Square[]) => Square[])) => void;
  setActivePowerUp: (activePowerUp: number | null) => void;
  setPowerUpTimer: (powerUpTimer: number | ((prev: number) => number)) => void;
  setLastDigTime: (lastDigTime: Date | null) => void;
}

const INITIAL_SQUARES = Array(72)
  .fill(0)
  .map((_, index) => ({ id: index, digs: 0 }));

export const useStore = create<State>((set) => ({
  dig: 0,
  energy: 500,
  autoDig: false,
  digSpeed: 5,
  growingSquare: null,
  squares: INITIAL_SQUARES,
  activePowerUp: null,
  powerUpTimer: 0,
  lastDigTime: null,
  setDig: (dig) => set({ dig }),
  setEnergy: (energy) => set({ energy }),
  setAutoDig: (autoDig) => set({ autoDig }),
  setDigSpeed: (digSpeed) => set({ digSpeed }),
  setGrowingSquare: (growingSquare) => set({ growingSquare }),
  setSquares: (squares) => set((state) => ({
    squares: typeof squares === "function" ? squares(state.squares) : squares,
  })),
  setActivePowerUp: (activePowerUp) => set({ activePowerUp }),
  setPowerUpTimer: (powerUpTimer) => set((state) => ({
    powerUpTimer: typeof powerUpTimer === "function" ? powerUpTimer(state.powerUpTimer) : powerUpTimer,
  })),
  setLastDigTime: (lastDigTime) => set({ lastDigTime }),
}));
