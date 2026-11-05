
import React, { useState, useEffect } from 'react';
import { Patient, UserRole, Gender, Encounter, Vital, LabResult, Treatment, DosageForm, Route, Timing, ADRRecord } from '../types';
import { STAFF_LIST, COMMON_LABS } from '../constants';

interface InpatientFormProps {
  patient: Patient;
  role: UserRole;
  onUpdate: (p: Patient) => void;
}

const InpatientForm: React.FC<InpatientFormProps> = ({ patient, role, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'progress' | 'drug_chart' | 'review'>('info');
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const isReadOnly = role === UserRole.Viewer;

  const handlePatientFieldChange = (field: keyof Patient, value: any) => {
    onUpdate({ ...patient, [field]: value });
  };

  const handleAddDay = () => {
    const nextDayNum = patient.encounters.length + 1;
    const newEncounter: Encounter = {
      day_number: nextDayNum,
      date: new Date().toISOString().split('T')[0],
      conscious_coherent: true,
      chief_complaint_of_the_day: '',
      vitals: [],
      cvs_text: '',
      rs_text: '',
      gcs_eye: 4,
      gcs_verbal: 5,
      gcs_motor: 6,
      labs: [],
      treatments: [],
      pain_scale: 0,
      pharm_care_issues: '',
      discussion: ''
    };

    // Auto-load logic: if prev day exists, pre-fill
    if (patient.encounters.length > 0) {
      const prev = patient.encounters[patient.encounters.length - 1];
      newEncounter.chief_complaint_of_the_day = prev.chief_complaint_of_the_day;
      newEncounter.treatments = prev.treatments.map(t => ({ 
        ...t, 
        id: Math.random().toString(36).substr(2, 9), 
        continue_from_previous: true 
      }));
    }

    const nextPatient = { ...patient, encounters: [...patient.encounters, newEncounter] };
    onUpdate(nextPatient);
    setActiveDayIndex(nextPatient.encounters.length - 1);
  };

  const updateActiveEncounter = (updates: Partial<Encounter>) => {
    const nextEncounters = [...patient.encounters];
    nextEncounters[activeDayIndex] = { ...nextEncounters[activeDayIndex], ...updates };
    onUpdate({ ...patient, encounters: nextEncounters });
  };

  const addVital = () => {
    const current = patient.encounters[activeDayIndex];
    const newVital: Vital = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    updateActiveEncounter({ vitals: [...current.vitals, newVital] });
  };

  const addTreatment = () => {
    const current = patient.encounters[activeDayIndex];
    const newTx: Treatment = {
      id: Math.random().toString(36).substr(2, 9),
      dosage_form: DosageForm.Tab,
      route: Route.PO,
      medication_generic: '',
      indication: '',
      dose: '',
      frequency: '',
      timing_relation: Timing.Irrelevant,
      start_date: new Date().toISOString().split('T')[0],
      is_free_text: false,
      continue_from_previous: false
    };
    updateActiveEncounter({ treatments: [...current.treatments, newTx] });
  };

  const addADR = () => {
    const newADR: ADRRecord = {
      id: Math.random().toString(36).substr(2, 9),
      suspected_drug: '',
      description: '',
      severity: 'Moderate',
      outcome: '',
      action_taken: '',
      timestamp: new Date().toLocaleString(),
      author: role
    };
    onUpdate({ ...patient, adrs: [...(patient.adrs || []), newADR] });
  };

  const updateADR = (id: string, updates: Partial<ADRRecord>) => {
    const nextADRs = (patient.adrs || []).map(adr => adr.id === id ? { ...adr, ...updates } : adr);
    onUpdate({ ...patient, adrs: nextADRs });
  };

  const deleteADR = (id: string) => {
    const nextADRs = (patient.adrs || []).filter(adr => adr.id !== id);
    onUpdate({ ...patient, adrs: nextADRs });
  };

  const currentEncounter = patient.encounters[activeDayIndex];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      {/* Left Sidebar: Patient Summary */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-6 space-y-8 no-print sticky top-16 h-fit max-h-screen overflow-y-auto">
        <section>
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Patient Profile</h5>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
              <input 
                type="text" 
                value={patient.patient_name}
                onChange={(e) => handlePatientFieldChange('patient_name', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm font-semibold outline-none focus:border-blue-500"
                disabled={isReadOnly}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Age</label>
                <input 
                  type="number" 
                  value={patient.age_years}
                  onChange={(e) => handlePatientFieldChange('age_years', parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm outline-none"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Gender</label>
                <select 
                  value={patient.gender}
                  onChange={(e) => handlePatientFieldChange('gender', e.target.value as Gender)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm outline-none"
                  disabled={isReadOnly}
                >
                  <option value={Gender.Male}>Male</option>
                  <option value={Gender.Female}>Female</option>
                  <option value={Gender.Other}>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">MRN / ID</label>
              <div className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">{patient.mrn}</div>
            </div>
          </div>
        </section>

        <section>
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Administrative</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Consultant</label>
              <select 
                value={patient.consultant}
                onChange={(e) => handlePatientFieldChange('consultant', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm outline-none"
                disabled={isReadOnly}
              >
                <option value="">Select Consultant</option>
                {STAFF_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Ward / Unit</label>
              <input 
                type="text" 
                value={patient.department_ward}
                onChange={(e) => handlePatientFieldChange('department_ward', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm outline-none"
                disabled={isReadOnly}
              />
            </div>
          </div>
        </section>

        <button 
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-sm font-bold transition"
          onClick={() => {}}
        >
          View Full History
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 bg-white">
        <nav className="border-b border-slate-200 px-6 flex items-center no-print bg-slate-50 overflow-x-auto">
          {[
            { id: 'info', label: 'Basic History', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { id: 'progress', label: 'Daily Progress', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'drug_chart', label: 'Drug Chart', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
            { id: 'review', label: 'Review & Notes', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-8">
          {activeTab === 'info' && (
            <div className="max-w-4xl space-y-10">
              <section>
                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">Initial SOAP Presentation</h3>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Chief Complaints</label>
                    <textarea 
                      value={patient.chief_complaints}
                      onChange={(e) => handlePatientFieldChange('chief_complaints', e.target.value)}
                      rows={3}
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Symptoms and duration..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Provisional Diagnosis</label>
                    <textarea 
                      value={patient.provisional_diagnosis}
                      onChange={(e) => handlePatientFieldChange('provisional_diagnosis', e.target.value)}
                      rows={2}
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 mb-6">Patient Background</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Past Medical History</label>
                    <textarea 
                      value={patient.past_history}
                      onChange={(e) => handlePatientFieldChange('past_history', e.target.value)}
                      rows={4}
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Surgeries, chronic conditions, regular medications..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Allergies</label>
                    <textarea 
                      value={patient.allergies}
                      onChange={(e) => handlePatientFieldChange('allergies', e.target.value)}
                      rows={4}
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm text-red-600 font-medium focus:ring-2 focus:ring-red-500 outline-none border-red-100 bg-red-50/20"
                      placeholder="Drug, food, or environmental allergies..."
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              <div className="flex items-center justify-between mb-8 no-print">
                <div className="flex gap-2 items-center bg-slate-100 p-1.5 rounded-xl">
                  {patient.encounters.length === 0 ? (
                    <span className="text-sm text-slate-500 px-4">No progress notes yet.</span>
                  ) : (
                    patient.encounters.map((enc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveDayIndex(idx)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                          activeDayIndex === idx ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-white/50'
                        }`}
                      >
                        Day {enc.day_number}
                      </button>
                    ))
                  )}
                  <button 
                    onClick={handleAddDay}
                    className="ml-4 flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    New Day
                  </button>
                </div>
              </div>

              {currentEncounter && (
                <div className="space-y-12">
                  <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900">Day {currentEncounter.day_number} Progress</h2>
                      <div className="flex items-center gap-4 mt-2">
                         <input 
                            type="date" 
                            value={currentEncounter.date} 
                            onChange={(e) => updateActiveEncounter({ date: e.target.value })}
                            className="text-slate-500 bg-transparent border-none focus:outline-none"
                         />
                         <div className="flex items-center gap-2">
                           <input 
                            type="checkbox" 
                            checked={currentEncounter.conscious_coherent}
                            onChange={(e) => updateActiveEncounter({ conscious_coherent: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                           />
                           <span className="text-sm font-bold text-slate-700 uppercase">Conscious & Coherent</span>
                         </div>
                      </div>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <section className="space-y-8">
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                              Vitals Trend
                            </h4>
                            <button 
                              onClick={addVital}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 underline uppercase tracking-widest"
                            >
                              + Add Reading
                            </button>
                          </div>

                          {currentEncounter.vitals.length === 0 ? (
                            <div className="text-sm text-slate-400 italic py-4">No vital records for this day.</div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-slate-400 border-b border-slate-200">
                                    <th className="py-2 text-left font-medium">Time</th>
                                    <th className="py-2 text-left font-medium">Pulse</th>
                                    <th className="py-2 text-left font-medium">RR</th>
                                    <th className="py-2 text-left font-medium">SpO2</th>
                                    <th className="py-2 text-left font-medium">BP</th>
                                    <th className="py-2 text-left font-medium">BS</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {currentEncounter.vitals.map((v, vIdx) => (
                                    <tr key={v.id}>
                                      <td className="py-2"><input type="time" value={v.time} className="w-16 bg-transparent" /></td>
                                      <td className="py-2"><input type="number" placeholder="PR" className="w-10 bg-transparent font-bold" /></td>
                                      <td className="py-2"><input type="number" placeholder="RR" className="w-10 bg-transparent font-bold" /></td>
                                      <td className="py-2"><input type="number" placeholder="%" className="w-10 bg-transparent font-bold" /></td>
                                      <td className="py-2">
                                        <div className="flex items-center gap-0.5">
                                          <input type="number" placeholder="S" className="w-8 bg-transparent" />
                                          <span>/</span>
                                          <input type="number" placeholder="D" className="w-8 bg-transparent" />
                                        </div>
                                      </td>
                                      <td className="py-2"><input type="number" placeholder="mg/dl" className="w-12 bg-transparent" /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                       </div>

                       <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Chief Complaints of the Day</label>
                            <textarea 
                              value={currentEncounter.chief_complaint_of_the_day}
                              onChange={(e) => updateActiveEncounter({ chief_complaint_of_the_day: e.target.value })}
                              rows={2}
                              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">CVS Exam</label>
                              <textarea 
                                value={currentEncounter.cvs_text}
                                onChange={(e) => updateActiveEncounter({ cvs_text: e.target.value })}
                                rows={2}
                                className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">RS Exam</label>
                              <textarea 
                                value={currentEncounter.rs_text}
                                onChange={(e) => updateActiveEncounter({ rs_text: e.target.value })}
                                rows={2}
                                className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </div>
                       </div>
                    </section>

                    <section className="space-y-8">
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                         <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.5 1.5a2 2 0 01-1.185 1.184l-1.5.5a2 2 0 00-1.414 1.96l.477 2.387a2 2 0 00.547 1.022l1.414 1.414a2 2 0 002.828 0l1.414-1.414a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-1.414-1.96l-1.5-.5a2 2 0 01-1.184-1.185l-.5-1.5a2 2 0 00-1.96-1.414l-2.387.477a2 2 0 00-1.022.547l-1.414 1.414a2 2 0 000 2.828l1.414 1.414z"/></svg>
                              Investigations (Labs)
                            </h4>
                            <div className="relative">
                              <select 
                                onChange={(e) => {
                                  const name = e.target.value;
                                  if (name) {
                                    const nextLabs = [...currentEncounter.labs, { id: Math.random().toString(), test_name: name, value: '', units: '', sample_time: '' }];
                                    updateActiveEncounter({ labs: nextLabs });
                                  }
                                }}
                                className="text-xs bg-white border border-slate-200 rounded px-2 py-1 outline-none"
                              >
                                <option value="">+ Add Test</option>
                                {COMMON_LABS.map(l => <option key={l} value={l}>{l}</option>)}
                              </select>
                            </div>
                         </div>
                         <div className="space-y-3">
                           {currentEncounter.labs.map((lab, lIdx) => (
                             <div key={lab.id} className="grid grid-cols-4 gap-2 items-center bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                               <div className="text-xs font-bold text-slate-600 truncate">{lab.test_name}</div>
                               <input type="text" placeholder="Value" className="text-xs border-b border-slate-100 p-1 outline-none" />
                               <input type="text" placeholder="Units" className="text-xs border-b border-slate-100 p-1 outline-none" />
                               <button 
                                 className="text-red-400 hover:text-red-600 self-center justify-self-end p-1"
                                 onClick={() => {
                                   const next = [...currentEncounter.labs];
                                   next.splice(lIdx, 1);
                                   updateActiveEncounter({ labs: next });
                                 }}
                               >
                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                               </button>
                             </div>
                           ))}
                         </div>
                       </div>

                       <div className="bg-slate-900 text-white p-6 rounded-2xl">
                          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                             <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                             Treatments (Rx)
                          </h4>
                          <div className="space-y-4">
                            {currentEncounter.treatments.map((tx, tIdx) => (
                              <div key={tx.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 relative">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">#{tIdx + 1}</span>
                                    <input 
                                      className="bg-transparent text-sm font-bold border-none outline-none focus:ring-0 placeholder-slate-500"
                                      placeholder="Generic Name"
                                      value={tx.medication_generic}
                                      onChange={(e) => {
                                        const next = [...currentEncounter.treatments];
                                        next[tIdx].medication_generic = e.target.value;
                                        updateActiveEncounter({ treatments: next });
                                      }}
                                    />
                                  </div>
                                  <button onClick={() => {
                                    const next = [...currentEncounter.treatments];
                                    next.splice(tIdx, 1);
                                    updateActiveEncounter({ treatments: next });
                                  }} className="text-slate-500 hover:text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">
                                  <div>Dose: <input 
                                    className="bg-transparent border-b border-slate-700 ml-1 outline-none w-16" 
                                    placeholder="500mg" 
                                    value={tx.dose}
                                    onChange={(e) => {
                                        const next = [...currentEncounter.treatments];
                                        next[tIdx].dose = e.target.value;
                                        updateActiveEncounter({ treatments: next });
                                    }}
                                  /></div>
                                  <div>Freq: <input 
                                    className="bg-transparent border-b border-slate-700 ml-1 outline-none w-16" 
                                    placeholder="TDS" 
                                    value={tx.frequency}
                                    onChange={(e) => {
                                        const next = [...currentEncounter.treatments];
                                        next[tIdx].frequency = e.target.value;
                                        updateActiveEncounter({ treatments: next });
                                    }}
                                  /></div>
                                </div>
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/50">
                                  <input 
                                    type="checkbox" 
                                    id={`continue-${tx.id}`}
                                    checked={tx.continue_from_previous}
                                    onChange={(e) => {
                                      const next = [...currentEncounter.treatments];
                                      next[tIdx].continue_from_previous = e.target.checked;
                                      updateActiveEncounter({ treatments: next });
                                    }}
                                    className="w-3.5 h-3.5 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 transition-colors"
                                  />
                                  <label htmlFor={`continue-${tx.id}`} className="text-[10px] text-slate-400 font-bold uppercase tracking-tight cursor-pointer select-none">
                                    Continue from previous day
                                  </label>
                                  {tx.continue_from_previous && (
                                    <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                  )}
                                </div>
                              </div>
                            ))}
                            <button 
                              onClick={addTreatment}
                              className="w-full py-2 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:border-emerald-500 hover:text-emerald-400 transition text-sm font-bold"
                            >
                              + Add Medication Row
                            </button>
                          </div>
                       </div>
                    </section>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'drug_chart' && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Inpatient Drug Chart Summary</h3>
                  <span className="text-xs font-medium text-slate-500 italic">Auto-generated from Daily Progress</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-6 py-3">Sl No</th>
                        <th className="px-6 py-3">Generic Name</th>
                        <th className="px-6 py-3">Indication</th>
                        <th className="px-6 py-3">Dose</th>
                        <th className="px-6 py-3">Route</th>
                        <th className="px-6 py-3">Frequency</th>
                        <th className="px-6 py-3">Duration (Start - End)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Aggregate logic: show unique medications across all encounters */}
                      {patient.encounters.flatMap(e => e.treatments).length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400 italic">No medications prescribed yet.</td></tr>
                      ) : (
                        patient.encounters.flatMap(e => e.treatments).map((tx, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-mono text-xs">{idx + 1}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{tx.medication_generic}</td>
                            <td className="px-6 py-4 text-slate-600">{tx.indication || 'General'}</td>
                            <td className="px-6 py-4 font-semibold text-blue-700">{tx.dose || 'N/A'}</td>
                            <td className="px-6 py-4 text-slate-500">{tx.route}</td>
                            <td className="px-6 py-4 text-slate-600">{tx.frequency}</td>
                            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{tx.start_date} - {tx.end_date || 'Active'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="max-w-4xl grid gap-12">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <div className="p-1 bg-red-100 rounded text-red-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    Adverse Drug Reactions (ADRs)
                  </h3>
                  <button 
                    onClick={addADR}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Report ADR
                  </button>
                </div>

                <div className="space-y-4">
                  {(!patient.adrs || patient.adrs.length === 0) ? (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
                      <div className="text-slate-400 mb-2">No adverse drug reactions reported for this patient.</div>
                      <button onClick={addADR} className="text-blue-600 font-bold text-sm hover:underline">Click here to add the first report</button>
                    </div>
                  ) : (
                    patient.adrs.map((adr) => (
                      <div key={adr.id} className="bg-white border border-red-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-red-50/50 px-6 py-3 border-b border-red-100 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-red-700 uppercase tracking-wider">ADR Report</span>
                            <span className="text-[10px] text-slate-400 font-mono">{adr.timestamp}</span>
                          </div>
                          <button 
                            onClick={() => deleteADR(adr.id)}
                            className="text-slate-400 hover:text-red-600 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Suspected Drug</label>
                              <input 
                                type="text"
                                value={adr.suspected_drug}
                                onChange={(e) => updateADR(adr.id, { suspected_drug: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none font-bold text-red-900"
                                placeholder="e.g. Vancomycin"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Severity</label>
                              <select 
                                value={adr.severity}
                                onChange={(e) => updateADR(adr.id, { severity: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                              >
                                <option value="Mild">Mild</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Severe">Severe</option>
                                <option value="Life-threatening">Life-threatening</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Author / Reported By</label>
                              <input 
                                type="text"
                                value={adr.author}
                                onChange={(e) => updateADR(adr.id, { author: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reaction Description</label>
                              <textarea 
                                value={adr.description}
                                onChange={(e) => updateADR(adr.id, { description: e.target.value })}
                                rows={2}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="Describe the reaction..."
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Action Taken</label>
                              <input 
                                type="text"
                                value={adr.action_taken}
                                onChange={(e) => updateADR(adr.id, { action_taken: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="e.g. Drug discontinued, dose reduced..."
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Outcome</label>
                              <input 
                                type="text"
                                value={adr.outcome}
                                onChange={(e) => updateADR(adr.id, { outcome: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                placeholder="e.g. Recovered, Recovering, Fatal..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <div className="p-1 bg-amber-100 rounded text-amber-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                  Pharmacist Review (Interventions)
                </h3>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-6">
                   <div>
                     <label className="block text-sm font-bold text-amber-800 mb-2">Pharmaceutical Care Issues</label>
                     <textarea 
                        className="w-full bg-white border border-amber-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                        rows={5}
                        placeholder="ADRs, Drug Interactions, Rationality, Recommended Interventions..."
                     />
                   </div>
                   <div className="flex justify-end">
                     <button className="bg-amber-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 shadow-md shadow-amber-200 transition">Save Review</button>
                   </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <div className="p-1 bg-indigo-100 rounded text-indigo-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                  </div>
                  Case Discussion
                </h3>
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                   <label className="block text-sm font-bold text-indigo-800 mb-2">Case Specific Etiology & Treatment Options</label>
                   <textarea 
                      className="w-full bg-white border border-indigo-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                      rows={6}
                   />
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InpatientForm;
