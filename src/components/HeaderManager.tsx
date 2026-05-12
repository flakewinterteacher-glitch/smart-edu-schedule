import type { HeaderConfig } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  config: HeaderConfig
  updateConfig: (field: keyof HeaderConfig, value: string) => void
}

export default function HeaderManager({
  isOpen,
  onClose,
  config,
  updateConfig,
}: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🏫 ตั้งค่าข้อมูลหัวกระดาษ
          </h2>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              ชื่อโรงเรียน
            </label>
            <input
              type="text"
              value={config.schoolName || ''}
              onChange={(e) => updateConfig('schoolName', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                ภาคเรียนที่
              </label>
              <input
                type="text"
                value={config.term || ''}
                onChange={(e) => updateConfig('term', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                ปีการศึกษา
              </label>
              <input
                type="text"
                value={config.academicYear || ''}
                onChange={(e) => updateConfig('academicYear', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none"
              />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
            <h3 className="font-bold text-sm text-indigo-700">
              📝 ปรับแต่งข้อความซ้าย-ขวา
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                ข้อความฝั่งซ้าย (ก่อนปีการศึกษา)
              </label>
              <input
                type="text"
                value={config.textLeft || 'ตารางเรียน'}
                onChange={(e) => updateConfig('textLeft', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  ข้อความขวา (โหมดครู)
                </label>
                <input
                  type="text"
                  value={config.textRightTeacher || 'ตารางสอน คุณครู'}
                  onChange={(e) =>
                    updateConfig('textRightTeacher', e.target.value)
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  ข้อความขวา (โหมดนักเรียน)
                </label>
                <input
                  type="text"
                  value={config.textRightStudent || 'ตารางเรียน ระดับชั้น'}
                  onChange={(e) =>
                    updateConfig('textRightStudent', e.target.value)
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition shadow-lg"
          >
            ตกลง และ บันทึก
          </button>
        </div>
      </div>
    </div>
  )
}
