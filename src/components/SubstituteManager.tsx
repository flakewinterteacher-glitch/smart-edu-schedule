import { useState, useMemo } from 'react'
import { DAYS_OF_WEEK } from '@/constants/config'
import type { ScheduleEntry, SubstituteRecord, Tab, MasterData } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  timeSlots: string[]
  scheduleData: ScheduleEntry[]
  teachers: Tab[]
  substitutes: SubstituteRecord[]
  setSubstitutes: React.Dispatch<React.SetStateAction<SubstituteRecord[]>>
  masterData: MasterData
}

export default function SubstituteManager({
  isOpen,
  onClose,
  timeSlots,
  scheduleData,
  teachers,
  substitutes,
  setSubstitutes,
  masterData,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<string>('mon')
  const [selectedTime, setSelectedTime] = useState<number>(1)

  const safeSchedule = Array.isArray(scheduleData) ? scheduleData : []
  const safeTeachers = Array.isArray(teachers) ? teachers : []
  const safeSubstitutes = Array.isArray(substitutes) ? substitutes : []
  const safeMasterTeachers = Array.isArray(masterData?.teachers)
    ? masterData.teachers
    : []
  const safeTimeSlots = Array.isArray(timeSlots) ? timeSlots : []

  const classesAtThisTime = useMemo(() => {
    return safeSchedule.filter(
      (d) =>
        d &&
        d.dayId === selectedDay &&
        d.timeIndex === selectedTime &&
        d.subject &&
        typeof d.subject === 'string' &&
        d.subject.trim() !== ''
    )
  }, [safeSchedule, selectedDay, selectedTime])

  if (!isOpen) return null

  // 🌟 ฟีเจอร์ใหม่: ค้นหาสาเหตุว่าทำไมครูถึงไม่ว่าง (ทำให้วิชาการร้องอ๋อ!)
  const getConflictReason = (subName: string, currentClassTabId: string) => {
    if (!subName || typeof subName !== 'string' || !subName.trim()) return null

    // 1. เช็คว่าติดสอนคาบหลักของตัวเองไหม?
    const regularClass = classesAtThisTime.find((c) => {
      const mainTeacher =
        c.teacher || safeTeachers.find((t) => t.id === c.tabId)?.name
      return mainTeacher === subName && c.tabId !== currentClassTabId
    })

    if (regularClass) {
      return `ติดสอนคาบหลัก: ${regularClass.subject} (ห้อง ${regularClass.room || '-'})`
    }

    // 2. เช็คว่าไปรับสอนแทนห้องอื่นในคาบนี้ไปแล้วหรือยัง? (แก้บั๊กตามรูปเป๊ะๆ)
    const otherSubClass = safeSubstitutes.find(
      (s) =>
        s.dayId === selectedDay &&
        s.timeIndex === selectedTime &&
        s.subTeacherName === subName &&
        s.absentTeacherTabId !== currentClassTabId
    )

    if (otherSubClass) {
      return `รับสอนแทนไปแล้ว: ${otherSubClass.subject} (ห้อง ${otherSubClass.room || '-'})`
    }

    return null // ถ้าว่างจริง จะคืนค่า null
  }

  const handleAssignSub = (
    classRecord: ScheduleEntry,
    subTeacherName: string
  ) => {
    const absentTeacherName =
      classRecord.teacher ||
      safeTeachers.find((t) => t.id === classRecord.tabId)?.name ||
      'ไม่ระบุ'

    setSubstitutes((prev) => {
      const safePrev = Array.isArray(prev) ? prev : []
      const filtered = safePrev.filter(
        (s) =>
          !(
            s.dayId === selectedDay &&
            s.timeIndex === selectedTime &&
            s.absentTeacherTabId === classRecord.tabId
          )
      )

      if (!subTeacherName || !subTeacherName.trim()) return filtered

      return [
        ...filtered,
        {
          id: `sub-${Date.now()}`,
          dayId: selectedDay,
          timeIndex: selectedTime,
          absentTeacherTabId: classRecord.tabId,
          absentTeacherName,
          subject: classRecord.subject || '',
          room: classRecord.room || '',
          subTeacherName,
        },
      ]
    })
  }

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              🔄 ระบบจัดตารางสอนแทน
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1">
              เลือกวันและเวลา เพื่อดึงตารางเรียนทั้งหมดมาจัดการ
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-4 md:p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-4 shrink-0">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-1">
              📅 เลือกวัน
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-medium"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-1">
              ⏳ เลือกคาบเรียน
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-medium"
            >
              {safeTimeSlots.map((time, idx) => {
                const timeStr = typeof time === 'string' ? time : 'คาบเรียน||'
                const parts = timeStr.split('|')
                return (
                  <option key={idx} value={idx}>
                    {parts[0] || `คาบที่ ${idx}`} ({parts[1] || ''} -{' '}
                    {parts[2] || ''})
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto bg-slate-100 flex-1">
          {classesAtThisTime.length === 0 ? (
            <div className="text-center text-slate-400 py-10 font-medium">
              ไม่มีการเรียนการสอนในคาบนี้ครับ
            </div>
          ) : (
            <div className="space-y-3">
              {classesAtThisTime.map((c, idx) => {
                const absentName =
                  c.teacher ||
                  safeTeachers.find((t) => t.id === c.tabId)?.name ||
                  'ไม่ระบุ'
                const existingSub = safeSubstitutes.find(
                  (s) =>
                    s.dayId === selectedDay &&
                    s.timeIndex === selectedTime &&
                    s.absentTeacherTabId === c.tabId
                )

                // 🌟 ดึงสาเหตุตารางชนมาโชว์
                const conflictReason = existingSub
                  ? getConflictReason(existingSub.subTeacherName, c.tabId)
                  : null

                return (
                  <div
                    key={idx}
                    className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center transition-all ${conflictReason ? 'border-red-500 ring-2 ring-red-100 bg-red-50/30' : existingSub ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200'}`}
                  >
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
                      <div className="col-span-2 md:col-span-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          ครูผู้สอนหลัก (ลา)
                        </div>
                        <div
                          className={`font-bold ${existingSub ? 'text-slate-400 line-through' : 'text-slate-800'}`}
                        >
                          👨‍🏫 {absentName}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          วิชา
                        </div>
                        <div className="font-bold text-indigo-700">
                          {c.subject}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          ห้องเรียน
                        </div>
                        <div className="font-bold text-emerald-600">
                          {c.room || '-'}
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-64 shrink-0 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-500 mb-1.5 flex justify-between">
                        <span>จัดครูสอนแทน:</span>
                        {existingSub && (
                          <button
                            onClick={() => handleAssignSub(c, '')}
                            className="text-red-500 hover:text-red-700 font-bold hover:underline"
                          >
                            ยกเลิก
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="พิมพ์ชื่อครูสอนแทน..."
                        value={existingSub?.subTeacherName || ''}
                        onChange={(e) => handleAssignSub(c, e.target.value)}
                        list="teacher-list"
                        className={`w-full px-3 py-2 text-sm font-medium rounded-md border outline-none focus:ring-2 transition-all ${conflictReason ? 'border-red-500 text-red-700 focus:ring-red-200 bg-red-50' : 'border-slate-300 focus:ring-indigo-200'}`}
                      />
                      {/* 🌟 แจ้งเตือนแบบเคลียร์ๆ ให้วิชาการร้องอ๋อ! */}
                      {conflictReason && (
                        <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700 font-bold animate-pulse flex items-start gap-1.5">
                          <span>⚠️</span>
                          <span>{conflictReason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 🌟 ฟีเจอร์ใหม่: ปุ่มตกลง/เสร็จสิ้น ที่คุณขอมา */}
        <div className="p-4 md:p-5 bg-white border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            ✅ บันทึกและปิดหน้าต่าง
          </button>
        </div>
      </div>

      <datalist id="teacher-list">
        {safeMasterTeachers.map((t, i) => (
          <option key={i} value={t} />
        ))}
      </datalist>
    </div>
  )
}
