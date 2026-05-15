import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { ScheduleEntry, Tab, MasterData } from '@/types'

interface Props {
  scheduleData: ScheduleEntry[]
  teachers: Tab[]
  masterData: MasterData
}

export default function Dashboard({
  scheduleData,
  teachers,
  masterData,
}: Props) {
  const totalTeachers = teachers.length
  const totalRooms = masterData.rooms.length || 0
  const totalClasses = scheduleData.filter(
    (d) => d.subject && d.subject.trim() !== ''
  ).length

  const teacherWorkload = useMemo(() => {
    const workload: Record<string, number> = {}
    scheduleData.forEach((entry) => {
      if (entry.subject && entry.subject.trim() !== '') {
        const teacherName =
          entry.teacher ||
          teachers.find((t) => t.id === entry.tabId)?.name ||
          'ไม่ระบุ'
        workload[teacherName] = (workload[teacherName] || 0) + 1
      }
    })

    return Object.entries(workload)
      .map(([name, count]) => ({ name, คาบสอน: count }))
      .sort((a, b) => b.คาบสอน - a.คาบสอน)
  }, [scheduleData, teachers])

  const MAX_WORKLOAD = 20
  const overloadedTeachers = teacherWorkload.filter(
    (t) => t.คาบสอน > MAX_WORKLOAD
  )

  const MAX_SLOTS_PER_WEEK = 40
  const roomUtilization = useMemo(() => {
    const usage: Record<string, number> = {}
    scheduleData.forEach((entry) => {
      if (entry.room && entry.room.trim() !== '') {
        usage[entry.room] = (usage[entry.room] || 0) + 1
      }
    })

    return Object.entries(usage)
      .map(([name, count]) => ({
        name,
        usage: count,
        percent: Math.round((count / MAX_SLOTS_PER_WEEK) * 100),
      }))
      .sort((a, b) => b.percent - a.percent)
  }, [scheduleData])

  return (
    <div className="p-6 bg-slate-50 min-h-full space-y-6 overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          📊 แดชบอร์ดวิเคราะห์ข้อมูล
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          สรุปภาพรวมภาระงานสอนและการใช้ทรัพยากรห้องเรียน
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
            👨‍🏫
          </div>
          <div>
            <div className="text-slate-500 text-sm font-medium">
              คุณครูทั้งหมด
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {totalTeachers}{' '}
              <span className="text-base font-normal text-slate-500">คน</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl">
            🏫
          </div>
          <div>
            <div className="text-slate-500 text-sm font-medium">
              ห้องเรียนในระบบ
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {totalRooms}{' '}
              <span className="text-base font-normal text-slate-500">ห้อง</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl">
            ⏳
          </div>
          <div>
            <div className="text-slate-500 text-sm font-medium">
              รวมคาบสอน/สัปดาห์
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {totalClasses}{' '}
              <span className="text-base font-normal text-slate-500">คาบ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            📈 ภาระงานสอนคุณครู (Teacher Workload)
          </h3>
          {/* 🌟 แก้เป็น h-75 ตรงนี้ */}
          <div className="h-75 w-full">
            {teacherWorkload.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={teacherWorkload.slice(0, 10)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="คาบสอน" radius={[0, 4, 4, 0]}>
                    {teacherWorkload.slice(0, 10).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.คาบสอน > MAX_WORKLOAD ? '#ef4444' : '#6366f1'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                ยังไม่มีข้อมูลการจัดตาราง
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-2 justify-center text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-indigo-500 rounded-full"></span> ปกติ
              (≤ {MAX_WORKLOAD} คาบ)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>{' '}
              เกินเกณฑ์
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              ⚠️ แจ้งเตือนด่วน!
            </h3>
            <div className="space-y-3">
              {overloadedTeachers.length > 0 ? (
                overloadedTeachers.map((t, i) => (
                  <div
                    key={i}
                    className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200 flex items-start gap-2"
                  >
                    <span className="text-base leading-none mt-0.5">🔴</span>
                    <div>
                      <span className="font-bold">{t.name}</span> สอนเกินเกณฑ์
                      <div className="text-xs mt-0.5 font-medium opacity-80">
                        สอน {t.คาบสอน} คาบ (เกณฑ์ {MAX_WORKLOAD})
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm border border-emerald-200 flex items-center gap-2">
                  <span>✅</span> ไม่มีครูสอนเกินเกณฑ์ครับ
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              🏫 การใช้ห้องเรียน (Top 5)
            </h3>
            <div className="space-y-4">
              {roomUtilization.slice(0, 5).map((room, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">
                      {room.name}
                    </span>
                    <span className="text-slate-500">{room.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${room.percent > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(room.percent, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 text-right">
                    {room.usage} / {MAX_SLOTS_PER_WEEK} คาบ
                  </div>
                </div>
              ))}
              {roomUtilization.length === 0 && (
                <div className="text-sm text-slate-400 text-center py-4">
                  ยังไม่มีการระบุห้องเรียน
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
