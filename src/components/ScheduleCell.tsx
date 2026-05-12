import { useState } from 'react'
import type { ScheduleEntry, DayTheme, MasterData } from '@/types'

interface Props {
  data: ScheduleEntry | Partial<ScheduleEntry>
  updateData: (
    tabId: string,
    dayId: string,
    timeIndex: number,
    field: keyof ScheduleEntry,
    value: string
  ) => void
  tabId: string
  dayId: string
  timeIndex: number
  hasConflict: boolean
  conflictMessage: string
  dayTheme: DayTheme
  viewMode: 'teacher' | 'student'
  masterData: MasterData
}

export default function ScheduleCell({
  data,
  updateData,
  tabId,
  dayId,
  timeIndex,
  hasConflict,
  conflictMessage,
  dayTheme,
  viewMode,
  masterData,
}: Props) {
  const [focusedField, setFocusedField] = useState<keyof MasterData | null>(
    null
  )

  if (viewMode === 'student') {
    return (
      <div
        className={`h-full min-h-22 print:min-h-14 p-2 border border-black/10 rounded-lg shadow-sm ${dayTheme.theme} flex flex-col justify-center items-center text-center print:p-1 print:border-none print:shadow-none`}
      >
        <div className="font-bold text-[14px] print:text-[11.5px] leading-tight wrap-break-word whitespace-normal">
          {data?.subject || ''}
        </div>
        <div className="text-[12px] print:text-[10px] font-medium mt-1.5 print:mt-1 leading-tight opacity-80 wrap-break-word whitespace-normal">
          {data?.teacherName || ''}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`h-full min-h-24 print:min-h-14 p-2 print:p-1 border border-black/10 rounded-lg shadow-sm transition-all relative flex flex-col justify-center gap-1.5 print:gap-0.5 print:border-none print:shadow-none
            ${hasConflict ? 'bg-red-50 border-red-500 ring-2 ring-red-400 shadow-red-100' : dayTheme.theme}
        `}
    >
      {hasConflict && (
        <div className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 print:hidden flex items-center gap-1 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          {conflictMessage}
        </div>
      )}

      <div className="relative w-full">
        <textarea
          placeholder="วิชา..."
          value={data?.subject || ''}
          onFocus={() => setFocusedField('subjects')}
          onBlur={() => setTimeout(() => setFocusedField(null), 150)}
          onChange={(e) =>
            updateData(tabId, dayId, timeIndex, 'subject', e.target.value)
          }
          rows={2}
          className={`w-full bg-transparent outline-none font-bold text-[14px] print:text-[11.5px] text-center placeholder-black/30 print:placeholder-transparent resize-none overflow-hidden leading-tight
                        ${hasConflict ? 'text-red-700' : ''}`}
        />
        {focusedField === 'subjects' && masterData?.subjects?.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 shadow-xl rounded-lg z-100 max-h-32 overflow-y-auto print:hidden">
            {masterData.subjects
              .filter((s: string) =>
                s.toLowerCase().includes((data?.subject || '').toLowerCase())
              )
              .map((item: string, idx: number) => (
                <div
                  key={idx}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    updateData(tabId, dayId, timeIndex, 'subject', item)
                    setFocusedField(null)
                  }}
                  className="px-2 py-1.5 text-[11px] text-left text-slate-700 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 truncate"
                >
                  {item}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 pt-1.5 print:pt-0.5 border-t border-black/10 print:border-black/20">
        <div className="relative w-full border-r border-black/10 print:border-none">
          <input
            type="text"
            placeholder="ครู..."
            value={data?.teacher || ''}
            onFocus={() => setFocusedField('teachers')}
            onBlur={() => setTimeout(() => setFocusedField(null), 150)}
            onChange={(e) =>
              updateData(tabId, dayId, timeIndex, 'teacher', e.target.value)
            }
            className={`w-full bg-transparent outline-none text-[12px] print:text-[9.5px] font-medium text-center placeholder-black/30 print:placeholder-transparent ${hasConflict && conflictMessage.includes('ครู') ? 'bg-red-100 text-red-700 font-bold rounded' : ''}`}
          />
          {focusedField === 'teachers' && masterData?.teachers?.length > 0 && (
            <div className="absolute left-0 right-[-50%] top-full mt-1 bg-white border border-slate-200 shadow-xl rounded-lg z-100 max-h-32 overflow-y-auto print:hidden">
              {masterData.teachers
                .filter((s: string) =>
                  s.toLowerCase().includes((data?.teacher || '').toLowerCase())
                )
                .map((item: string, idx: number) => (
                  <div
                    key={idx}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      updateData(tabId, dayId, timeIndex, 'teacher', item)
                      setFocusedField(null)
                    }}
                    className="px-2 py-1.5 text-[11px] text-left text-slate-700 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 truncate"
                  >
                    {item}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="relative w-full">
          <input
            type="text"
            placeholder="ห้อง..."
            value={data?.room || ''}
            onFocus={() => setFocusedField('rooms')}
            onBlur={() => setTimeout(() => setFocusedField(null), 150)}
            onChange={(e) =>
              updateData(tabId, dayId, timeIndex, 'room', e.target.value)
            }
            className={`w-full bg-transparent outline-none text-[12px] print:text-[9.5px] font-medium text-center placeholder-black/30 print:placeholder-transparent ${hasConflict && conflictMessage.includes('ห้อง') ? 'bg-red-100 text-red-700 font-bold rounded' : ''}`}
          />
          {focusedField === 'rooms' && masterData?.rooms?.length > 0 && (
            <div className="absolute left-[-50%] right-0 top-full mt-1 bg-white border border-slate-200 shadow-xl rounded-lg z-100 max-h-32 overflow-y-auto print:hidden">
              {masterData.rooms
                .filter((s: string) =>
                  s.toLowerCase().includes((data?.room || '').toLowerCase())
                )
                .map((item: string, idx: number) => (
                  <div
                    key={idx}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      updateData(tabId, dayId, timeIndex, 'room', item)
                      setFocusedField(null)
                    }}
                    className="px-2 py-1.5 text-[11px] text-left text-slate-700 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 truncate"
                  >
                    {item}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
