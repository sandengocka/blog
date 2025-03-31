export const getGameDimensions = () => {
  // Use sensible defaults for desktop view
  const defaultWidth = 600;
  const defaultHeight = 400;

  // For client-side code only (will be ignored during server-side rendering)
  if (typeof window !== "undefined") {
    // For mobile screens, make game take full width with proportionate height
    if (window.innerWidth < 640) {
      const width = Math.min(window.innerWidth - 20, defaultWidth);
      const height = Math.floor((width / defaultWidth) * defaultHeight);
      return { width, height };
    }
  }

  return { width: defaultWidth, height: defaultHeight };
};

export const GAME_WIDTH = getGameDimensions().width;
export const GAME_HEIGHT = getGameDimensions().height;

// Scale truck and bin sizes proportionally on smaller screens
const scaleFactor =
  typeof window !== "undefined" && window.innerWidth < 640
    ? Math.min((window.innerWidth - 20) / 600, 1)
    : 1;

export const TRUCK_SIZE = {
  width: Math.floor(80 * scaleFactor),
  height: Math.floor(40 * scaleFactor),
};
export const BIN_SIZE = {
  width: Math.floor(30 * scaleFactor),
  height: Math.floor(30 * scaleFactor),
};
export const TRUCK_SPEED = Math.max(3, Math.floor(5 * scaleFactor));
export const BIN_SPEED = Math.max(1, Math.floor(2 * scaleFactor));

// Scale barriers and gate proportionally
const scaleCoords = (value: number): number => Math.floor(value * scaleFactor);

export const barriers = [
  {
    x: scaleCoords(100),
    y: scaleCoords(50),
    width: scaleCoords(400),
    height: scaleCoords(20),
  }, // Top barrier
  {
    x: scaleCoords(100),
    y: scaleCoords(50),
    width: scaleCoords(20),
    height: scaleCoords(300),
  }, // Left barrier
  {
    x: scaleCoords(480),
    y: scaleCoords(50),
    width: scaleCoords(20),
    height: scaleCoords(300),
  }, // Right barrier
  {
    x: scaleCoords(100),
    y: scaleCoords(330),
    width: scaleCoords(150),
    height: scaleCoords(20),
  }, // Bottom-left barrier
  {
    x: scaleCoords(350),
    y: scaleCoords(330),
    width: scaleCoords(150),
    height: scaleCoords(20),
  }, // Bottom-right barrier
];

export const gate = {
  x: scaleCoords(250),
  y: scaleCoords(330),
  width: scaleCoords(100),
  height: scaleCoords(20),
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
