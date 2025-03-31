import SmokeParticles from "@/games/components/smoke-particles";

interface GameViewProps {
  truckPosition: { x: number; y: number };
  trashBins: Array<{
    x: number;
    y: number;
    isEmpty: boolean;
    isLifting: boolean;
    moving: boolean;
  }>;
  score: number;
  gameWidth: number;
  gameHeight: number;
  isPickingUp: boolean;
  timeLeft: number;
  isMoving: boolean;
  barriers: Array<{ x: number; y: number; width: number; height: number }>;
  gate: {
    x: number;
    y: number;
    width: number;
    height: number;
    isOpen: boolean;
  };
  currentLevel: number;
}

export const GameView: React.FC<GameViewProps> = ({
  truckPosition,
  trashBins,
  score,
  gameWidth,
  gameHeight,
  isPickingUp,
  timeLeft,
  isMoving,
  barriers,
  gate,
  currentLevel,
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative border-4 border-pink-500"
      style={{
        width: `${gameWidth}px`,
        height: `${gameHeight}px`,
        backgroundColor: "#000",
        boxShadow: "0 0 10px #ff00ff, 0 0 20px #00ffff",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#ff00ff 1px, transparent 1px), linear-gradient(90deg, #ff00ff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.2,
        }}
      />

      {/* Truck */}
      <div
        className="absolute"
        style={{
          left: truckPosition.x,
          top: truckPosition.y,
          width: "80px",
          height: "40px",
          backgroundColor: "#00ff00",
          borderRadius: "5px",
          boxShadow: "0 0 5px #00ff00",
          transition: "all 0.1s ease-out",
        }}
      >
        {/* Truck cab */}
        <div
          className="absolute"
          style={{
            left: "0px",
            top: "5px",
            width: "30px",
            height: "30px",
            backgroundColor: "#008800",
            borderRadius: "5px 0 0 5px",
          }}
        />
        {/* Truck arm */}
        <div
          className="absolute"
          style={{
            left: "40px",
            top: "15px",
            width: "30px",
            height: "10px",
            backgroundColor: "#ff00ff",
            transformOrigin: "left center",
            transform: `translateY(${isPickingUp ? "-15px" : "0px"})`,
            transition: "transform 0.2s ease-out",
          }}
        />
        {/* Truck wheels */}
        <div className="absolute left-2 bottom-0 w-4 h-4 bg-gray-700 rounded-full" />
        <div className="absolute right-2 bottom-0 w-4 h-4 bg-gray-700 rounded-full" />
      </div>

      {/* Trash bins */}
      {trashBins.map((bin, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: bin.x,
            top: bin.y,
            width: "30px",
            height: "30px",
            backgroundColor: bin.moving ? "#ff8000" : "#ff00ff",
            borderRadius: "5px",
            boxShadow: bin.moving ? "0 0 5px #ff8000" : "0 0 5px #ff00ff",
            transform: `translateY(${bin.isLifting ? "-15px" : "0px"})`,
            transition:
              "transform 0.2s ease-out, left 0.05s linear, top 0.05s linear",
          }}
        >
          {/* Bin lid */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "5px",
              backgroundColor: bin.isEmpty
                ? "#00ffff"
                : bin.moving
                ? "#ff8000"
                : "#ff00ff",
              borderRadius: "5px 5px 0 0",
              transform: `rotateX(${bin.isEmpty ? "45deg" : "0deg"})`,
              transformOrigin: "top",
              transition:
                "transform 0.2s ease-out, background-color 0.2s ease-out",
            }}
          />
          {/* Bin wheels */}
          <div className="absolute left-1 bottom-0 w-2 h-2 bg-gray-700 rounded-full" />
          <div className="absolute right-1 bottom-0 w-2 h-2 bg-gray-700 rounded-full" />
        </div>
      ))}

      {/* Barriers */}
      {barriers.map((barrier, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: barrier.x,
            top: barrier.y,
            width: barrier.width,
            height: barrier.height,
            backgroundColor: "#888888",
            boxShadow: "0 0 5px #888888",
          }}
        />
      ))}

      {/* Gate */}
      {barriers.length > 0 && (
        <div
          className="absolute transition-all duration-300"
          style={{
            left: gate.x,
            top: gate.y,
            width: gate.width,
            height: gate.height,
            backgroundColor: gate.isOpen ? "#00ff00" : "#ff0000",
            boxShadow: gate.isOpen ? "0 0 10px #00ff00" : "0 0 10px #ff0000",
            transform: `scaleY(${gate.isOpen ? 0.2 : 1})`,
            transformOrigin: "bottom",
          }}
        />
      )}

      {/* Score */}
      <div
        className="absolute top-2 left-2 text-2xl font-bold"
        style={{ color: "#00ffff", textShadow: "2px 2px #ff00ff" }}
      >
        Score: {score}
      </div>

      {/* Timer */}
      <div
        className="absolute top-2 right-2 text-2xl font-bold"
        style={{ color: "#00ffff", textShadow: "2px 2px #ff00ff" }}
      >
        Time: {formatTime(timeLeft)}
      </div>

      {/* Level */}
      <div
        className="absolute bottom-2 left-2 text-2xl font-bold"
        style={{ color: "#00ffff", textShadow: "2px 2px #ff00ff" }}
      >
        Level: {currentLevel}
      </div>

      <SmokeParticles truckPosition={truckPosition} isMoving={isMoving} />
    </div>
  );
};
