import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 32,
  animate = false,
}) => {
  const content = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Editorial Frame */}
      <rect
        x="3"
        y="3"
        width="26"
        height="26"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {/* Stylized Artist Nib / Stylus */}
      <path
        d="M8 22L16 8L20 12L12 22H8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8 22L10.5 17.5L12.5 19.5L8 22Z"
        fill="currentColor"
      />
      {/* Editorial Sparkle */}
      <path
        d="M21 9L22.5 6L24 9L27 10.5L24 12L22.5 15L21 12L18 10.5L21 9Z"
        fill="currentColor"
      />
    </svg>
  );

  if (animate) {
    return (
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-flex items-center justify-center"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};
