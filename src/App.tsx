import React, { useState, useMemo, useEffect, useRef } from 'react'
import ScheduleTable from '@/components/ScheduleTable'
import TeacherManager from '@/components/TeacherManager'
import SignatureManager from '@/components/SignatureManager'
import HeaderManager from '@/components/HeaderManager'
import DataManager from '@/components/DataManager'
import { INITIAL_TIME_SLOTS } from '@/constants/config'
import type {
  Tab,
  ScheduleEntry,
  ConflictRecord,
  SignaturesConfig,
  Signature,
  HeaderConfig,
  MasterData,
} from '@/types'

const loadSaved = <T,>(key: string, defaultVal: T): T => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultVal
  } catch (e) {
    return defaultVal
  }
}

const getDefaultFixedSchedule = (tabId: string): ScheduleEntry[] => [
  {
    tabId,
    dayId: 'wed',
    timeIndex: 7,
    subject: 'ลูกเสือ',
    teacher: '',
    room: '',
  },
  {
    tabId,
    dayId: 'fri',
    timeIndex: 7,
    subject: 'Activity',
    teacher: '',
    room: '',
  },
]

export default function App() {
  const [viewMode, setViewMode] = useState<'teacher' | 'student'>('teacher')
  const [isManagerOpen, setIsManagerOpen] = useState<boolean>(false)
  const [isSigOpen, setIsSigOpen] = useState<boolean>(false)
  const [isHeaderOpen, setIsHeaderOpen] = useState<boolean>(false)
  const [isDataOpen, setIsDataOpen] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tabs, setTabs] = useState<Tab[]>(() =>
    loadSaved<Tab[]>('edu-tabs', [{ id: 'tab-1', name: 'คุณครู 1' }])
  )
  const [activeTabId, setActiveTabId] = useState<string>(() =>
    loadSaved<string>('edu-activeTab', 'tab-1')
  )
  const [timeSlots, setTimeSlots] = useState<string[]>(() =>
    loadSaved<string[]>('edu-timeSlots', INITIAL_TIME_SLOTS)
  )
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>(() =>
    loadSaved<ScheduleEntry[]>(
      'edu-scheduleData',
      getDefaultFixedSchedule('tab-1')
    )
  )

  const [signatures, setSignatures] = useState<SignaturesConfig>(() =>
    loadSaved<SignaturesConfig>('edu-signatures', {
      scheduler: { name: '', position: 'ผู้จัดทำตารางสอน', schoolPosition: '' },
      reviewer: { name: '', position: 'ผู้ตรวจตารางสอน', schoolPosition: '' },
      approver: { name: '', position: 'ผู้อนุมัติ', schoolPosition: '' },
    })
  )

  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(() =>
    loadSaved<HeaderConfig>('edu-headerConfig', {
      schoolName: 'โรงเรียนของคุณ',
      academicYear: '2568',
      term: '1',
      textLeft: 'ตารางเรียน',
      textRightTeacher: 'ตารางสอน คุณครู',
      textRightStudent: 'ตารางเรียน ระดับชั้น',
    })
  )

  const [masterData, setMasterData] = useState<MasterData>(() =>
    loadSaved<MasterData>('edu-masterData', {
      subjects: [
        'คณิตศาสตร์',
        'ภาษาไทย',
        'วิทยาศาสตร์',
        'เทคโนโลยีสารสนเทศและการสื่อสาร',
        'ภาษาอังกฤษ',
        'ลูกเสือ',
        'Activity',
      ],
      teachers: ['อ.ณัฐพงศ์'],
      rooms: ['ป.4/1', 'ป.4/2', 'ป.4/3'],
    })
  )

  useEffect(() => {
    localStorage.setItem('edu-tabs', JSON.stringify(tabs))
    localStorage.setItem('edu-timeSlots', JSON.stringify(timeSlots))
    localStorage.setItem('edu-scheduleData', JSON.stringify(scheduleData))
    localStorage.setItem('edu-activeTab', activeTabId)
    localStorage.setItem('edu-signatures', JSON.stringify(signatures))
    localStorage.setItem('edu-headerConfig', JSON.stringify(headerConfig))
    localStorage.setItem('edu-masterData', JSON.stringify(masterData))
  }, [
    tabs,
    timeSlots,
    scheduleData,
    activeTabId,
    signatures,
    headerConfig,
    masterData,
  ])

  const handleExport = () => {
    const data = {
      tabs,
      timeSlots,
      scheduleData,
      signatures,
      headerConfig,
      masterData,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ตารางสอน_Backup_${new Date().toLocaleDateString('th-TH').replace(/\//g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        // 🌟 ป้องกัน undefined
        const result = event.target?.result
        if (typeof result !== 'string') return

        const data = JSON.parse(result)
        if (data.tabs && data.timeSlots && data.scheduleData) {
          setTabs(data.tabs)
          setTimeSlots(data.timeSlots)
          setScheduleData(data.scheduleData)
          setActiveTabId(data.tabs[0].id)
          if (data.signatures) setSignatures(data.signatures)
          if (data.headerConfig) setHeaderConfig(data.headerConfig)
          if (data.masterData) setMasterData(data.masterData)
          alert('📥 โหลดข้อมูลตารางสอนสำเร็จแล้ว!')
        } else {
          alert('❌ ไฟล์ไม่ถูกต้อง หรือไม่ใช่ไฟล์ Backup ของระบบนี้')
        }
      } catch (err) {
        alert('❌ เกิดข้อผิดพลาดในการอ่านไฟล์')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClearAll = () => {
    if (
      window.confirm(
        '⚠️ คำเตือน: คุณต้องการล้างข้อมูลทั้งหมดเพื่อเริ่มทำตารางใหม่ใช่หรือไม่?'
      )
    ) {
      setTabs([{ id: 'tab-1', name: 'คุณครู 1' }])
      setTimeSlots(INITIAL_TIME_SLOTS)
      setScheduleData(getDefaultFixedSchedule('tab-1'))
      setActiveTabId('tab-1')
    }
  }

  const updateSignature = (
    role: string,
    field: keyof Signature,
    value: string
  ) => {
    setSignatures((prev) => ({
      ...prev,
      [role]: { ...prev[role], [field]: value },
    }))
  }
  const updateHeaderConfig = (field: keyof HeaderConfig, value: string) => {
    setHeaderConfig((prev) => ({ ...prev, [field]: value }))
  }
  const addTimeSlot = () =>
    setTimeSlots([...timeSlots, 'คาบใหม่|00.00 - 00.00|00.00 - 00.00'])
  const updateTimeSlot = (index: number, newValue: string) => {
    const newSlots = [...timeSlots]
    newSlots[index] = newValue
    setTimeSlots(newSlots)
  }
  const removeTimeSlot = (indexToRemove: number) => {
    if (window.confirm('ยืนยันการลบช่องเวลานี้?')) {
      setTimeSlots((prev) => prev.filter((_, i) => i !== indexToRemove))
      setScheduleData((prev) =>
        prev
          .filter((d) => d.timeIndex !== indexToRemove)
          .map((d) =>
            d.timeIndex > indexToRemove
              ? { ...d, timeIndex: d.timeIndex - 1 }
              : d
          )
      )
    }
  }
  const moveTimeSlot = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    const newSlots = [...timeSlots]
    const [movedSlot] = newSlots.splice(fromIndex, 1)
    newSlots.splice(toIndex, 0, movedSlot)
    setTimeSlots(newSlots)
    setScheduleData((prev) =>
      prev.map((d) => {
        if (d.timeIndex === fromIndex) return { ...d, timeIndex: toIndex }
        if (
          fromIndex < toIndex &&
          d.timeIndex > fromIndex &&
          d.timeIndex <= toIndex
        )
          return { ...d, timeIndex: d.timeIndex - 1 }
        if (
          fromIndex > toIndex &&
          d.timeIndex >= toIndex &&
          d.timeIndex < fromIndex
        )
          return { ...d, timeIndex: d.timeIndex + 1 }
        return d
      })
    )
  }
  const updateScheduleData = (
    tabId: string,
    dayId: string,
    timeIndex: number,
    field: keyof ScheduleEntry,
    value: string
  ) => {
    setScheduleData((prev: ScheduleEntry[]) => {
      const existingIndex = prev.findIndex(
        (d) =>
          d.tabId === tabId && d.dayId === dayId && d.timeIndex === timeIndex
      )
      if (existingIndex >= 0) {
        const newData = [...prev]
        // 🌟 บังคับ Type กัน Error ตอน Update
        newData[existingIndex] = {
          ...newData[existingIndex],
          [field]: value,
        } as ScheduleEntry
        return newData
      }
      return [
        ...prev,
        { tabId, dayId, timeIndex, [field]: value } as ScheduleEntry,
      ]
    })
  }

  const addTeacher = () => {
    const newId = `tab-${Date.now()}`
    setTabs([...tabs, { id: newId, name: `ครูใหม่` }])
    setScheduleData((prev) => [...prev, ...getDefaultFixedSchedule(newId)])
    setActiveTabId(newId)
  }

  const removeTeacher = (id: string) => {
    if (tabs.length <= 1) return alert('ต้องมีตารางอย่างน้อย 1 ตารางครับ')
    if (window.confirm('ยืนยันการลบตารางนี้?')) {
      const filtered = tabs.filter((t) => t.id !== id)
      setTabs(filtered)
      setScheduleData((prev) => prev.filter((d) => d.tabId !== id))
      if (activeTabId === id) setActiveTabId(filtered[0].id)
    }
  }
  const updateTeacherName = (id: string, newName: string) => {
    setTabs(tabs.map((t) => (t.id === id ? { ...t, name: newName } : t)))
  }

  const studentRooms = useMemo(() => {
    const rooms = [
      ...new Set(
        scheduleData.map((d) => d.room).filter((r) => r && r.trim() !== '')
      ),
    ]
    return rooms
      .sort()
      .map((r) => ({ id: `room-${r}`, name: `ห้อง ${r}`, roomKey: r }) as Tab)
  }, [scheduleData])

  const getStudentDataForRoom = (roomKey: string) => {
    return scheduleData
      .filter((d) => d.room === roomKey)
      .map((d) => ({
        ...d,
        teacherName:
          d.teacher ||
          tabs.find((t) => t.id === d.tabId)?.name ||
          'ไม่ระบุชื่อครู',
      }))
  }

  const globalConflicts = useMemo(() => {
    const conflicts: ConflictRecord[] = []
    const teacherTracker: Record<string, Record<string, ScheduleEntry[]>> = {}
    const roomTracker: Record<string, Record<string, ScheduleEntry[]>> = {}

    scheduleData.forEach((entry) => {
      const timeKey = `${entry.dayId}-${entry.timeIndex}`
      if (entry.teacher && entry.teacher.trim() !== '') {
        if (!teacherTracker[timeKey]) teacherTracker[timeKey] = {}
        if (!teacherTracker[timeKey][entry.teacher])
          teacherTracker[timeKey][entry.teacher] = []
        teacherTracker[timeKey][entry.teacher].push(entry)
      }
      if (entry.room && entry.room.trim() !== '') {
        if (!roomTracker[timeKey]) roomTracker[timeKey] = {}
        if (!roomTracker[timeKey][entry.room])
          roomTracker[timeKey][entry.room] = []
        roomTracker[timeKey][entry.room].push(entry)
      }
    })

    for (const timeKey in teacherTracker) {
      for (const teacher in teacherTracker[timeKey]) {
        if (teacherTracker[timeKey][teacher].length > 1) {
          teacherTracker[timeKey][teacher].forEach((record) => {
            if (
              !conflicts.some(
                (c) =>
                  c.tabId === record.tabId &&
                  c.dayId === record.dayId &&
                  c.timeIndex === record.timeIndex
              )
            ) {
              conflicts.push({
                ...record,
                type: 'teacher',
                message: 'ครูสอนซ้ำเวลา',
              })
            }
          })
        }
      }
    }
    for (const timeKey in roomTracker) {
      for (const room in roomTracker[timeKey]) {
        if (roomTracker[timeKey][room].length > 1) {
          roomTracker[timeKey][room].forEach((record) => {
            const existing = conflicts.find(
              (c) =>
                c.tabId === record.tabId &&
                c.dayId === record.dayId &&
                c.timeIndex === record.timeIndex
            )
            if (existing) {
              existing.message = 'ครูและห้องซ้ำ!'
            } else {
              conflicts.push({
                ...record,
                type: 'room',
                message: 'ห้องเรียนซ้ำ',
              })
            }
          })
        }
      }
    }
    return conflicts
  }, [scheduleData])

  const tabsWithConflicts = useMemo(() => {
    return [...new Set(globalConflicts.map((c) => c.tabId))]
  }, [globalConflicts])
  const currentTabs = viewMode === 'teacher' ? tabs : studentRooms
  const activeTab =
    currentTabs.find((t) => t.id === activeTabId) || currentTabs[0]

  return (
    <div className="h-screen flex flex-col font-sans bg-slate-50 print:h-auto print:bg-white print:block">
      <style>
        {`@media print { @page { size: A4 landscape; margin: 5mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } ::-webkit-scrollbar { display: none; } }`}
      </style>

      <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-50 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            ES
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setViewMode('teacher')
                setActiveTabId(tabs[0]?.id)
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${viewMode === 'teacher' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              👨‍🏫 ตารางครู
            </button>
            <button
              onClick={() => {
                setViewMode('student')
                if (studentRooms[0]) setActiveTabId(studentRooms[0].id)
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${viewMode === 'student' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              🎓 ตารางนักเรียน
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap justify-end">
          {viewMode === 'teacher' && (
            <>
              <input
                type="file"
                accept=".json"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImport}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-slate-600 hover:text-indigo-600 px-2 font-medium text-sm transition"
                title="โหลดข้อมูล Backup"
              >
                📥 Import
              </button>
              <button
                onClick={handleExport}
                className="text-slate-600 hover:text-emerald-600 px-2 font-medium text-sm transition border-r border-slate-300 pr-4"
                title="เซฟข้อมูลเก็บไว้"
              >
                📤 Export
              </button>

              <button
                onClick={() => setIsDataOpen(true)}
                className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold hover:bg-indigo-100 transition border border-indigo-200 text-sm ml-2"
              >
                🗂️ ฐานข้อมูล
              </button>
              <button
                onClick={() => setIsHeaderOpen(true)}
                className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg font-bold hover:bg-slate-200 transition border border-slate-300 text-sm ml-1"
              >
                🏫 ตั้งค่าหัวกระดาษ
              </button>
              <button
                onClick={() => setIsSigOpen(true)}
                className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg font-bold hover:bg-slate-200 transition border border-slate-300 text-sm ml-1"
              >
                ✍️ ตั้งค่าลายเซ็น
              </button>
              <button
                onClick={() => setIsManagerOpen(true)}
                className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-bold hover:bg-indigo-100 transition border border-indigo-200 text-sm ml-1"
              >
                👤 จัดการครู
              </button>
              <button
                onClick={addTimeSlot}
                className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg font-bold hover:bg-emerald-100 transition border border-emerald-200 text-sm ml-1"
              >
                ⏳ เพิ่มเวลา
              </button>
              <button
                onClick={addTeacher}
                className="bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm text-sm ml-1"
              >
                ➕ สร้างตารางใหม่
              </button>
            </>
          )}
          <button
            onClick={() => window.print()}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-900 transition shadow-sm flex items-center gap-2 text-sm ml-2"
          >
            🖨️ ปริ้นต์
          </button>
          {viewMode === 'teacher' && (
            <button
              onClick={handleClearAll}
              className="bg-red-50 text-red-600 px-3 py-2 rounded-lg font-bold hover:bg-red-100 transition border border-red-200 text-sm ml-2"
            >
              🧹 ล้างข้อมูล
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden flex flex-col print:p-0 print:overflow-visible print:block">
        <div className="flex gap-2 flex-wrap mb-4 shrink-0 print:hidden">
          {currentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all border ${activeTabId === tab.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
            >
              {tab.name}
              {viewMode === 'teacher' && tabsWithConflicts.includes(tab.id) && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white"></span>
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab ? (
          <ScheduleTable
            tab={activeTab}
            viewMode={viewMode}
            timeSlots={timeSlots}
            scheduleData={
              viewMode === 'teacher'
                ? scheduleData
                : getStudentDataForRoom(activeTab.roomKey || '')
            }
            updateData={updateScheduleData}
            updateTimeSlot={updateTimeSlot}
            removeTimeSlot={removeTimeSlot}
            moveTimeSlot={moveTimeSlot}
            globalConflicts={globalConflicts}
            signatures={signatures}
            headerConfig={headerConfig}
            masterData={masterData}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-medium print:hidden">
            {viewMode === 'student'
              ? "กรุณากรอกชื่อ 'ห้องเรียน' ในหน้าตารางครูก่อน ระบบจะสร้างตารางนักเรียนให้อัตโนมัติครับ"
              : 'ไม่พบข้อมูล'}
          </div>
        )}
      </main>

      <TeacherManager
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        teachers={tabs}
        addTeacher={addTeacher}
        removeTeacher={removeTeacher}
        updateTeacherName={updateTeacherName}
      />
      <SignatureManager
        isOpen={isSigOpen}
        onClose={() => setIsSigOpen(false)}
        signatures={signatures}
        updateSignature={updateSignature}
      />
      <HeaderManager
        isOpen={isHeaderOpen}
        onClose={() => setIsHeaderOpen(false)}
        config={headerConfig}
        updateConfig={updateHeaderConfig}
      />
      <DataManager
        isOpen={isDataOpen}
        onClose={() => setIsDataOpen(false)}
        masterData={masterData}
        setMasterData={setMasterData}
      />
    </div>
  )
}
