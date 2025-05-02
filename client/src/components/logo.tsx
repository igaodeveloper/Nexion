interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon";
  theme?: "light" | "dark";
}

export function Logo({
  size = "md",
  variant = "full",
  theme = "light",
}: LogoProps) {
  const sizes = {
    sm: {
      icon: 24,
      text: "text-lg",
    },
    md: {
      icon: 32,
      text: "text-xl",
    },
    lg: {
      icon: 48,
      text: "text-2xl",
    },
    xl: {
      icon: 64,
      text: "text-3xl",
    },
  };

  const themeColors = {
    light: {
      primary: "#6366F1", // Indigo primary
      secondary: "#A5B4FC", // Lighter indigo
      accent: "#4F46E5", // Deeper indigo
      text: "#4338CA", // Indigo text
    },
    dark: {
      primary: "#818CF8", // Lighter indigo for dark theme
      secondary: "#6366F1", // Indigo for dark theme
      accent: "#4F46E5", // Deeper indigo
      text: "#A5B4FC", // Light indigo text for dark theme
    },
  };

  const colors = themeColors[theme];
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
          className="drop-shadow-sm"
        >
          {/* Hexagonal base */}
          <path d="M50 5L90 28V72L50 95L10 72V28L50 5Z" fill={colors.primary} />

          {/* Inner geometric element */}
          <path
            d="M50 20L75 35V65L50 80L25 65V35L50 20Z"
            fill="white"
            fillOpacity="0.9"
          />

          {/* N letter stylized */}
          <path
            d="M40 40V60L60 40V60"
            stroke={colors.accent}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Connection dots */}
          <circle cx="33" cy="33" r="3" fill={colors.secondary} />
          <circle cx="67" cy="33" r="3" fill={colors.secondary} />
          <circle cx="33" cy="67" r="3" fill={colors.secondary} />
          <circle cx="67" cy="67" r="3" fill={colors.secondary} />
        </svg>
      </div>

      {variant === "full" && (
        <span
          className={`font-bold tracking-tight ${sizes[size].text}`}
          style={{ color: colors.text }}
        >
          Nexion
        </span>
      )}
    </div>
  );
}
