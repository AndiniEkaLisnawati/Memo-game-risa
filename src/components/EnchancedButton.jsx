"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const enhancedButtonVariants = cva(
  `
  relative cursor-pointer outline-none align-middle no-underline
  font-inherit touch-manipulation font-semibold uppercase
  rounded-xl transform-gpu transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]
  before:absolute before:content-[''] before:w-full before:h-full
  before:top-0 before:left-0 before:right-0 before:bottom-0
  before:rounded-xl
  before:transform before:translate3d-[0,0.75em,-1em]
  before:transition-all before:duration-150 before:ease-[cubic-bezier(0,0,0.58,1)]
  hover:translate-y-1
  active:translate-y-3
  `,
  {
    variants: {
      variant: {
        default: `
          text-[#382b22] bg-[#fff0f0] border-2 border-[#b18597]
          before:bg-[#f9c4d2] before:shadow-[0_0_0_2px_#b18597,0_0.625em_0_0_#ffe3e2]
          hover:bg-[#ffe9e9] hover:before:shadow-[0_0_0_2px_#b18597,0_0.5em_0_0_#ffe3e2]
          active:bg-[#ffe9e9] active:before:shadow-[0_0_0_2px_#b18597,0_0_#ffe3e2]
        `,
        success: `
          text-white bg-green-200 border-2 border-green-600
          before:bg-green-300 before:shadow-[0_0_0_2px_#166534,0_0.625em_0_0_#bbf7d0]
          hover:bg-green-100 hover:before:shadow-[0_0_0_2px_#166534,0_0.5em_0_0_#bbf7d0]
          active:bg-green-100 active:before:shadow-[0_0_0_2px_#166534,0_0_#bbf7d0]
        `,
        warning: `
          text-yellow-900 bg-yellow-200 border-2 border-yellow-500
          before:bg-yellow-300 before:shadow-[0_0_0_2px_#854d0e,0_0.625em_0_0_#fef08a]
          hover:bg-yellow-100 hover:before:shadow-[0_0_0_2px_#854d0e,0_0.5em_0_0_#fef08a]
          active:bg-yellow-100 active:before:shadow-[0_0_0_2px_#854d0e,0_0_#fef08a]
        `,
        danger: `
          text-white bg-orange-200 border-2 border-orange-600
          before:bg-orange-300 before:shadow-[0_0_0_2px_#9a3412,0_0.625em_0_0_#fed7aa]
          hover:bg-orange-100 hover:before:shadow-[0_0_0_2px_#9a3412,0_0.5em_0_0_#fed7aa]
          active:bg-orange-100 active:before:shadow-[0_0_0_2px_#9a3412,0_0_#fed7aa]
        `,
        info: `
          text-white bg-blue-200 border-2 border-blue-600
          before:bg-blue-300 before:shadow-[0_0_0_2px_#1e3a8a,0_0.625em_0_0_#bfdbfe]
          hover:bg-blue-100 hover:before:shadow-[0_0_0_2px_#1e3a8a,0_0.5em_0_0_#bfdbfe]
          active:bg-blue-100 active:before:shadow-[0_0_0_2px_#1e3a8a,0_0_#bfdbfe]
        `,
      },
      size: {
        default: "h-10 px-6 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const EnhancedButton = React.forwardRef(
  (
    { className, variant, size, asChild = false, animation = "hover", onClick, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const btnRef = React.useRef(null);

    const handleClick = (e) => {
      onClick?.(e);

      if (animation === "click" && btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { scale: 0.9 },
          { scale: 1, duration: 0.25, ease: "power2.out" }
        );
      }
    };

    React.useEffect(() => {
      if (!btnRef.current) return;

      if (animation === "hover") {
        const el = btnRef.current;
        const handleEnter = () =>
          gsap.to(el, { scale: 1.05, duration: 0.2, ease: "power2.out" });
        const handleLeave = () =>
          gsap.to(el, { scale: 1, duration: 0.2, ease: "power2.out" });

        el.addEventListener("mouseenter", handleEnter);
        el.addEventListener("mouseleave", handleLeave);

        return () => {
          el.removeEventListener("mouseenter", handleEnter);
          el.removeEventListener("mouseleave", handleLeave);
        };
      }

      if (animation === "pulse") {
        gsap.to(btnRef.current, {
          scale: 1.05,
          repeat: -1,
          yoyo: true,
          duration: 1.2,
          ease: "power1.inOut",
        });
      }
    }, [animation]);

    return (
      <Comp
        ref={(node) => {
          btnRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(enhancedButtonVariants({ variant, size, className }))}
        onClick={handleClick}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Comp>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, enhancedButtonVariants };
