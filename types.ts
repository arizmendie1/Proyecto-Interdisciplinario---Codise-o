
export interface TeacherEntry {
  name: string;
  formativeField: string;
  discipline: string;
}

export interface DisciplineEntry {
  field: string;
  discipline: string;
  content: string;
  pda: string;
  evaluation: string;
  activityGeneralities: string; // Movido aquí
}

export interface ProjectData {
  schoolName: string;
  schoolYear: string;
  grade: string;
  trimester: string;
  projectName: string;
  thematicSituation: string;
  temporality: string;
  totalSessions: string;
  disciplines: DisciplineEntry[];
  teachers: TeacherEntry[];
}

export const FORMATIVE_FIELDS = [
  { id: 'lenguajes', name: 'Lenguajes', color: 'bg-indigo-600', lightColor: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'saberes', name: 'Saberes y Pensamiento Científico', color: 'bg-emerald-600', lightColor: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'etica', name: 'Ética, Naturaleza y Sociedades', color: 'bg-amber-600', lightColor: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'humano', name: 'De lo Humano y lo Comunitario', color: 'bg-rose-600', lightColor: 'bg-rose-50', border: 'border-rose-200' }
];

export const INITIAL_DATA: ProjectData = {
  schoolName: '',
  schoolYear: '2025 – 2026',
  grade: '',
  trimester: '',
  projectName: '',
  thematicSituation: '',
  temporality: '',
  totalSessions: '',
  disciplines: [{ field: 'Lenguajes', discipline: '', content: '', pda: '', evaluation: '', activityGeneralities: '' }],
  teachers: []
};
