"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import * as React from "react";

type Props = {
   children: React.ReactNode;
   width?: number;
   height?: number;
};

type ContextProps = {
   zoom: number;
   setZoom: (n: number) => void;
};

const ZoomPanContext = React.createContext<ContextProps | undefined>(undefined);

export default function ZoomPanProvider({ children }: Props) {
   const [zoom, setZoom] = React.useState(1);
   // const containerRef = useRef<HTMLDivElement | null>(null);
   // const contentRef = useRef<HTMLDivElement | null>(null);
   // const [extra, setExtra] = useState({ x: 0, y: 0 });
   // const [position, setPosition] = useState({ x: 0, y: 0 });
   // const [contentSize, setContentSize] = useState({ width: 0, height: 0 });

   // const lastPosRef = useRef({ x: 0, y: 0 });

   // Handle zoom via Ctrl + Wheel
   // useEffect(() => {
   //    const handler = (e: WheelEvent) => {
   //       if (!e.ctrlKey || !containerRef.current) return;

   //       const rect = containerRef.current.getBoundingClientRect();
   //       const inBounds =
   //          e.clientX >= rect.left &&
   //          e.clientX <= rect.right &&
   //          e.clientY >= rect.top &&
   //          e.clientY <= rect.bottom;

   //       if (!inBounds) return;

   //       e.preventDefault();
   //       setZoom((prev) => {
   //          const next = prev + (e.deltaY > 0 ? -0.1 : 0.1);
   //          return Math.min(5, Math.max(0.5, next));
   //       });

   //       if (contentRef.current) {
   //          // const width = contentRef.current.clientWidth;
   //          // const height = contentRef.current.clientHeight;
   //          // setPosition(() => {
   //          //    return {
   //          //       x: width / 1.5 - lastPosRef.current.x,
   //          //       y: height / 1.5 - lastPosRef.current.y,
   //          //    };
   //          // });
   //          const width = containerRef.current.clientWidth;
   //          const height = containerRef.current.clientHeight;
   //          setPosition(() => {
   //             return {
   //                x: width * 0.5 - lastPosRef.current.x,
   //                y: height * 0.5 - lastPosRef.current.y,
   //             };
   //          });
   //       }
   //    };

   //    window.addEventListener("wheel", handler, { passive: false });
   //    return () => window.removeEventListener("wheel", handler);
   // }, [position]);

   // // Update content size on zoom
   // useEffect(() => {
   //    if (contentRef.current && containerRef.current) {
   //       const baseWidth = contentRef.current.scrollWidth;
   //       const baseHeight = contentRef.current.scrollHeight;
   //       setContentSize({ width: baseWidth * zoom, height: baseHeight * zoom });

   //       const rect1 = containerRef.current.getBoundingClientRect();
   //       const rect2 = contentRef.current.getBoundingClientRect();
   //       if (containerRef.current && rect2.width > rect1?.width) {
   //          setExtra((p) => ({ x: rect2.width - rect1.width, y: p.y }));
   //       } else {
   //          setExtra((p) => ({ x: 0, y: p.y }));
   //       }

   //       if (containerRef.current && rect2.height > rect1?.height) {
   //          setExtra((p) => ({ y: rect2.height - rect1.height, x: p.x }));
   //       }
   //    }
   // }, [zoom]);

   return <ZoomPanContext value={{ zoom, setZoom }}>{children}</ZoomPanContext>;
}

const ZoomPanContainer = ({ children }: { children: React.ReactNode }) => {
   const isMobile = useIsMobile();
   const [isVerticalScroll, setVerticalScroll] = React.useState(false);
   const [isHorizontalScroll, setHorizontalScroll] = React.useState(false);
   const [scrollSize, setScrollSize] = React.useState({
      sx: { size: 0, pos: { x: 0, y: 0 } },
      sy: { size: 0, pos: { x: 0, y: 0 } },
   });
   const { zoom, setZoom } = useZoomContext();
   const [position, setPosition] = React.useState({ x: 0, y: 0 });
   const containerRef = React.useRef<HTMLDivElement | null>(null);
   const contentRef = React.useRef<HTMLDivElement | null>(null);
   const isDraggingRef = React.useRef(false);
   const dragStartRef = React.useRef({ x: 0, y: 0 });
   const lastPosRef = React.useRef({ x: 0, y: 0 });

   React.useEffect(() => {
      const handler = (e: WheelEvent) => {
         if (!containerRef.current) return;

         if (!e.ctrlKey) {
            if (!contentRef.current || !containerRef.current) return;

            const rawContentHeight = contentRef.current.offsetHeight;
            const zoomedContentHeight = rawContentHeight * zoom;
            const mainHeight = containerRef.current.clientHeight;

            const maxScrollY = zoomedContentHeight - mainHeight;
            const deltaY = e.deltaY;
            const nextY = position.y - deltaY;

            const clampedY = Math.min(0, Math.max(-maxScrollY, nextY));
            setPosition((prev) => ({ ...prev, y: clampedY }));

            // 👇 Recalculate thumb height
            const scrollbarHeight = (mainHeight / zoomedContentHeight) * mainHeight;
            const scrollbarMaxY = mainHeight - scrollbarHeight;

            // 👇 Calculate how far content has scrolled (positive value)
            const scrolledY = -clampedY;

            // 👇 Calculate thumb Y position proportionally
            const scrollbarY = Math.min(
               Math.max(0, (scrolledY / maxScrollY) * scrollbarMaxY),
               scrollbarMaxY,
            );

            setScrollSize((p) => ({
               ...p,
               sy: { pos: { x: 0, y: scrollbarY }, size: scrollbarHeight },
            }));

            return;
         }

         const rect = containerRef.current.getBoundingClientRect();
         const inBounds =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

         if (!inBounds) return;

         e.preventDefault();
         const next = zoom + (e.deltaY > 0 ? -0.1 : 0.1);
         const newZoom = Math.min(5, Math.max(0.5, next));
         setZoom(newZoom);

         const width = containerRef.current.clientWidth;
         const height = containerRef.current.clientHeight;
         setPosition(() => {
            return {
               x: width * 0.5 - lastPosRef.current.x,
               y: height * 0.5 - lastPosRef.current.y,
            };
         });

         if (contentRef.current) {
            const rawContentHeight = contentRef.current.offsetHeight;
            const zoomedContentHeight = rawContentHeight * zoom;
            const mainHeight = containerRef.current.clientHeight;

            if (mainHeight < zoomedContentHeight) {
               setVerticalScroll(true);

               const maxScrollY = zoomedContentHeight - mainHeight;
               const scrolledY = -position.y;

               const scrollbarHeight = (mainHeight / zoomedContentHeight) * mainHeight;
               const scrollbarMaxY = mainHeight - scrollbarHeight;
               const scrollbarY = Math.min(
                  Math.max(0, (scrolledY / maxScrollY) * scrollbarMaxY),
                  scrollbarMaxY,
               );

               setScrollSize((prev) => ({
                  ...prev,
                  sy: {
                     size: scrollbarHeight,
                     pos: { x: 0, y: scrollbarY },
                  },
               }));
            } else {
               setVerticalScroll(false);
            }

            const rawContentWidth = contentRef.current.offsetWidth;
            const zoomedContentWidth = rawContentWidth * zoom;
            const mainWidth = containerRef.current.clientWidth;

            if (mainWidth < zoomedContentWidth) {
               setHorizontalScroll(true);

               const maxScrollX = zoomedContentWidth - mainWidth;
               const scrolledX = -position.x;

               const scrollbarWidth = (mainWidth / zoomedContentWidth) * mainWidth;
               const scrollbarMaxX = mainWidth - scrollbarWidth;
               const scrollbarX = Math.min(
                  Math.max(0, (scrolledX / maxScrollX) * scrollbarMaxX),
                  scrollbarMaxX,
               );

               setScrollSize((prev) => ({
                  ...prev,
                  sx: {
                     size: scrollbarWidth,
                     pos: { y: 0, x: scrollbarX },
                  },
               }));
            } else {
               setHorizontalScroll(false);
            }
         }
      };

      window.addEventListener("wheel", handler, { passive: false });
      return () => window.removeEventListener("wheel", handler);
   }, [position, setZoom, zoom]);

   // React.useEffect(() => {
   //    const onMouseMove = (e: MouseEvent) => {
   //       if (!isMobile) return;
   //       if (!isDraggingRef.current) return;
   //       const dx = e.clientX - dragStartRef.current.x;
   //       const dy = e.clientY - dragStartRef.current.y;
   //       setPosition({
   //          x: lastPosRef.current.x + dx,
   //          y: lastPosRef.current.y + dy,
   //       });
   //    };

   //    const onMouseUp = () => {
   //       if (isDraggingRef.current && isMobile) {
   //          lastPosRef.current = position;
   //          isDraggingRef.current = false;
   //       }
   //    };

   //    window.addEventListener("mousemove", onMouseMove);
   //    window.addEventListener("mouseup", onMouseUp);

   //    return () => {
   //       window.removeEventListener("mousemove", onMouseMove);
   //       window.removeEventListener("mouseup", onMouseUp);
   //    };
   // }, [position, isMobile]);

   return (
      <div
         ref={containerRef}
         className="w-full h-full flex justify-center items-center relative overflow-hidden"
      >
         {isVerticalScroll && (
            <>
               <div
                  className="z-50 hover:w-3 hover:scale-105 rounded-xl transition-all absolute right-0 w-2 bg-foreground/75"
                  style={{ height: scrollSize.sy.size + "px", top: `${scrollSize.sy.pos.y}px` }}
               />
            </>
         )}
         {isHorizontalScroll && (
            <>
               <div
                  className="z-[100] hover:h-3 hover:scale-105 rounded-xl transition-all absolute bottom-0 h-2 bg-foreground/75"
                  style={{ width: scrollSize.sx.size + "px", left: `${scrollSize.sx.pos.x}px` }}
               />
            </>
         )}
         <div
            ref={contentRef}
            onPointerMove={(e) => {
               lastPosRef.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerDown={(e) => {
               isDraggingRef.current = true;
               dragStartRef.current = { x: e.clientX, y: e.clientY };
            }}
            className="w-full h-full grid place-items-center relative"
            style={{
               transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
               transformOrigin: "center",
               transition: "transform 0.1s ease-out",
               // cursor: isDraggingRef.current ? "grabbing" : "grab",
            }}
         >
            {children}
         </div>
      </div>
   );
};

const useZoomContext = () => {
   const ctx = React.useContext(ZoomPanContext);
   if (!ctx) throw new Error("zoom context must be used within provider");
   return ctx;
};

export { useZoomContext, ZoomPanContainer };
