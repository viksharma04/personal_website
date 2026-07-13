'use client';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Close } from '@nsmr/pixelart-react';

interface DraggableWindowProps {
  zIndex?: number;
  title: string;
  initialPos?: { x: number; y: number };
  children: React.ReactNode;
  icon?: React.ReactNode;
  onFocus?: () => void;
  onClose?: () => void;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({
  zIndex = 1,
  title,
  initialPos = { x: 100, y: 100 },
  children,
  icon,
  onFocus,
  onClose,
}) => {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const clampPosition = (x: number, y: number) => {
    // Clamp against the layout viewport (documentElement), not window.innerWidth.
    // On mobile the two diverge — innerWidth can report a larger value than the
    // vw-based viewport the windows are sized and positioned in — which left the
    // cascaded windows unclamped and spilling off the right edge on phones.
    const doc = document.documentElement;
    const box = boxRef.current;
    const width = box?.offsetWidth || doc.clientWidth / 3;
    const height = box?.offsetHeight || 300;
    const minX = 0;
    const minY = 0;
    const maxX = doc.clientWidth - width;
    const maxY = doc.clientHeight - height;
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  // Keep the window inside the viewport on open and on resize. The cascade
  // offsets in initialPos are tuned for desktop; on phones the near-full-width
  // windows would otherwise spill off the right/bottom edge, since clamping had
  // only ever run mid-drag.
  useLayoutEffect(() => {
    const clampIntoView = () => setPos((p) => clampPosition(p.x, p.y));
    clampIntoView();
    window.addEventListener('resize', clampIntoView);
    return () => window.removeEventListener('resize', clampIntoView);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    document.body.style.userSelect = 'none';
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - pos.x,
      y: touch.clientY - pos.y,
    };
    document.body.style.userSelect = 'none';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPos(clampPosition(
      e.clientX - dragOffset.current.x,
      e.clientY - dragOffset.current.y
    ));
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setPos(clampPosition(
      touch.clientX - dragOffset.current.x,
      touch.clientY - dragOffset.current.y
    ));
  };

  const stopDrag = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', stopDrag);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDrag);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDrag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  return (
    <div
      ref={boxRef}
      role="dialog"
      aria-label={title}
      data-testid="draggable-window"
      className={`
        flex flex-col absolute z-[1000]
        border-4 border-[#00ff00] bg-[#222] font-mono
        shadow-[4px_4px_0_#0f0,8px_8px_0_#080]
        w-[90vw] h-[70vh]
        sm:w-[80vw] sm:h-[65vh]
        md:w-[70vw] md:h-[60vh]
        lg:w-[50vw] lg:h-[55vh]
        xl:w-[40vw] xl:h-[50vh]
        max-w-[600px] max-h-[500px]
        min-w-[280px] min-h-[200px]
      `}
      style={{
        left: pos.x,
        top: pos.y,
        zIndex,
      }}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      <div
        className={`
          bg-[#111] text-[#0f0] px-4 py-2 border-b-2 border-[#00ff00]
          flex items-center gap-2 ${dragging ? 'cursor-grabbing' : 'cursor-grab'} select-none
        `}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {icon}
        <span className="text-xs md:text-md font-bold tracking-wider flex-1 flicker">{title}</span>
        {onClose && (
          <button
            type="button"
            aria-label={`Close ${title}`}
            onClick={onClose}
            // Don't let a press on the close control begin a drag/focus.
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="flex items-center justify-center text-[#0f0] hover:bg-[#0f0] hover:text-[#111] bg-transparent border-none p-0 cursor-pointer transition-colors"
          >
            <Close size={18} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default DraggableWindow;