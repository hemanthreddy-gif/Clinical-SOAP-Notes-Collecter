
import React, { useState, useEffect } from 'react';
import { UserRole, Patient, Gender } from './types';
import Home from './pages/Home';
import InpatientForm from './pages/InpatientForm';
import OutpatientForm from './pages/OutpatientForm';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'inpatient' | 'outpatient'>('home');
  const [role, setRole] = useState<UserRole>(UserRole.Clinician);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  // Load data from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('soap_patients');
    if (saved) {
      setPatients(JSON.parse(saved));
    }
  }, []);

  // Save data to local storage on change
  useEffect(() => {
    localStorage.setItem('soap_patients', JSON.stringify(patients));
  }, [patients]);

  const handleCreateInpatient = () => {
    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      patient_name: '',
      mrn: `MRN-${Math.floor(Math.random() * 100000)}`,
      age_years: 0,
      gender: Gender.Male,
      department_ward: '',
      consultant: '',
      date_of_admission: new Date().toISOString().split('T')[0],
      provisional_diagnosis: '',
      chief_complaints: '',
      past_history: '',
      allergies: '',
      encounters: [],
      adrs: []
    };
    setActivePatient(newPatient);
    setCurrentPage('inpatient');
  };

  const handleUpdatePatient = (updated: Patient) => {
    setActivePatient(updated);
    setPatients(prev => {
      const idx = prev.findIndex(p => p.id === updated.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [...prev, updated];
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 no-print">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => { setCurrentPage('home'); setActivePatient(null); }}
        >
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">SOAP Clinic</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full px-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Role:</span>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-sm font-bold text-blue-700 outline-none"
            >
              <option value={UserRole.Clinician}>Clinician</option>
              <option value={UserRole.Pharmacist}>Pharmacist</option>
              <option value={UserRole.Viewer}>Viewer</option>
              <option value={UserRole.Admin}>Admin</option>
            </select>
          </div>
          
          <button 
            onClick={() => window.print()}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition"
          >
            Export / Print
          </button>
        </div>
      </header>

      <main className="flex-1">
        {currentPage === 'home' && (
          <Home 
            patients={patients} 
            onSelectPatient={(p) => { setActivePatient(p); setCurrentPage('inpatient'); }}
            onInpatient={handleCreateInpatient} 
            onOutpatient={() => setCurrentPage('outpatient')} 
          />
        )}
        {currentPage === 'inpatient' && activePatient && (
          <InpatientForm 
            patient={activePatient} 
            role={role} 
            onUpdate={handleUpdatePatient}
          />
        )}
        {currentPage === 'outpatient' && (
          <OutpatientForm onBack={() => setCurrentPage('home')} />
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-slate-500 text-xs no-print">
        © 2024 Clinical SOAP Collector • HIPAA Compliant Data Entry • V1.0.2
      </footer>
    </div>
  );
};

export default App;
