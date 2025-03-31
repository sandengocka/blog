"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

interface SmokeParticlesProps {
  truckPosition: { x: number; y: number };
  isMoving: boolean;
}

const SmokeParticles: React.FC<SmokeParticlesProps> = ({
  truckPosition,
  isMoving,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setParticles((prevParticles) => {
        // Remove old particles
        const updatedParticles = prevParticles
          .filter((p) => p.opacity > 0)
          .map((p) => ({
            ...p,
            y: p.y - 1, // Move particles upwards
            size: p.size + 0.2, // Increase size
            opacity: p.opacity - 0.02, // Fade out
          }));

        // Add new particle
        if (Math.random() < 0.5) {
          updatedParticles.push({
            id: Date.now(),
            x: truckPosition.x + 10 + Math.random() * 20,
            y: truckPosition.y + 30,
            size: 5,
            opacity: 0.7,
          });
        }

        return updatedParticles;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isMoving, truckPosition]);

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "absolute",
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            backgroundColor: "#888",
            opacity: particle.opacity,
            transition: "all 0.05s linear",
          }}
        />
      ))}
    </>
  );
};

export default SmokeParticles;
