// src/constants/config.ts
import { DayTheme } from '@/types'

export const INITIAL_TIME_SLOTS: string[] = [
  'Homeroom|07.50 - 08.30|07.50 - 08.30',
  'คาบที่ 1|08.30 - 09.30|08.30 - 09.20',
  'คาบที่ 2|09.30 - 10.30|09.20 - 10.10',
  'คาบที่ 3|10.30 - 11.30|10.10 - 11.00',
  'พักกลางวัน|11.30 - 12.20|11.50 - 12.40',
  'คาบที่ 4|12.20 - 13.20|11.00 - 11.50',
  'คาบที่ 5|13.20 - 14.20|12.40 - 13.30',
  'คาบที่ 6|14.20 - 15.20|13.30 - 14.20',
  'พบที่ปรึกษา|15.20 - 15.30|14.20 - 15.30',
]

export const DAYS_OF_WEEK: DayTheme[] = [
  { id: 'mon', name: 'จันทร์', theme: 'bg-yellow-50/50 border-yellow-200' },
  { id: 'tue', name: 'อังคาร', theme: 'bg-pink-50/50 border-pink-200' },
  { id: 'wed', name: 'พุธ', theme: 'bg-green-50/50 border-green-200' },
  { id: 'thu', name: 'พฤหัสบดี', theme: 'bg-orange-50/50 border-orange-200' },
  { id: 'fri', name: 'ศุกร์', theme: 'bg-blue-50/50 border-blue-200' },
]
