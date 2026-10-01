import React, { useState, useRef } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  disabled?: boolean;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  magnetStrength = 3,
  activeTransition = 'transform 0.18s cubic-bezier(0.25, 1, 0.5, 1)',
  inactiveTransition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
  className = '',
  disabled = false,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    setPosition({
      x: distanceX / magnetStrength,
      y: distanceY / magnetStrength,
    });
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

export default Magnet;
