
import React from 'react';

interface OutpatientFormProps {
  onBack: () => void;
}

const OutpatientForm: React.FC<OutpatientFormProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-3xl font-black text-slate-900">Outpatient Encounter</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Patient Name</label>
            <input className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Search or Enter Name" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
            <input type="number" className="w-full border border-slate-200 rounded-lg p-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
            <input type="date" className="w-full border border-slate-200 rounded-lg p-3 text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        <section className="space-y-6">
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">Subjective (Chief Complaint & History)</label>
             <textarea rows={4} className="w-full border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Patient reports..." />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Objective (Exam & Vitals)</label>
               <textarea rows={3} className="w-full border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Assessment (Diagnosis)</label>
               <textarea rows={3} className="w-full border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
             </div>
           </div>
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">Plan (Prescription & Counseling)</label>
             <textarea rows={4} className="w-full border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
           </div>
        </section>

        <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
           <button onClick={onBack} className="px-6 py-2 text-slate-500 font-bold hover:text-slate-700">Cancel</button>
           <button className="bg-emerald-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition">Save Encounter</button>
        </div>
      </div>
    </div>
  );
};

export default OutpatientForm;
