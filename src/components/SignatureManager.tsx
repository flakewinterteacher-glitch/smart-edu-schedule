import type { SignaturesConfig, Signature } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  signatures: SignaturesConfig
  updateSignature: (role: string, field: keyof Signature, value: string) => void
}

export default function SignatureManager({
  isOpen,
  onClose,
  signatures,
  updateSignature,
}: Props) {
  if (!isOpen) return null

  const fields = [
    { id: 'scheduler', label: '1. ลายเซ็นที่ 1 (ซ้าย)' },
    { id: 'reviewer', label: '2. ลายเซ็นที่ 2 (กลาง)' },
    { id: 'approver', label: '3. ลายเซ็นที่ 3 (ขวา)' },
  ]

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            ✍️ ตั้งค่าลายเซ็นท้ายตาราง
          </h2>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {fields.map((role) => (
            <div
              key={role.id}
              className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <label className="block text-sm font-bold text-slate-700">
                {role.label}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    หัวข้อบทบาท
                  </span>
                  <input
                    type="text"
                    value={signatures[role.id]?.position || ''}
                    onChange={(e) =>
                      updateSignature(role.id, 'position', e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    ชื่อ-นามสกุล
                  </span>
                  <input
                    type="text"
                    value={signatures[role.id]?.name || ''}
                    onChange={(e) =>
                      updateSignature(role.id, 'name', e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    ตำแหน่งในโรงเรียน
                  </span>
                  <input
                    type="text"
                    value={signatures[role.id]?.schoolPosition || ''}
                    onChange={(e) =>
                      updateSignature(role.id, 'schoolPosition', e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
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
