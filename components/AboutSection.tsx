'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';

const AboutSection = () => {
  const [pos, setPos] = useState({ x: 100, y: 100 })
  const [dragging, setDragging] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const boxRef = useRef<HTMLDivElement>(null)

  const clampPosition = (x: number, y: number) => {
    const box = boxRef.current
    const width = box?.offsetWidth || window.innerWidth / 3
    const height = box?.offsetHeight || 300
    const minX = 0
    const minY = 0
    const maxX = window.innerWidth - width
    const maxY = window.innerHeight - height
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    }
  }

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
    document.body.style.userSelect = 'none'
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true)
    const touch = e.touches[0]
    dragOffset.current = {
      x: touch.clientX - pos.x,
      y: touch.clientY - pos.y,
    }
    document.body.style.userSelect = 'none'
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return
    const next = clampPosition(
      e.clientX - dragOffset.current.x,
      e.clientY - dragOffset.current.y
    )
    setPos(next)
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!dragging) return
    const touch = e.touches[0]
    const next = clampPosition(
      touch.clientX - dragOffset.current.x,
      touch.clientY - dragOffset.current.y
    )
    setPos(next)
  }

  const onMouseUp = () => {
    setDragging(false)
    document.body.style.userSelect = ''
  }

  const onTouchEnd = () => {
    setDragging(false)
    document.body.style.userSelect = ''
  }

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      window.addEventListener('touchmove', onTouchMove)
      window.addEventListener('touchend', onTouchEnd)
    } else {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging])

  return (
    <div
      ref={boxRef}
      className={`
        m-10 flex flex-col absolute z-[1000]
        border-4 border-[#00ff00] bg-[#222] font-mono
        shadow-[4px_4px_0_#0f0,8px_8px_0_#080]
        w-fit
        md:w-1/2
        ${dragging ? 'cursor-grabbing' : ''}
      `}
      style={{
        left: pos.x,
        top: pos.y,
        cursor: dragging ? 'grabbing' : 'default',
      }}
    >
      <div
        className={`
          bg-[#111] text-[#0f0] px-4 py-2 border-b-2 border-[#00ff00]
          flex items-center cursor-grab select-none
        `}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <span
          className="bg-[#0f0] text-[#111] rounded w-3 h-3 inline-block mr-2"
        />
        <span className="text-sm md:text-lg font-bold tracking-wider flex-1 flicker">ABOUT.EXE</span>
        <button
          onClick={e => {
            e.stopPropagation()
            setMinimized(m => !m)
          }}
          className={`
            bg-[#222] border border-[#0f0] text-[#0f0]
            w-5 h-5 text-xs ml-2 cursor-pointer rounded
            flex items-center justify-center p-0
          `}
          aria-label={minimized ? 'Restore' : 'Minimize'}
          tabIndex={0}
        >
          {minimized ? '▢' : '–'}
        </button>
      </div>
      {!minimized && (
        <div className="flex flex-row items-start px-3 py-6 gap-6">
          {/* Left: Image */}
            <div className="flex-shrink-0 flex items-start w-1/4 aspect-square">
              <Image
              src="/pfp.jfif" // Replace with your image path
              alt="Profile"
              width={256}
              height={256}
              className="w-full h-full rounded-full border-2 border-[#0f0] object-cover shadow-lg"
              style={{
                filter:
                'contrast(1.1) saturate(1.1) sepia(0.15) hue-rotate(-10deg) brightness(1.1) drop-shadow(2px 2px 0 #0f0)',
                imageRendering: 'pixelated',
              }}
              />
            </div>
          {/* Right: Text */}
          <div>
            <header className="text-xl md:text-3xl text-[#0f0] mb-2">
              Vik Sharma
            </header>
            <ul className="text-md md:text-2xl text-[#0f0]">
              <li className="py-2">I design and build AI-driven trading and research tools.</li>
              <li className="py-2">I love combining Python, React, and cloud tech to solve real-world problems.</li>
              <li className="py-2">I&apos;m passionate about quantitative finance, automation, and open-source projects.</li>
              <li className="py-2">I enjoy experimenting with 3D graphics and vintage computer aesthetics in web design.</li>
              <li className="py-2">Always learning, iterating, and sharing ideas with the community.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default AboutSection