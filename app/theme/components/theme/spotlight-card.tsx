import * as React from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, } from "framer-motion";
import { cn } from "app/theme/lib/utils"
import { MouseEvent, PropsWithChildren } from "react";

const SpotlightCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {

  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };
  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, blue, transparent)`;

  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="">
      <div
        ref={ref}
        className={cn(
          "grow  border h-full  border-slate-300 bg-gradient-to-tl from-slate-300/5 via-slate-300/10 to-cyan-800/7 rounded-md px-10 py-7 duration-700 relative",
          className
        )}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <div className="pointer-events-none">
          <div className="absolute inset-0 z-0  transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
          <motion.div
            className="absolute inset-0 z-10  bg-gradient-to-br opacity-100  via-slate-300/10  transition duration-1000 group-hover:opacity-50 "
            style={style}
          />
          <motion.div
            className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
            style={style}
          />
        </div>


        {props.children}
      </div>
    </div>
  );

});
SpotlightCard.displayName = "SpotlightCard";


const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"


// const SpotlightCard = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => (

//   <div
//     ref={ref}
//     className={cn(
//       "rounded-lg border bg-card text-card-foreground shadow-sm hover:border-cyan-400",
//       className
//     )}
//     {...props}
//   />
// ))
// SpotlightCard.displayName = "SpotlightCard"


export { SpotlightCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
