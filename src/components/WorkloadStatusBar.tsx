import { useMemo } from 'react'
import type { ScheduleEntry, Tab } from '@/types'

interface Props {
  scheduleData: ScheduleEntry[]
  teachers: Tab[]
}

export default function WorkloadStatusBar({ scheduleData, teachers }: Props) {
  const MAX_WORKLOAD = 20

  const teacherWorkload = useMemo(() => {
    const workload: Record<string, number> = {}
    teachers.forEach((t) => {
      workload[t.name] = 0
    })

    scheduleData.forEach((entry) => {
      if (entry.subject && entry.subject.trim() !== '') {
        const teacherName =
          entry.teacher || teachers.find((t) => t.id === entry.tabId)?.name
        if (teacherName) {
          workload[teacherName] = (workload[teacherName] || 0) + 1
        }
      }
    })

    return Object.entries(workload)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [scheduleData, teachers])

  return (
    <div className="bg-slate-800 text-white px-4 py-2 flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide shadow-inner shrink-0 print:hidden">
      <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1 shrink-0">
        <span className="relative flex h-2 w-2 mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        LIVE STATUS:
      </div>
      {teacherWorkload.map((t, idx) => {
        const isOverload = t.count > MAX_WORKLOAD
        return (
          <div
            key={idx}
            className={`text-xs px-2 py-1 rounded-md font-medium border shrink-0 transition-colors ${isOverload ? 'bg-red-500/20 text-red-200 border-red-500/50' : 'bg-slate-700/50 text-slate-200 border-slate-600'}`}
          >
            👨‍🏫 {t.name}:{' '}
            <span className={isOverload ? 'font-bold text-white' : ''}>
              {t.count}
            </span>
            <span className="opacity-50 text-[10px]">/{MAX_WORKLOAD}</span>
            {isOverload && (
              <span className="ml-1 text-red-300 animate-pulse">⚠️</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
