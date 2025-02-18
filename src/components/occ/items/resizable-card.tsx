"use client";

import { cn } from "@/lib/utils";
import { motion, PanInfo } from "framer-motion";
import { useEffect, useState } from "react";

type Positions = "top" | "bottom" | "left" | "right" | "corner";

interface ResizableCardProps {
  resizePosition: Positions;
  children: React.ReactNode;
}

interface Dimension {
  width: number;
  height: number;
}

function ResizableCard({ resizePosition, children }: ResizableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState<Dimension>({
    width: 224,
    height: 224,
  });

  const containerVariants = {
    top: "pt-7 bg-gradient-to-b",
    bottom: "pb-7 bg-gradient-to-t",
    left: "pl-7 bg-gradient-to-r",
    right: "pr-7 bg-gradient-to-l",
    corner: "bg-gradient-to-tl",
  };

  const handleDrag = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    if (resizePosition === "bottom") {
      setDimensions((prev) => ({
        ...prev,
        height: Math.max(56, prev.height + info.delta.y),
      }));
    } else if (resizePosition === "top") {
      setDimensions((prev) => ({
        height: Math.max(56, prev.height - info.delta.y),
        width: prev.width,
      }));
    } else if (resizePosition === "right") {
      setDimensions((prev) => ({
        ...prev,
        width: Math.max(56, prev.width + info.delta.x),
      }));
    } else if (resizePosition === "left") {
      setDimensions((prev) => ({
        width: Math.max(56, prev.width - info.delta.x),
        height: prev.height,
      }));
    } else if (resizePosition === "corner") {
      setDimensions((prev) => ({
        width: Math.max(56, prev.width + info.delta.x),
        height: Math.max(56, prev.height + info.delta.y),
      }));
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "auto";
      document.body.style.userSelect = "auto";
    }
  }, [isDragging]);

  return (
    <motion.div
      className={cn(
        "relative flex max-h-[calc(100dvh-2rem)] min-h-[224px] min-w-[224px] max-w-[calc(100dvw-2rem)] items-center justify-center rounded-xl p-2 transition duration-500 bg-border",
        containerVariants[resizePosition],
        isDragging && "from-border to-card",
      )}
      style={{ width: dimensions.width, height: dimensions.height }}
      whileTap={{ scale: 0.98 }}
    >
      <ResizableCardContent>{children}</ResizableCardContent>
      <ResizableCardHandler
        {...{ resizePosition, handleDrag, isDragging, setIsDragging }}
      />
    </motion.div>
  );
}

function ResizableCardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark:border-z inset-x-0 top-0 h-full w-full origin-left overflow-hidden rounded-lg border bg-card p-2">
      {children}
    </div>
  );
}

function ResizableCardHandler({
  resizePosition,
  handleDrag,
  isDragging,
  setIsDragging,
}: {
  resizePosition: "top" | "bottom" | "left" | "right" | "corner";
  handleDrag: (event: MouseEvent | TouchEvent, info: PanInfo) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}) {
  const handleVariant = {
    top: "h-1 w-20 top-3 left-1/2 transform -translate-x-1/2",
    bottom: "h-1 w-20 bottom-3 left-1/2 transform -translate-x-1/2",
    left: "h-20 w-1 left-3 top-1/2 transform -translate-y-1/2",
    right: "h-20 w-1 right-3 top-1/2 transform -translate-y-1/2",
    corner: "w-10 h-10 rounded-full bottom-0 right-0 border-8 bg-foreground/40",
  };

  return (
    <motion.span
      className={cn(
        "absolute w-full cursor-grab rounded-lg bg-foreground/40 transition-transform hover:scale-125",
        handleVariant[resizePosition],
        isDragging && "scale-125 bg-foreground/60",
      )}
      onPan={handleDrag}
      onPanStart={() => setIsDragging(true)}
      onPanEnd={() => setIsDragging(false)}
    />
  );
}

export default function ResizableCardDemo() {
  const [position, setPosition] = useState<Positions>("bottom");
  const buttonClassName =
    "relative flex h-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-zinc-50 dark:bg-zinc-950 px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800";

  return (
    <>
      <div className="absolute left-3 top-3 z-10 flex space-x-2">
        <button className={buttonClassName} onClick={() => setPosition("top")}>
          Top
        </button>
        <button
          className={buttonClassName}
          onClick={() => setPosition("bottom")}
        >
          Bottom
        </button>
        <button className={buttonClassName} onClick={() => setPosition("left")}>
          Left
        </button>
        <button
          className={buttonClassName}
          onClick={() => setPosition("right")}
        >
          Right
        </button>
        <button
          className={buttonClassName}
          onClick={() => setPosition("corner")}
        >
          Corner
        </button>
      </div>
      <ResizableCard resizePosition={position}>
        <div className="flex h-full flex-col gap-5 p-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
            <div className="flex flex-col items-start justify-center">
              <p>Cesar Brandon</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                @burando_03
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Software Developer | Crafting efficient, precise solutions
          </p>
          <div className="flex w-full flex-col gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded border border-zinc-950/10 px-4 py-2 dark:border-zinc-800"
              >
                <div className="flex flex-col items-center justify-center">
                  <p>Task {index + 1}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {index + 1} hours
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            ))}
          </div>
        </div>
      </ResizableCard>
    </>
  );
}
