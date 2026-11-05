
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum UserRole {
  Clinician = 'Clinician',
  Pharmacist = 'Pharmacist',
  Viewer = 'Viewer',
  Admin = 'Admin'
}

export enum DosageForm {
  Tab = 'Tab',
  Cap = 'Cap',
  Inj = 'Inj',
  Nebul = 'Nebul',
  Syrup = 'Syrup',
  Ointment = 'Ointment',
  IV = 'IV',
  Other = 'Other'
}

export enum Route {
  PO = 'PO',
  IV = 'IV',
  IM = 'IM',
  SC = 'SC',
  Nebulized = 'Nebulized',
  Topical = 'Topical',
  PR = 'PR',
  Other = 'Other'
}

export enum Timing {
  BF = 'Before Food (BF)',
  AF = 'After Food (AF)',
  WithFood = 'With Food',
  EmptyStomach = 'Empty Stomach',
  Irrelevant = 'Irrelevant'
}

export interface Vital {
  id: string;
  time: string;
  pulse_pr_bpm?: number;
  respiratory_rate_rr_bpm?: number;
  spo2_percent?: number;
  systolic_bp_mmHg?: number;
  diastolic_bp_mmHg?: number;
  rbs_mg_dl?: number;
  fbs_mg_dl?: number;
  ppbs_mg_dl?: number;
  notes?: string;
}

export interface LabResult {
  id: string;
  test_name: string;
  value: string;
  units: string;
  sample_time: string;
}

export interface Treatment {
  id: string;
  dosage_form: DosageForm;
  route: Route;
  medication_brand?: string;
  medication_generic: string;
  indication: string;
  dose: string;
  frequency: string;
  timing_relation: Timing;
  start_date: string;
  end_date?: string;
  frequency_notes?: string;
  route_notes?: string;
  is_free_text: boolean;
  free_text_value?: string;
  continue_from_previous: boolean;
}

export interface ADRRecord {
  id: string;
  suspected_drug: string;
  description: string;
  severity: string;
  outcome: string;
  action_taken: string;
  timestamp: string;
  author: string;
}

export interface Encounter {
  day_number: number;
  date: string;
  conscious_coherent: boolean;
  chief_complaint_of_the_day: string;
  vitals: Vital[];
  cvs_text: string;
  rs_text: string;
  gcs_eye: number;
  gcs_verbal: number;
  gcs_motor: number;
  labs: LabResult[];
  treatments: Treatment[];
  pain_scale: number;
  pharm_care_issues: string;
  discussion: string;
}

export interface Patient {
  id: string;
  patient_name: string;
  mrn: string;
  age_years: number;
  gender: Gender;
  department_ward: string;
  consultant: string;
  date_of_admission: string;
  date_of_discharge?: string;
  provisional_diagnosis: string;
  chief_complaints: string;
  past_history: string;
  allergies: string;
  encounters: Encounter[];
  adrs: ADRRecord[];
}
