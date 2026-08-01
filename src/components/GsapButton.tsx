"use client";

import React, { useRef, useEffect, ReactNode, ButtonHTMLAttributes } from "react";
import gsap from "gsap";
import Link from "next/link";

interface GsapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  href?: string;
  blobColor?: string;
  textColorHover?: string;
  innerBg?: string;
  magneticFill?: boolean;
}

export function GsapButton({
  children,
  className,
  href,
  blobColor = "var(--accent)",
  textColorHover = "var(--accent-foreground)",
  innerBg,
  magneticFill = false,
  ...props
}: GsapButtonProps) {
  const containerRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGElement | null>(null);

  useEffect(() => {
    const btn = containerRef.current;
    const blob = blobRef.current;
    const text = textRef.current;

    if (!btn || !blob || !text) return;

    // Find first SVG inside button to animate its color as well
    svgRef.current = btn.querySelector("svg");

    gsap.set(blob, { scale: 0 });

    const getClosestEdge = (mouseX: number, mouseY: number, rect: DOMRect) => {
      const distLeft = Math.abs(mouseX - rect.left);
      const distRight = Math.abs(mouseX - rect.right);
      const distTop = Math.abs(mouseY - rect.top);
      const distBottom = Math.abs(mouseY - rect.bottom);

      const min = Math.min(distLeft, distRight, distTop, distBottom);

      if (min === distLeft) return "left";
      if (min === distRight) return "right";
      if (min === distTop) return "top";
      return "bottom";
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const edge = getClosestEdge(e.clientX, e.clientY, rect);

      let startX = 0;
      let startY = 0;
      const offset = rect.width;

      if (edge === "left") startX = -offset;
      else if (edge === "right") startX = offset;
      else if (edge === "top") startY = -offset;
      else if (edge === "bottom") startY = offset;

      gsap.set(blob, {
        x: startX,
        y: startY,
        scale: 0,
      });

      if (!magneticFill) {
        const scaleNeeded = (rect.width * 2) / 100; 
        gsap.to(blob, {
          duration: 1.0,
          x: 0,
          y: 0,
          scale: Math.max(scaleNeeded, 4), 
          ease: "expo.out",
          overwrite: "auto",
        });

        gsap.to(text, {
          color: textColorHover,
          duration: 0.5,
          delay: 0.1,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (svgRef.current) {
          gsap.to(svgRef.current, {
            color: textColorHover,
            duration: 0.5,
            delay: 0.1,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!magneticFill) return;
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distX = Math.abs(e.clientX - centerX);
      const distY = Math.abs(e.clientY - centerY);
      
      const normX = Math.min(distX / (rect.width / 2), 1);
      const normY = Math.min(distY / (rect.height / 2), 1);
      const normDist = Math.max(normX, normY); 
      
      let progress = 1 - normDist;
      progress = Math.min(progress * 1.5, 1); 
      
      const maxScale = Math.max((rect.width * 2) / 100, 4);
      const currentScale = progress * maxScale;
      
      const targetX = e.clientX - centerX;
      const targetY = e.clientY - centerY;
      
      gsap.to(blob, {
        x: targetX,
        y: targetY,
        scale: currentScale,
        duration: 0.4, 
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const edge = getClosestEdge(e.clientX, e.clientY, rect);

      let endX = 0;
      let endY = 0;
      const offset = rect.width;

      if (edge === "left") endX = -offset;
      else if (edge === "right") endX = offset;
      else if (edge === "top") endY = -offset;
      else if (edge === "bottom") endY = offset;

      gsap.to(blob, {
        duration: 0.9,
        x: magneticFill ? (e.clientX - (rect.left + rect.width / 2)) : endX,
        y: magneticFill ? (e.clientY - (rect.top + rect.height / 2)) : endY,
        scale: 0,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (!magneticFill) {
        gsap.to(text, {
          color: "", 
          clearProps: "color",
          duration: 0.5,
          delay: 0.1,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (svgRef.current) {
          gsap.to(svgRef.current, {
            color: "",
            clearProps: "color",
            duration: 0.5,
            delay: 0.1,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    };

    (btn as HTMLElement).addEventListener("mouseenter", handleMouseEnter);
    (btn as HTMLElement).addEventListener("mousemove", handleMouseMove);
    (btn as HTMLElement).addEventListener("mouseleave", handleMouseLeave);

    return () => {
      (btn as HTMLElement).removeEventListener("mouseenter", handleMouseEnter);
      (btn as HTMLElement).removeEventListener("mousemove", handleMouseMove);
      (btn as HTMLElement).removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [textColorHover, magneticFill]);

  const baseClasses = `relative inline-flex items-center justify-center isolate ${className || ""}`;

  const content = (
    <>
      <span ref={textRef} className={`relative z-[2] flex items-center justify-center gap-2 ${magneticFill ? "mix-blend-difference text-[#ffe600]" : ""}`}>
        {children}
      </span>
      <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none z-[1]">
        {innerBg && <div className="absolute inset-0" style={{ backgroundColor: innerBg }} />}
        <div
          ref={blobRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full pointer-events-none"
          style={{ backgroundColor: blobColor }}
        />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} ref={containerRef as React.Ref<HTMLAnchorElement>} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button ref={containerRef as React.Ref<HTMLButtonElement>} className={baseClasses} {...props}>
      {content}
    </button>
  );
}
