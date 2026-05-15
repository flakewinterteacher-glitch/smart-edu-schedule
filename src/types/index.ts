export interface Tab {
  id: string
  name: string
  roomKey?: string
}

export interface ScheduleEntry {
  tabId: string
  dayId: string
  timeIndex: number
  subject?: string
  teacher?: string
  room?: string
  teacherName?: string
}

export interface ConflictRecord extends ScheduleEntry {
  type?: 'teacher' | 'room'
  message?: string
}

export interface Signature {
  name: string
  position: string
  schoolPosition: string
}

export interface SignaturesConfig {
  scheduler: Signature
  reviewer: Signature
  approver: Signature
  [key: string]: Signature
}

export interface HeaderConfig {
  schoolName: string
  academicYear: string
  term: string
  textLeft: string
  textRightTeacher: string
  textRightStudent: string
}

export interface MasterData {
  subjects: string[]
  teachers: string[]
  rooms: string[]
}

export interface DayTheme {
  id: string
  name: string
  theme: string
}

// 🌟 ตัวใหม่: ระบบจัดการสอนแทน
export interface SubstituteRecord {
  id: string
  dayId: string
  timeIndex: number
  absentTeacherTabId: string
  absentTeacherName: string
  subject: string
  room: string
  subTeacherName: string
}
