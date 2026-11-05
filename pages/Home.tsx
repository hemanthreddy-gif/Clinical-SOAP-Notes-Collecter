
import React from 'react';
import { Patient } from '../types';

interface HomeProps {
  patients: Patient[];
  onSelectPatient: (p: Patient) => void;
  onInpatient: () => void;
  onOutpatient: () => void;
}

const Home: React.FC<HomeProps> = ({ patients, onSelectPatient, onInpatient, onOutpatient }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Patient Data Collection System</h2>
        <p className="text-lg text-slate-600">Select a form type to begin collecting SOAP formatted clinical data.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <button 
          onClick={onInpatient}
          className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-32 h-32 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Inpatient Form</h3>
            <p className="text-slate-600 leading-relaxed">Complete daily progress, vitals, drug charts, and pharmacy reviews for admitted patients.</p>
          </div>
        </button>

        <button 
          onClick={onOutpatient}
          className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-32 h-32 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Outpatient Form</h3>
            <p className="text-slate-600 leading-relaxed">Swift data entry for ambulatory clinical encounters and quick prescriptions.</p>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold text-slate-800">Recent Inpatient Records</h4>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">{patients.length} Total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Patient Name</th>
                <th className="px-6 py-3">MRN / Admission No</th>
                <th className="px-6 py-3">Ward / Unit</th>
                <th className="px-6 py-3">Admission Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No patient records found. Start by creating a new form.</td>
                </tr>
              ) : (
                patients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">{p.patient_name || 'Unnamed Patient'}</td>
                    <td className="px-6 py-4 text-slate-600">{p.mrn}</td>
                    <td className="px-6 py-4 text-slate-600">{p.department_ward || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{p.date_of_admission}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.date_of_discharge ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'}`}>
                        {p.date_of_discharge ? 'Discharged' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onSelectPatient(p)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                      >
                        Open Case
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
