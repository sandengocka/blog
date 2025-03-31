import TrashTruckGame from "../../../games/trash-truck-game";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trash Truck Game",
  description: "Play the Trash Truck Game - collect all trash bins to win!",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function TrashTruckGamePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black select-none">
      <TrashTruckGame />
    </div>
  );
}
