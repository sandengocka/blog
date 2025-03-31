import TrashTruckGame from "../../../games/trash-truck-game";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Trash Truck Game",
  description: "Play the Trash Truck Game - collect all trash bins to win!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function TrashTruckGamePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black select-none">
      <TrashTruckGame />
    </div>
  );
}
