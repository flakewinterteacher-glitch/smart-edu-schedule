import React from 'react';
import ScheduleCell from './ScheduleCell';

export default function DayRow({ day, timeSlots, tabId, scheduleData, updateData, globalConflicts, viewMode, masterData }) {
    return (
        <tr className="hover:bg-slate-50/50 transition-colors group/row">
            <td className="p-2 border border-slate-300 bg-white font-bold text-center whitespace-nowrap z-20 sticky left-0 group-hover/row:bg-slate-50 print:p-1.5 print:text-[14px]">
                {day.name}
            </td>
            
            {timeSlots.map((time, timeIndex) => {
                const parts = time.split('|');
                const periodName = parts[0] || '';
                const isVerticalColumn = periodName.includes('Homeroom') || periodName.includes('พัก');

                if (isVerticalColumn) {
                    if (day.id === 'mon') {
                        return (
                            <td key={timeIndex} rowSpan={5} className="p-0 border border-slate-300 bg-slate-100 align-middle">
                                <div className="flex items-center justify-center w-full h-full min-h-40 print:min-h-16">
                                    <span className="font-bold text-slate-600 whitespace-nowrap tracking-wide text-sm print:text-[11px]" 
                                          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                        {periodName.includes('Homeroom') ? 'กิจกรรมหน้าเสาธง / Homeroom' : 'พักกลางวัน 50 นาที'}
                                    </span>
                                </div>
                            </td>
                        );
                    } else {
                        return null; 
                    }
                }

                const cellData = viewMode === 'student' 
                    ? scheduleData.find(d => d.dayId === day.id && d.timeIndex === timeIndex) || {}
                    : scheduleData.find(d => d.dayId === day.id && d.timeIndex === timeIndex && d.tabId === tabId) || {};
                
                const conflictRecord = viewMode === 'teacher' 
                    ? globalConflicts.find(c => c.dayId === day.id && c.timeIndex === timeIndex && c.tabId === tabId) 
                    : null;

                return (
                    <td key={timeIndex} className="p-1.5 border border-slate-300 align-top print:p-1 print:min-w-0 print:w-auto print:h-auto">
                        <ScheduleCell 
                            dayId={day.id} 
                            timeIndex={timeIndex} 
                            tabId={tabId} 
                            data={cellData} 
                            updateData={updateData}
                            hasConflict={!!conflictRecord} 
                            conflictMessage={conflictRecord ? conflictRecord.message : ''} 
                            dayTheme={day}
                            viewMode={viewMode}
                            masterData={masterData}
                        />
                    </td>
                );
            })}
        </tr>
    );
}