import { FcCalendar } from "react-icons/fc";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-6",
    md: "h-10",
    lg: "h-14",
  };

  return (
    <div className="flex items-center gap-2">
      <FcCalendar 
        className={`${sizes[size]} text-primary`} 
        style={{ color: "hsl(var(--primary))" }}
      />
      <span 
        className={`font-semibold text-primary ${size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl"}`}
        style={{ color: "hsl(var(--primary))" }}
      >
        Friday<span className="text-gray-400 font-light">.</span>
      </span>
    </div>
  );
}
