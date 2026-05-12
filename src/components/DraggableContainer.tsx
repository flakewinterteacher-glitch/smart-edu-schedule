import { useRef, useState } from 'react'
import type { ReactNode, MouseEvent } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function DraggableContainer({
  children,
  className = '',
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDown, setIsDown] = useState<boolean>(false)
  const [startX, setStartX] = useState<number>(0)
  const [startY, setStartY] = useState<number>(0)
  const [scrollLeft, setScrollLeft] = useState<number>(0)
  const [scrollTop, setScrollTop] = useState<number>(0)

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDown(true)
    // 🌟 ดักเช็ค Null ป้องกัน Vercel โวยวาย
    if (!scrollRef.current) return

    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setStartY(e.pageY - scrollRef.current.offsetTop)
    setScrollLeft(scrollRef.current.scrollLeft)
    setScrollTop(scrollRef.current.scrollTop)
  }

  const handleMouseLeave = () => {
    setIsDown(false)
  }

  const handleMouseUp = () => {
    setIsDown(false)
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown) return
    e.preventDefault()

    // 🌟 ดักเช็ค Null ก่อนใช้งาน
    if (!scrollRef.current) return

    const x = e.pageX - scrollRef.current.offsetLeft
    const y = e.pageY - scrollRef.current.offsetTop
    const walkX = (x - startX) * 1.5 // ความเร็วในการลาก
    const walkY = (y - startY) * 1.5

    scrollRef.current.scrollLeft = scrollLeft - walkX
    scrollRef.current.scrollTop = scrollTop - walkY
  }

  return (
    <div
      ref={scrollRef}
      className={className}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  )
}
