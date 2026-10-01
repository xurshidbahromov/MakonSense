import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-[linear-gradient(120deg,rgba(12,65,55,1)_0%,rgba(12,65,55,0.7)_35%,rgba(6,214,160,1)_50%,rgba(12,65,55,0.7)_65%,rgba(12,65,55,1)_100%)] bg-[length:250%_100%] ${
        !disabled ? 'animate-[shiny-sweep_5s_linear_infinite]' : ''
      } ${className}`}
      style={{ animationDuration }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
