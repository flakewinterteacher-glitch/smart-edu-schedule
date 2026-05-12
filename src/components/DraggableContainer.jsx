import React, { useRef, useState } from 'react';

export default function DraggableContainer({ children, className }) {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const startDrag = (e) => {
        // ป้องกันการลากถ้าผู้ใช้คลิกที่ช่องพิมพ์ข้อความ (Input) หรือปุ่ม (Button)
        if (['INPUT', 'BUTTON', 'TEXTAREA'].includes(e.target.tagName)) return;
        
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setStartY(e.pageY - scrollRef.current.offsetTop);
        setScrollLeft(scrollRef.current.scrollLeft);
        setScrollTop(scrollRef.current.scrollTop);
    };

    const stopDrag = () => setIsDragging(false);

    const onDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const y = e.pageY - scrollRef.current.offsetTop;
        const walkX = (x - startX) * 1.5; // ความเร็วในการเลื่อนแนวนอน
        const walkY = (y - startY) * 1.5; // ความเร็วในการเลื่อนแนวตั้ง
        scrollRef.current.scrollLeft = scrollLeft - walkX;
        scrollRef.current.scrollTop = scrollTop - walkY;
    };

    return (
        <div 
            ref={scrollRef}
            onMouseDown={startDrag}
            onMouseLeave={stopDrag}
            onMouseUp={stopDrag}
            onMouseMove={onDrag}
            /* min-h-0 คือพระเอกที่ทำให้ Scrollbar แนวตั้งทำงาน และเห็นวันศุกร์! */
            className={`overflow-auto min-h-0 w-full ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'} ${className}`}
        >
            {children}
        </div>
    );
}