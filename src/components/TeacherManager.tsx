import type { Tab } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  teachers: Tab[]
  addTeacher: () => void
  removeTeacher: (id: string) => void
  updateTeacherName: (id: string, newName: string) => void
}

export default function TeacherManager({
  isOpen,
  onClose,
  teachers,
  addTeacher,
  removeTeacher,
  updateTeacherName,
}: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            👤 จัดการคุณครู
          </h2>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {teachers.map((t) => (
            <div key={t.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={t.name}
                onChange={(e) => updateTeacherName(t.id, e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none"
              />
              <button
                onClick={() => removeTeacher(t.id)}
                className="bg-red-50 text-red-500 px-3 py-2 rounded-lg font-bold hover:bg-red-100 transition"
              >
                ลบ
              </button>
            </div>
          ))}
          <button
            onClick={addTeacher}
            className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-100 border border-indigo-200 transition border-dashed"
          >
            ➕ เพิ่มคุณครู
          </button>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  )
}
