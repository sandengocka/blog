export const GAME_WIDTH = 600;
export const GAME_HEIGHT = 400;
export const TRUCK_SIZE = { width: 80, height: 40 };
export const BIN_SIZE = { width: 30, height: 30 };
export const TRUCK_SPEED = 5;
export const BIN_SPEED = 2;

export const barriers = [
  { x: 100, y: 50, width: 400, height: 20 }, // Top barrier
  { x: 100, y: 50, width: 20, height: 300 }, // Left barrier
  { x: 480, y: 50, width: 20, height: 300 }, // Right barrier
  { x: 100, y: 330, width: 150, height: 20 }, // Bottom-left barrier
  { x: 350, y: 330, width: 150, height: 20 }, // Bottom-right barrier
];

export const gate = {
  x: 250,
  y: 330,
  width: 100,
  height: 20,
  isOpen: false,
};

export const levels = [
  {
    number: 1,
    stationaryBins: 8,
    movingBins: 0,
    hasBarriers: false,
    timeLimit: 60,
  },
  {
    number: 2,
    stationaryBins: 4,
    movingBins: 4,
    hasBarriers: false,
    timeLimit: 120,
  },
  {
    number: 3,
    stationaryBins: 4,
    movingBins: 4,
    hasBarriers: true,
    timeLimit: 120,
  },
  {
    number: 4,
    stationaryBins: 0,
    movingBins: 8,
    hasBarriers: true,
    timeLimit: 180,
  },
];
