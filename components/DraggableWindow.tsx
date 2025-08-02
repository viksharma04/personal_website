'use client';
import React, { useState, useRef, useEffect } from 'react';

interface DraggableWindowProps {
  zIndex?: number;
  title: string;
  initialPos?: { x: number; y: number };
  children: React.ReactNode;
  icon?: React.ReactNode;
  onFocus?: () => void;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({
  zIndex = 1,
  title,
  initialPos = { x: 100, y: 100 },
  children,
  icon,
  onFocus,
}) => {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const clampPosition = (x: number, y: number) => {
    const box = boxRef.current;
    const width = box?.offsetWidth || window.innerWidth / 3;
    const height = box?.offsetHeight || 300;
    const minX = 0;
    const minY = 0;
    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - height;
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

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
          flex items-center ${dragging ? 'cursor-grabbing' : 'cursor-grab'} select-none
        `}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {icon}
        <span className="text-xs md:text-md font-bold tracking-wider flex-1 flicker">{title}</span>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default DraggableWindow;