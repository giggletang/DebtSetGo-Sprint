import React from 'react';

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { icon: 24, text: 'text-base' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
  };

  const { icon, text } = sizes[size];
  const green = '#166534'; // dark green

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Stack of money with $ sign */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bottom stack item */}
        <path
          d="M8 36C8 34.8954 8.89543 34 10 34H38C39.1046 34 40 34.8954 40 36V38C40 39.1046 39.1046 40 38 40H10C8.89543 40 8 39.1046 8 38V36Z"
          fill={green}
        />
        {/* Middle stack item */}
        <path
          d="M10 28C10 26.8954 10.8954 26 12 26H36C37.1046 26 38 26.8954 38 28V32C38 33.1046 37.1046 34 36 34H12C10.8954 34 10 33.1046 10 32V28Z"
          fill={green}
        />
        {/* Top stack item (with $ sign) */}
        <path
          d="M12 20C12 18.8954 12.8954 18 14 18H34C35.1046 18 36 18.8954 36 20V26C36 27.1046 35.1046 28 34 28H14C12.8954 28 12 27.1046 12 26V20Z"
          fill={green}
        />
        {/* Dollar sign */}
        <text
          x="24"
          y="28"
          fontSize="14"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          $
        </text>
      </svg>
      
      {/* Logo Text */}
      {showText && (
        <div className={`font-bold ${text}`} style={{ color: green }}>
          <div>Debt</div>
          <div>SetGo</div>
        </div>
      )}
    </div>
  );
}

