import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ShinyTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  className = "",
  duration = 5,
  delay = 0,
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;

    // Create the shiny effect animation
    gsap.fromTo(
      element,
      {
        backgroundPosition: "100%",
      },
      {
        backgroundPosition: "-100%",
        duration: duration,
        delay: delay,
        ease: "linear",
        repeat: -1,
      }
    );

    return () => {
      // Clean up animation when component unmounts
      gsap.killTweensOf(element);
    };
  }, [duration, delay]);

  return (
    <div
      ref={textRef}
      className={`inline-block bg-gradient-to-r from-primary-400 via-white to-primary-400 bg-[length:200%_100%] bg-clip-text text-transparent ${className}`}
      style={{
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "#38bdf8", // fallback color for accessibility
        fontWeight: 700,
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
