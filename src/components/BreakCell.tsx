import React from 'react'

export default function BreakCell() {
  return (
    <td className="p-0 border-b border-r border-slate-200 bg-slate-200/50 align-middle min-w-20 max-w-25 select-none cursor-grab">
      {/* วางลายเส้นและปิดการรับ Click ให้ทะลุไปหาตัวจับลากตาราง */}
      <div
        className="h-full w-full min-h-24 flex items-center justify-center opacity-50 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #cbd5e1 25%, transparent 25%, transparent 75%, #cbd5e1 75%, #cbd5e1), repeating-linear-gradient(45deg, #cbd5e1 25%, #f1f5f9 25%, #f1f5f9 75%, #cbd5e1 75%, #cbd5e1)',
          backgroundPosition: '0 0, 10px 10px',
          backgroundSize: '20px 20px',
        }}
      ></div>
    </td>
  )
}
