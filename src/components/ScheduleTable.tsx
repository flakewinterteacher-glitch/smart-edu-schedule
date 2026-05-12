import React, { useState } from 'react'
import DayRow from '@/components/DayRow'
import { DAYS_OF_WEEK } from '@/constants/config'
import type {
  Tab,
  ScheduleEntry,
  ConflictRecord,
  SignaturesConfig,
  HeaderConfig,
  MasterData,
  DayTheme,
} from '@/types'

interface Props {
  tab: Tab
  viewMode: 'teacher' | 'student'
  timeSlots: string[]
  scheduleData: ScheduleEntry[]
  updateData: (
    tabId: string,
    dayId: string,
    timeIndex: number,
    field: keyof ScheduleEntry,
    value: string
  ) => void
  updateTimeSlot: (index: number, newValue: string) => void
  removeTimeSlot: (index: number) => void
  moveTimeSlot: (fromIndex: number, toIndex: number) => void
  globalConflicts: ConflictRecord[]
  signatures: SignaturesConfig
  headerConfig: HeaderConfig
  masterData: MasterData
}

export default function ScheduleTable({
  tab,
  viewMode,
  timeSlots,
  scheduleData,
  updateData,
  updateTimeSlot,
  removeTimeSlot,
  moveTimeSlot,
  globalConflicts,
  signatures,
  headerConfig,
  masterData,
}: Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [draggedCol, setDraggedCol] = useState<number | null>(null)
  const [dragOverCol, setDragOverCol] = useState<number | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLTableCellElement>,
    index: number
  ) => {
    if (viewMode === 'student') return
    setDraggedCol(index)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (
    e: React.DragEvent<HTMLTableCellElement>,
    index: number
  ) => {
    if (viewMode === 'student') return
    e.preventDefault()
    if (dragOverCol !== index) setDragOverCol(index)
  }
  const handleDrop = (
    e: React.DragEvent<HTMLTableCellElement>,
    index: number
  ) => {
    if (viewMode === 'student') return
    e.preventDefault()
    if (draggedCol !== null && draggedCol !== index) {
      moveTimeSlot(draggedCol, index)
    }
    setDraggedCol(null)
    setDragOverCol(null)
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm relative print:overflow-visible print:border-none print:shadow-none print:w-full print:h-auto print:m-0 print:p-0">
      <div className="hidden print:flex flex-col items-center justify-center mb-4 print:mb-1 w-full text-black">
        <div
          className={`mb-2 print:mb-1 relative w-28 h-28 print:w-16 print:h-16 flex items-center justify-center rounded-full overflow-hidden ${logoPreview ? '' : 'print:hidden'}`}
        >
          {logoPreview && (
            <img
              src={logoPreview}
              alt="School Logo"
              className="w-full h-full object-cover drop-shadow-sm"
            />
          )}
        </div>
        <h1 className="text-2xl print:text-lg font-bold text-black mb-1 print:mb-0.5">
          {headerConfig?.schoolName || 'โรงเรียนของคุณ'}
        </h1>
        <div className="flex w-full justify-center gap-24 print:gap-16 px-4 text-base print:text-sm font-bold mt-1 mb-2 print:mb-1">
          <p>
            {headerConfig?.textLeft || 'ตารางเรียน'} ปีการศึกษา{' '}
            {headerConfig?.term || '-'}/{headerConfig?.academicYear || '----'}
          </p>
          <p>
            {viewMode === 'student'
              ? `${headerConfig?.textRightStudent || 'ตารางเรียน ระดับชั้น'} ${tab.name}`
              : `${headerConfig?.textRightTeacher || 'ตารางสอน คุณครู'} ${tab.name}`}
          </p>
        </div>
      </div>

      <table className="w-full text-left border-collapse table-fixed min-w-max print:w-full print:min-w-full">
        <thead>
          <tr className="bg-slate-800 text-white select-none print:bg-slate-800 print:text-white">
            <th className="p-2 border border-slate-700 font-semibold text-center w-28 print:w-[10%] sticky left-0 top-0 z-40 bg-slate-900 print:bg-slate-900 print:p-1.5">
              <span className="print:text-[12px]">วัน / เวลา</span>
            </th>
            {timeSlots.map((time, index) => {
              const parts = time.split('|')
              const periodName = parts[0] || ''
              const time1 = parts[1] || ''
              const time2 = parts[2] || ''
              const isVerticalColumn =
                periodName.includes('Homeroom') || periodName.includes('พัก')

              return (
                // 🌟 ลบคำว่า relative ออก เพื่อไม่ให้ตีกับ sticky ตามที่ Tailwind แจ้งเตือน
                <th
                  key={index}
                  draggable={viewMode === 'teacher'}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={() => setDragOverCol(null)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={() => {
                    setDraggedCol(null)
                    setDragOverCol(null)
                  }}
                  className={`p-1.5 border border-slate-700 font-medium text-center group sticky top-0 z-30 print:p-1 ${isVerticalColumn ? 'w-14 print:w-[5.5%] bg-slate-700 print:bg-slate-700' : 'print:w-auto bg-slate-800 print:bg-slate-800'} ${dragOverCol === index ? 'border-l-4 border-l-indigo-400 bg-slate-600' : ''}`}
                >
                  <div className="flex flex-col items-center justify-between h-full gap-1 w-full px-1 py-1">
                    <div className="w-full mb-1">
                      {viewMode === 'teacher' ? (
                        <input
                          type="text"
                          draggable={false}
                          onDragStart={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          value={periodName}
                          onChange={(e) =>
                            updateTimeSlot(
                              index,
                              `${e.target.value}|${time1}|${time2}`
                            )
                          }
                          className="w-full bg-transparent text-center outline-none focus:bg-slate-600 transition text-sm font-bold text-white border-b border-dashed border-slate-500 pb-1 print:p-0 print:border-none print:text-[11px]"
                        />
                      ) : (
                        <div className="text-sm font-bold text-white border-b border-dashed border-slate-500 pb-1 print:border-slate-500 print:text-[11px]">
                          {periodName}
                        </div>
                      )}
                    </div>
                    {viewMode === 'teacher' ? (
                      <div className="flex flex-col gap-0.5 w-full">
                        <input
                          type="text"
                          draggable={false}
                          onDragStart={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          value={time1}
                          onChange={(e) =>
                            updateTimeSlot(
                              index,
                              `${periodName}|${e.target.value}|${time2}`
                            )
                          }
                          className="w-full bg-slate-700/50 print:bg-transparent text-center rounded px-1 py-0.5 outline-none focus:bg-slate-600 transition text-xs text-amber-100 print:p-0 print:text-[9px]"
                          placeholder="เวลาบน..."
                        />
                        <input
                          type="text"
                          draggable={false}
                          onDragStart={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          value={time2}
                          onChange={(e) =>
                            updateTimeSlot(
                              index,
                              `${periodName}|${time1}|${e.target.value}`
                            )
                          }
                          className="w-full bg-slate-700/50 print:bg-transparent text-center rounded px-1 py-0.5 outline-none focus:bg-slate-600 transition text-xs text-amber-100 print:p-0 print:text-[9px]"
                          placeholder="เวลาล่าง..."
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col w-full text-center gap-0.5">
                        <div className="text-xs text-amber-100 w-full print:text-[9px]">
                          {time1}
                        </div>
                        <div className="text-xs text-amber-100 w-full print:text-[9px]">
                          {time2}
                        </div>
                      </div>
                    )}
                  </div>
                  {viewMode === 'teacher' && (
                    <button
                      onClick={() => removeTimeSlot(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 print:hidden text-[10px]"
                    >
                      ✕
                    </button>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {/* 🌟 ระบุ Type ให้ parameter 'day' ใน map */}
          {DAYS_OF_WEEK.map((day: DayTheme) => (
            <DayRow
              key={day.id}
              day={day}
              viewMode={viewMode}
              timeSlots={timeSlots}
              tabId={tab.id}
              scheduleData={scheduleData}
              updateData={updateData}
              globalConflicts={globalConflicts}
              masterData={masterData}
            />
          ))}
        </tbody>
      </table>

      <div className="hidden print:flex justify-between w-full px-4 mt-8 print:mt-4 text-sm text-black">
        {[
          {
            role: signatures?.scheduler?.position || 'ผู้จัดทำตารางสอน',
            sig: signatures?.scheduler,
          },
          {
            role: signatures?.reviewer?.position || 'ผู้ตรวจตารางสอน',
            sig: signatures?.reviewer,
          },
          {
            role: signatures?.approver?.position || 'ผู้อนุมัติ',
            sig: signatures?.approver,
          },
        ].map((item, i) => (
          <div key={i} className="w-1/3 flex flex-col px-2">
            <div className="font-bold text-left mb-6 print:mb-4 w-full text-base print:text-sm">
              {item.role}
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="h-6 print:h-6"></div>
              <div className="mb-0.5 print:text-[12px]">
                {item.sig?.name && item.sig.name.trim() !== ''
                  ? `(${item.sig.name})`
                  : '(................................................)'}
              </div>
              {item.sig?.schoolPosition &&
                item.sig.schoolPosition.trim() !== '' && (
                  <div className="font-medium text-sm print:text-[11px]">
                    {item.sig.schoolPosition}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-50 border-t print:hidden flex items-center gap-4 mt-auto">
        <label className="cursor-pointer bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition shadow-sm">
          🖼️ อัปโหลดโลโก้โรงเรียน (ทรงกลม/สี่เหลี่ยมก็ได้)
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </label>
        {logoPreview && (
          <button
            onClick={() => setLogoPreview(null)}
            className="text-sm text-red-500 hover:text-red-700 font-bold ml-2"
          >
            ลบโลโก้
          </button>
        )}
      </div>
    </div>
  )
}
