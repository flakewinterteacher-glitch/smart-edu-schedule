import { useState } from 'react'
import type { MasterData } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  masterData: MasterData
  setMasterData: React.Dispatch<React.SetStateAction<MasterData>>
}

export default function DataManager({
  isOpen,
  onClose,
  masterData,
  setMasterData,
}: Props) {
  if (!isOpen) return null

  const [inputs, setInputs] = useState<Record<keyof MasterData, string>>({
    subjects: '',
    teachers: '',
    rooms: '',
  })

  const handleAdd = (category: keyof MasterData) => {
    const val = inputs[category].trim()
    if (!val) return
    if (masterData[category].includes(val))
      return alert('มีข้อมูลนี้อยู่แล้วครับ')

    setMasterData((prev: MasterData) => ({
      ...prev,
      [category]: [...prev[category], val],
    }))
    setInputs((prev) => ({ ...prev, [category]: '' }))
  }

  const handleRemove = (category: keyof MasterData, valToRemove: string) => {
    if (window.confirm(`ยืนยันการลบ "${valToRemove}" ออกจากฐานข้อมูล?`)) {
      setMasterData((prev: MasterData) => ({
        ...prev,
        [category]: prev[category].filter(
          (item: string) => item !== valToRemove
        ),
      }))
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    category: keyof MasterData
  ) => {
    if (e.key === 'Enter') handleAdd(category)
  }

  const sections: {
    id: keyof MasterData
    title: string
    placeholder: string
  }[] = [
    { id: 'subjects', title: '📚 รายวิชา', placeholder: 'เช่น คณิตศาสตร์...' },
    { id: 'teachers', title: '👨‍🏫 ครูผู้สอน', placeholder: 'เช่น อ.ณัฐพงศ์...' },
    { id: 'rooms', title: '🏫 ห้องเรียน', placeholder: 'เช่น ป.4/1...' },
  ]

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🗂️ จัดการฐานข้อมูล (Auto-complete)
          </h2>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm border border-amber-200">
            💡 <b>ทิปส์:</b> พิมพ์ข้อมูลที่ต้องการแล้วกด Enter เพื่อเพิ่ม
          </div>
          {sections.map((sec) => (
            <div key={sec.id} className="space-y-3">
              <h3 className="font-bold text-slate-700 border-b pb-2">
                {sec.title}
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputs[sec.id]}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, [sec.id]: e.target.value }))
                  }
                  onKeyDown={(e) => handleKeyDown(e, sec.id)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder={sec.placeholder}
                />
                <button
                  onClick={() => handleAdd(sec.id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition text-sm"
                >
                  เพิ่ม
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {masterData[sec.id].length === 0 && (
                  <span className="text-xs text-slate-400">
                    ยังไม่มีข้อมูล...
                  </span>
                )}
                {masterData[sec.id].map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-white border border-slate-300 px-3 py-1 rounded-full shadow-sm text-sm font-medium text-slate-700"
                  >
                    {item}
                    <button
                      onClick={() => handleRemove(sec.id, item)}
                      className="ml-1 text-slate-400 hover:text-red-500 font-bold w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-50 transition"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 text-white px-8 py-2 rounded-xl font-bold hover:bg-slate-900 transition shadow-md"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  )
}
