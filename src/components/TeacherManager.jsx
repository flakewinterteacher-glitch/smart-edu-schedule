import React from 'react';

export default function TeacherManager({ isOpen, onClose, teachers, addTeacher, removeTeacher, updateTeacherName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
                    <h2 className="text-xl font-bold">จัดการรายชื่อคุณครู</h2>
                    <button onClick={onClose} className="hover:rotate-90 transition-transform text-2xl">&times;</button>
                </div>
                
                <div className="p-4 overflow-y-auto flex-1 space-y-3">
                    {teachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 group">
                            <input 
                                type="text" 
                                value={teacher.name}
                                onChange={(e) => updateTeacherName(teacher.id, e.target.value)}
                                className="flex-1 bg-transparent outline-none font-medium text-slate-700 focus:text-indigo-600"
                                placeholder="ระบุชื่อครู..."
                            />
                            <button 
                                onClick={() => removeTeacher(teacher.id)}
                                className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="ลบครูท่านนี้"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
                    <button 
                        onClick={addTeacher}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                    >
                        + เพิ่มครูใหม่
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition"
                    >
                        ปิดหน้าต่าง
                    </button>
                </div>
            </div>
        </div>
    );
}