"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameView } from "@/games/components/game-view";
import {
  barriers,
  gate as initialGate,
  levels,
  GAME_WIDTH,
  GAME_HEIGHT,
  TRUCK_SIZE,
  BIN_SIZE,
  TRUCK_SPEED,
  BIN_SPEED,
} from "@/games/game-config";

interface TrashBin {
  x: number;
  y: number;
  isEmpty: boolean;
  isLifting: boolean;
  moving: boolean;
  direction: { x: number; y: number };
}

interface Barrier {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function TrashTruckGame() {
  const [truckPosition, setTruckPosition] = useState({ x: 200, y: 200 });
  const [trashBins, setTrashBins] = useState<TrashBin[]>([]);
  const [score, setScore] = useState(0);
  const [isPickingUp, setIsPickingUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStatus, setGameStatus] = useState<
    "notStarted" | "playing" | "won" | "lost" | "levelComplete"
  >("notStarted");
  const [isMoving, setIsMoving] = useState(false);
  const [gateState, setGateState] = useState(initialGate);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const lastMoveTime = useRef(Date.now());
  const [isMobile, setIsMobile] = useState(false);
  const mobileSpeedMultiplier = 3;

  const isCollidingWithBarriers = useCallback(
    (
      object: { x: number; y: number; width: number; height: number },
      barrierList: Barrier[]
    ) => {
      return barrierList.some(
        (barrier) =>
          object.x < barrier.x + barrier.width &&
          object.x + object.width > barrier.x &&
          object.y < barrier.y + barrier.height &&
          object.y + object.height > barrier.y
      );
    },
    []
  );

  const generateValidBinPosition = useCallback(
    (moving: boolean, currentBarriers: Barrier[]): { x: number; y: number } => {
      let newX, newY;
      do {
        newX = Math.random() * (GAME_WIDTH - BIN_SIZE.width);
        newY = Math.random() * (GAME_HEIGHT - BIN_SIZE.height);
      } while (
        isCollidingWithBarriers(
          { x: newX, y: newY, width: BIN_SIZE.width, height: BIN_SIZE.height },
          currentBarriers
        )
      );
      return { x: newX, y: newY };
    },
    [isCollidingWithBarriers]
  );

  const initializeLevel = useCallback(
    (levelNumber: number) => {
      const level = levels[levelNumber - 1];
      const currentBarriers = level.hasBarriers ? barriers : [];

      const newBins: TrashBin[] = [];

      // Generate stationary bins
      for (let i = 0; i < level.stationaryBins; i++) {
        const { x, y } = generateValidBinPosition(false, currentBarriers);
        newBins.push({
          x,
          y,
          isEmpty: false,
          isLifting: false,
          moving: false,
          direction: { x: 0, y: 0 },
        });
      }

      // Generate moving bins
      for (let i = 0; i < level.movingBins; i++) {
        const { x, y } = generateValidBinPosition(true, currentBarriers);
        newBins.push({
          x,
          y,
          isEmpty: false,
          isLifting: false,
          moving: true,
          direction: {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
          },
        });
      }

      setTrashBins(newBins);
      setScore(0);
      setTimeLeft(level.timeLimit);
      setTruckPosition({ x: 200, y: 200 });
      setGateState({ ...initialGate, isOpen: !level.hasBarriers });
      setGameStatus("playing");
      setShowContinueButton(false);
    },
    [generateValidBinPosition]
  );

  const startGame = useCallback(() => {
    setCurrentLevel(1);
    initializeLevel(1);
  }, [initializeLevel]);

  const nextLevel = useCallback(() => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
      setShowContinueButton(true);
      setGameStatus("levelComplete");
    } else {
      setGameStatus("won");
    }
  }, [currentLevel]);

  const continueToNextLevel = useCallback(() => {
    initializeLevel(currentLevel);
  }, [currentLevel, initializeLevel]);

  useEffect(() => {
    if (gameStatus === "playing" && trashBins.every((bin) => bin.isEmpty)) {
      nextLevel();
    }
  }, [gameStatus, trashBins, nextLevel]);

  const moveTruck = useCallback(
    (direction: string) => {
      if (gameStatus !== "playing") return;

      setTruckPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        // Apply the appropriate speed based on device type
        const effectiveSpeed = isMobile
          ? TRUCK_SPEED * mobileSpeedMultiplier
          : TRUCK_SPEED;

        switch (direction) {
          case "ArrowUp":
            newY = Math.max(0, prev.y - effectiveSpeed);
            break;
          case "ArrowDown":
            newY = Math.min(
              GAME_HEIGHT - TRUCK_SIZE.height,
              prev.y + effectiveSpeed
            );
            break;
          case "ArrowLeft":
            newX = Math.max(0, prev.x - effectiveSpeed);
            break;
          case "ArrowRight":
            newX = Math.min(
              GAME_WIDTH - TRUCK_SIZE.width,
              prev.x + effectiveSpeed
            );
            break;
        }

        const newPosition = {
          x: newX,
          y: newY,
          width: TRUCK_SIZE.width,
          height: TRUCK_SIZE.height,
        };

        // Check if truck is near the gate
        const isNearGate =
          newPosition.x < gateState.x + gateState.width &&
          newPosition.x + newPosition.width > gateState.x &&
          newPosition.y < gateState.y + gateState.height &&
          newPosition.y + newPosition.height > gateState.y;

        // Open the gate if the truck is near
        if (isNearGate && !gateState.isOpen) {
          setGateState((prev) => ({ ...prev, isOpen: true }));
        }

        // Close the gate if the truck moves away
        if (
          !isNearGate &&
          gateState.isOpen &&
          levels[currentLevel - 1].hasBarriers
        ) {
          setGateState((prev) => ({ ...prev, isOpen: false }));
        }

        // Allow movement if not colliding with barriers or if the gate is open
        if (
          !isCollidingWithBarriers(
            newPosition,
            levels[currentLevel - 1].hasBarriers ? barriers : []
          ) ||
          (isNearGate && gateState.isOpen)
        ) {
          setIsMoving(true);
          lastMoveTime.current = Date.now();
          return { x: newX, y: newY };
        }
        return prev;
      });
    },
    [
      gameStatus,
      gateState,
      isCollidingWithBarriers,
      currentLevel,
      isMobile,
      mobileSpeedMultiplier,
    ]
  );

  const pickupTrash = useCallback(() => {
    if (gameStatus !== "playing") return;

    setIsPickingUp(true);
    setTrashBins((prevBins) => {
      return prevBins.map((bin) => {
        const isColliding =
          truckPosition.x < bin.x + BIN_SIZE.width &&
          truckPosition.x + TRUCK_SIZE.width > bin.x &&
          truckPosition.y < bin.y + BIN_SIZE.height &&
          truckPosition.y + TRUCK_SIZE.height > bin.y &&
          Math.abs(
            truckPosition.y +
              TRUCK_SIZE.height / 2 -
              (bin.y + BIN_SIZE.height / 2)
          ) < 20;

        if (isColliding && !bin.isEmpty) {
          setScore((prevScore) => prevScore + 1);
          return { ...bin, isEmpty: true, isLifting: true, moving: false };
        }
        return bin;
      });
    });

    setTimeout(() => {
      setIsPickingUp(false);
      setTrashBins((prevBins) =>
        prevBins.map((bin) => ({ ...bin, isLifting: false }))
      );
    }, 200);
  }, [truckPosition, gameStatus]);

  useEffect(() => {
    // Track which keys are currently pressed
    const keysPressed = new Set<string>();
    let moveInterval: NodeJS.Timeout | null = null;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        // Only add the key if it's not already in the set
        if (!keysPressed.has(key)) {
          keysPressed.add(key);

          // If this is the first arrow key pressed, start the interval
          if (keysPressed.size === 1) {
            // Move immediately on first press
            moveTruck(key);

            // Set up interval for continuous movement
            moveInterval = setInterval(() => {
              // Process all currently pressed keys
              keysPressed.forEach((direction) => {
                moveTruck(direction);
              });
            }, 50); // Move every 50ms for smooth movement
          }
        }
      } else if (event.key === "p") {
        pickupTrash();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        keysPressed.delete(key);

        // If no arrow keys are pressed anymore, clear the interval
        if (keysPressed.size === 0 && moveInterval) {
          clearInterval(moveInterval);
          moveInterval = null;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (moveInterval) clearInterval(moveInterval);
    };
  }, [moveTruck, pickupTrash]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameStatus("lost");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMoveTime.current > 100) {
        setIsMoving(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const moveBins = useCallback(() => {
    setTrashBins((prevBins) =>
      prevBins.map((bin) => {
        if (bin.moving && !bin.isEmpty) {
          let newX = bin.x + bin.direction.x * BIN_SPEED;
          let newY = bin.y + bin.direction.y * BIN_SPEED;

          const newPosition = {
            x: newX,
            y: newY,
            width: BIN_SIZE.width,
            height: BIN_SIZE.height,
          };

          // Check for collisions with barriers and gate
          if (
            isCollidingWithBarriers(
              newPosition,
              levels[currentLevel - 1].hasBarriers ? barriers : []
            ) ||
            (!gateState.isOpen &&
              isCollidingWithBarriers(newPosition, [gateState]))
          ) {
            // Reverse direction if colliding with a barrier or closed gate
            bin.direction.x *= -1;
            bin.direction.y *= -1;
            newX = bin.x;
            newY = bin.y;
          } else {
            // Bounce off walls
            if (newX <= 0 || newX >= GAME_WIDTH - BIN_SIZE.width) {
              bin.direction.x *= -1;
              newX = Math.max(0, Math.min(GAME_WIDTH - BIN_SIZE.width, newX));
            }
            if (newY <= 0 || newY >= GAME_HEIGHT - BIN_SIZE.height) {
              bin.direction.y *= -1;
              newY = Math.max(0, Math.min(GAME_HEIGHT - BIN_SIZE.height, newY));
            }
          }

          // Randomly change direction occasionally
          if (Math.random() < 0.02) {
            bin.direction = {
              x: Math.random() * 2 - 1,
              y: Math.random() * 2 - 1,
            };
          }

          return { ...bin, x: newX, y: newY };
        }
        return bin;
      })
    );
  }, [currentLevel, gateState, isCollidingWithBarriers]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const binMoveInterval = setInterval(() => {
      moveBins();
    }, 50); // Move bins every 50ms for smoother movement

    return () => clearInterval(binMoveInterval);
  }, [gameStatus, moveBins]);

  // Detect mobile device on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile touch controls
  const handleTouchControl = useCallback(
    (action: "up" | "down" | "left" | "right" | "pickup") => {
      if (action === "pickup") {
        pickupTrash();
      } else {
        const directionMap = {
          up: "ArrowUp",
          down: "ArrowDown",
          left: "ArrowLeft",
          right: "ArrowRight",
        };
        moveTruck(directionMap[action]);
      }
    },
    [pickupTrash, moveTruck]
  );

  // Touch controls component with press-and-hold functionality
  const TouchControls = () => {
    if (!isMobile) return null;

    // Refs for animation loop and active action
    const animationFrameIdRef = useRef<number | null>(null);
    const currentActionRef = useRef<string | null>(null);

    // State for tracking which button is active
    const [activeButton, setActiveButton] = useState<
      "up" | "down" | "left" | "right" | "pickup" | null
    >(null);

    // Function to stop the movement loop
    const stopMovementLoop = useCallback(() => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      currentActionRef.current = null;
      setActiveButton(null);
    }, []);

    // Function to start the movement loop
    const startMovementLoop = useCallback(
      (action: "up" | "down" | "left" | "right") => {
        // Set the current action before starting the loop
        currentActionRef.current = action;
        setActiveButton(action);

        // Cancel any previous loop
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }

        // This function repeats until stopped
        const loop = () => {
          // Check if we should continue
          if (currentActionRef.current === action) {
            handleTouchControl(action);
            // Use setTimeout instead of requestAnimationFrame for more reliable performance on mobile
            setTimeout(() => {
              if (currentActionRef.current === action) {
                handleTouchControl(action);
                animationFrameIdRef.current = requestAnimationFrame(loop);
              } else {
                animationFrameIdRef.current = null;
              }
            }, 16); // Approx 60fps
          } else {
            animationFrameIdRef.current = null;
          }
        };

        // Start the loop
        handleTouchControl(action); // Ensure immediate action
        animationFrameIdRef.current = requestAnimationFrame(loop);
      },
      [handleTouchControl]
    );

    // Handle touch start
    const handleTouchStart = useCallback(
      (action: "up" | "down" | "left" | "right" | "pickup") =>
        (e: React.TouchEvent) => {
          e.preventDefault();
          e.stopPropagation();

          // Set active button state
          setActiveButton(action);

          // Call the action immediately
          handleTouchControl(action);

          // Start continuous movement for direction buttons
          if (action !== "pickup") {
            startMovementLoop(action);
          }
        },
      [handleTouchControl, startMovementLoop]
    );

    // Handle touch end
    const handleTouchEnd = useCallback(
      (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Clear active button state
        setActiveButton(null);

        // Stop the movement loop
        stopMovementLoop();
      },
      [stopMovementLoop]
    );

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        stopMovementLoop();
      };
    }, [stopMovementLoop]);

    // Button style helpers
    const getDirectionButtonClass = (
      action: "up" | "down" | "left" | "right"
    ) => {
      return "w-16 h-16 flex items-center justify-center rounded-full text-white text-2xl select-none touch-manipulation bg-gray-800 bg-opacity-50";
    };

    const getPickupButtonClass = () => {
      return "w-16 h-16 flex items-center justify-center rounded-full text-white text-xl font-bold select-none touch-manipulation bg-green-500 bg-opacity-50";
    };

    return (
      <div className="mt-4 select-none" style={{ touchAction: "none" }}>
        <div className="flex flex-row justify-center gap-2 mb-2">
          <button
            id="touch-up"
            className={getDirectionButtonClass("up")}
            onTouchStart={handleTouchStart("up")}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onTouchMove={(e) => e.preventDefault()}
            style={{ touchAction: "none" }}
          >
            ↑
          </button>
        </div>
        <div className="flex flex-row justify-center gap-2">
          <button
            id="touch-left"
            className={getDirectionButtonClass("left")}
            onTouchStart={handleTouchStart("left")}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onTouchMove={(e) => e.preventDefault()}
            style={{ touchAction: "none" }}
          >
            ←
          </button>
          <button
            id="touch-pickup"
            className={getPickupButtonClass()}
            onTouchStart={handleTouchStart("pickup")}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onTouchMove={(e) => e.preventDefault()}
            style={{ touchAction: "none" }}
          >
            PICK
          </button>
          <button
            id="touch-right"
            className={getDirectionButtonClass("right")}
            onTouchStart={handleTouchStart("right")}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onTouchMove={(e) => e.preventDefault()}
            style={{ touchAction: "none" }}
          >
            →
          </button>
        </div>
        <div className="flex flex-row justify-center gap-2 mt-2">
          <button
            id="touch-down"
            className={getDirectionButtonClass("down")}
            onTouchStart={handleTouchStart("down")}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onTouchMove={(e) => e.preventDefault()}
            style={{ touchAction: "none" }}
          >
            ↓
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (gameStatus !== "playing" || timeLeft > 10) return;

    // Create a flashing warning effect for the last 10 seconds
    const warningInterval = setInterval(() => {
      const timerElement = document.querySelector(".timer-warning");
      if (timerElement) {
        timerElement.classList.toggle("text-red-500");
        timerElement.classList.toggle("text-yellow-300");
      }
    }, 500);

    return () => clearInterval(warningInterval);
  }, [gameStatus, timeLeft]);

  return (
    <div
      className={`${
        isMobile
          ? "flex flex-col items-center justify-center p-2 mx-auto"
          : "flex items-center justify-center"
      }`}
    >
      {!isMobile && (
        <div
          className="p-8 bg-gray-900 rounded-lg shadow-lg select-none"
          style={{ boxShadow: "0 0 20px #ff00ff, 0 0 40px #00ffff" }}
        >
          <h1
            className="mb-4 text-4xl font-bold text-center"
            style={{ color: "#ff00ff", textShadow: "2px 2px #00ffff" }}
          >
            Sideloader Trash Truck Game
          </h1>
          {gameStatus === "notStarted" ? (
            <div className="text-center">
              <p className="mb-6 text-white">
                Drive the truck to pick up all the trash bins.
                <br />
                <br />
                Use arrow keys to move and 'p' to pick up trash before the timer
                runs out!
              </p>
              <button
                className="px-6 py-3 text-2xl font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200"
                onClick={startGame}
                style={{ textShadow: "1px 1px #000" }}
              >
                Start Game
              </button>
            </div>
          ) : (
            <>
              <GameView
                truckPosition={truckPosition}
                trashBins={trashBins}
                score={score}
                gameWidth={GAME_WIDTH}
                gameHeight={GAME_HEIGHT}
                isPickingUp={isPickingUp}
                timeLeft={timeLeft}
                isMoving={isMoving}
                barriers={levels[currentLevel - 1].hasBarriers ? barriers : []}
                gate={gateState}
                currentLevel={currentLevel}
              />
              <div className="mt-4 text-center text-white select-none">
                <p>Use arrow keys to move the truck and 'p' to pick up trash</p>
                <p className="text-xl font-bold">Level: {currentLevel}</p>
                <p
                  className={`text-xl font-bold ${
                    timeLeft <= 10 ? "timer-warning text-red-500" : ""
                  }`}
                >
                  Time: {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                  {timeLeft <= 10 && " Hurry!"}
                </p>
                {gameStatus === "won" && (
                  <p className="text-2xl font-bold text-green-500">
                    Congratulations! You completed all levels!
                  </p>
                )}
                {gameStatus === "lost" && (
                  <p className="text-2xl font-bold text-red-500">
                    Time's up! Try again.
                  </p>
                )}
                {gameStatus === "levelComplete" && (
                  <div>
                    <p className="text-2xl font-bold text-green-500">
                      Level {currentLevel - 1} Complete!
                    </p>
                    <button
                      className="mt-4 px-6 py-3 text-2xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      onClick={continueToNextLevel}
                      style={{ textShadow: "1px 1px #000" }}
                    >
                      Continue to Level {currentLevel}
                    </button>
                  </div>
                )}
                {(gameStatus === "won" || gameStatus === "lost") && (
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={startGame}
                  >
                    {gameStatus === "won" ? "Play Again" : "Restart Game"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {isMobile && (
        <>
          {gameStatus === "notStarted" ? (
            <div
              className="text-center select-none p-8 bg-gray-900 rounded-lg shadow-lg"
              style={{ boxShadow: "0 0 20px #ff00ff, 0 0 40px #00ffff" }}
            >
              <h1
                className="mb-4 text-3xl font-bold text-center"
                style={{ color: "#ff00ff", textShadow: "2px 2px #00ffff" }}
              >
                Sideloader Trash Truck Game
              </h1>
              <p className="mb-6 text-white">
                Drive the truck to pick up all the trash bins.
                <br />
                <br />
                Use the touch controls to move and pick up trash before the
                timer runs out!
              </p>
              <button
                className="px-6 py-3 text-2xl font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200"
                onClick={startGame}
                style={{ textShadow: "1px 1px #000" }}
              >
                Start Game
              </button>
            </div>
          ) : (
            <>
              <GameView
                truckPosition={truckPosition}
                trashBins={trashBins}
                score={score}
                gameWidth={GAME_WIDTH}
                gameHeight={GAME_HEIGHT}
                isPickingUp={isPickingUp}
                timeLeft={timeLeft}
                isMoving={isMoving}
                barriers={levels[currentLevel - 1].hasBarriers ? barriers : []}
                gate={gateState}
                currentLevel={currentLevel}
              />
              <div className="mt-4 text-center text-white select-none">
                <p className="text-xl font-bold">Level: {currentLevel}</p>
                <p
                  className={`text-xl font-bold ${
                    timeLeft <= 10 ? "timer-warning text-red-500" : ""
                  }`}
                >
                  Time: {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                  {timeLeft <= 10 && " Hurry!"}
                </p>
                {gameStatus === "won" && (
                  <p className="text-2xl font-bold text-green-500">
                    Congratulations! You completed all levels!
                  </p>
                )}
                {gameStatus === "lost" && (
                  <p className="text-2xl font-bold text-red-500">
                    Time's up! Try again.
                  </p>
                )}
                {gameStatus === "levelComplete" && (
                  <div>
                    <p className="text-2xl font-bold text-green-500">
                      Level {currentLevel - 1} Complete!
                    </p>
                    <button
                      className="mt-4 px-6 py-3 text-2xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      onClick={continueToNextLevel}
                      style={{ textShadow: "1px 1px #000" }}
                    >
                      Continue to Level {currentLevel}
                    </button>
                  </div>
                )}
                {(gameStatus === "won" || gameStatus === "lost") && (
                  <button
                    className="mt-4 px-6 py-3 text-2xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    onClick={startGame}
                    style={{ textShadow: "1px 1px #000" }}
                  >
                    Play Again
                  </button>
                )}
              </div>

              <TouchControls />
            </>
          )}
        </>
      )}
    </div>
  );
}
