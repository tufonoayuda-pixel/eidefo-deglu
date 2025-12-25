"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Syringe, Droplet, Soup, Cookie, Apple, Milk, GlassWater, LucideIcon } from 'lucide-react'; // Changed 'Water' to 'GlassWater'

// Array of icon components to choose from
const iconComponents: LucideIcon[] = [Syringe, Droplet, Soup, Cookie, Apple, Milk, GlassWater]; // Updated to use GlassWater

interface FallingIconProps {
  id: string;
  Icon: LucideIcon;
  left: number;
  duration: number;
  delay: number;
  initialRotation: number;
  finalRotation: number;
}

const FallingIcon: React.FC<FallingIconProps> = ({ Icon, left, duration, delay, initialRotation, finalRotation }) => {
  return (
    <div
      className="absolute text-efodea-blue opacity-70"
      style={{
        left: `${left}px`,
        top: '-30px', // Start above the viewport
        animation: `fall ${duration}s linear ${delay}s forwards`,
        '--initial-rotation': `${initialRotation}deg`,
        '--final-rotation': `${finalRotation}deg`,
      } as React.CSSProperties} // Type assertion for custom CSS properties
    >
      <Icon size={24} />
    </div>
  );
};

const FallingDeglutitionIcons: React.FC = () => {
  const [icons, setIcons] = useState<FallingIconProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const createFallingIcon = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const startX = Math.random() * (containerWidth - 30); // -30 to keep icon within bounds
    const delay = Math.random() * 3; // Delay before starting to fall (0 to 3s)
    const duration = 5 + Math.random() * 5; // Duration of fall (5 to 10s)
    const initialRotation = Math.random() * 360;
    const finalRotation = initialRotation + 720 + Math.random() * 360; // Rotate at least twice

    const Icon = iconComponents[Math.floor(Math.random() * iconComponents.length)];
    const id = Math.random().toString(36).substring(2, 9);

    const newIcon: FallingIconProps = {
      id,
      Icon,
      left: startX,
      duration,
      delay,
      initialRotation,
      finalRotation,
    };

    setIcons((prevIcons) => [...prevIcons, newIcon]);

    // Remove icon after its animation finishes + a small buffer
    setTimeout(() => {
      setIcons((prevIcons) => prevIcons.filter((icon) => icon.id !== id));
    }, (duration + delay + 1) * 1000); // Add 1s buffer
  }, []);

  useEffect(() => {
    // Add keyframes to a style tag in the head
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fall {
        0% { transform: translateY(0) rotate(var(--initial-rotation)); opacity: 0.7; }
        100% { transform: translateY(calc(100vh + 50px)) rotate(var(--final-rotation)); opacity: 0; }
      }
    `;
    document.head.appendChild(styleSheet);

    const interval = setInterval(createFallingIcon, 800); // Create a new icon every 0.8 seconds

    return () => {
      clearInterval(interval);
      document.head.removeChild(styleSheet);
    };
  }, [createFallingIcon]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((icon) => (
        <FallingIcon key={icon.id} {...icon} />
      ))}
    </div>
  );
};

export default FallingDeglutitionIcons;