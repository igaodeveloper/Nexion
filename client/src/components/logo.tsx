interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

export function Logo({ size = "md", variant = "full" }: LogoProps) {
  const sizes = {
    sm: {
      icon: 24,
      text: "text-lg"
    },
    md: {
      icon: 32,
      text: "text-xl"
    },
    lg: {
      icon: 48,
      text: "text-2xl"
    },
  };

  const iconWidth = sizes[size].icon;
  const iconHeight = sizes[size].icon;
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-shrink-0">
        <svg 
          width={iconWidth} 
          height={iconHeight} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background shape - Notion style block */}
          <rect x="10" y="10" width="80" height="80" rx="15" fill="#FF87D4" />
          
          {/* Center geometric pattern - Affine style */}
          <path 
            d="M30 30 L70 30 L70 70 L30 70 Z" 
            fill="#FFFFFF" 
            fillOpacity="0.9"
          />
          
          {/* Abstract lines - Affine style */}
          <path 
            d="M35 40 L65 40 M35 50 L65 50 M35 60 L65 60" 
            stroke="#FF3BA5" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          
          {/* Dot elements - Notion style */}
          <circle cx="30" cy="30" r="3" fill="#FF3BA5" />
          <circle cx="70" cy="30" r="3" fill="#FF3BA5" />
          <circle cx="30" cy="70" r="3" fill="#FF3BA5" />
          <circle cx="70" cy="70" r="3" fill="#FF3BA5" />
        </svg>
      </div>
      
      {variant === "full" && (
        <span 
          className={`font-semibold ${sizes[size].text}`}
          style={{ color: "#FF3BA5" }}
        >
          Nexion
        </span>
      )}
    </div>
  );
}
