import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ═══════════════════════════════════════════════════════
   Stats Store
   ═══════════════════════════════════════════════════════ */
interface SiteStats {
  cvsCreated: number;
  totalDownloads: number;
  wallpapers: number;
  stockPhotos: number;
}

interface UserStats {
  cvsCreated: number;
  cvsDownloaded: number;
  wallpapersDownloaded: number;
  photosDownloaded: number;
  templatesUsed: string[];
  totalDownloads: number;
}

interface StatsState {
  stats: SiteStats;
  userStats: UserStats;
  incrementCVs: () => void;
  incrementDownloads: () => void;
  incrementWallpapers: () => void;
  incrementStockPhotos: () => void;
  trackTemplateUsed: (name: string) => void;
  getStats: () => SiteStats;
  getUserStats: () => UserStats;
  resetUserStats: () => void;
}

const defaultUserStats: UserStats = {
  cvsCreated: 0,
  cvsDownloaded: 0,
  wallpapersDownloaded: 0,
  photosDownloaded: 0,
  templatesUsed: [],
  totalDownloads: 0,
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      stats: { cvsCreated: 500, totalDownloads: 1000, wallpapers: 1000, stockPhotos: 1000 },
      userStats: { ...defaultUserStats },

      incrementCVs: () =>
        set((s) => ({
          stats: { ...s.stats, cvsCreated: s.stats.cvsCreated + 1 },
          userStats: {
            ...s.userStats,
            cvsCreated: s.userStats.cvsCreated + 1,
            cvsDownloaded: s.userStats.cvsDownloaded + 1,
            totalDownloads: s.userStats.totalDownloads + 1,
          },
        })),

      incrementDownloads: () =>
        set((s) => ({
          stats: { ...s.stats, totalDownloads: s.stats.totalDownloads + 1 },
        })),

      incrementWallpapers: () =>
        set((s) => ({
          stats: { ...s.stats, wallpapers: s.stats.wallpapers + 1 },
          userStats: {
            ...s.userStats,
            wallpapersDownloaded: s.userStats.wallpapersDownloaded + 1,
            totalDownloads: s.userStats.totalDownloads + 1,
          },
        })),

      incrementStockPhotos: () =>
        set((s) => ({
          stats: { ...s.stats, stockPhotos: s.stats.stockPhotos + 1 },
          userStats: {
            ...s.userStats,
            photosDownloaded: s.userStats.photosDownloaded + 1,
            totalDownloads: s.userStats.totalDownloads + 1,
          },
        })),

      trackTemplateUsed: (name) =>
        set((s) => {
          if (s.userStats.templatesUsed.includes(name)) return {};
          return {
            userStats: {
              ...s.userStats,
              templatesUsed: [...s.userStats.templatesUsed, name],
            },
          };
        }),

      getStats: () => get().stats,
      getUserStats: () => get().userStats,
      resetUserStats: () => set({ userStats: { ...defaultUserStats } }),
    }),
    { name: 'site-stats' },
  ),
);

/* ═══════════════════════════════════════════════════════
   Auth Store
   ═══════════════════════════════════════════════════════ */
interface User {
  name: string;
  email: string;
  [key: string]: unknown;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (data) =>
        set((s) => ({ user: s.user ? { ...s.user, ...data } : null })),
    }),
    { name: 'auth-storage' },
  ),
);

/* ═══════════════════════════════════════════════════════
   CV Store
   ═══════════════════════════════════════════════════════ */
interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  linkedIn: string;
  website: string;
  photo: string;
}

interface CVSettings {
  primaryColor: string;
  fontFamily: string;
  fontSize: string;
}

interface CVData {
  template: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Array<Record<string, unknown>>;
  education: Array<Record<string, unknown>>;
  skills: Array<Record<string, unknown>>;
  languages: Array<Record<string, unknown>>;
  certifications: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
  references: Array<Record<string, unknown>>;
  customSections: Array<Record<string, unknown>>;
  settings: CVSettings;
}

interface CVState {
  currentCV: CVData;
  savedCVs: CVData[];
  currentStep: number;
  setTemplate: (t: string) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  setSummary: (s: string) => void;
  addExperience: (e: Record<string, unknown>) => void;
  updateExperience: (id: number, e: Record<string, unknown>) => void;
  removeExperience: (id: number) => void;
  addEducation: (e: Record<string, unknown>) => void;
  updateEducation: (id: number, e: Record<string, unknown>) => void;
  removeEducation: (id: number) => void;
  addSkill: (s: Record<string, unknown>) => void;
  removeSkill: (id: number) => void;
  addLanguage: (l: Record<string, unknown>) => void;
  removeLanguage: (id: number) => void;
  addCertification: (c: Record<string, unknown>) => void;
  removeCertification: (id: number) => void;
  addProject: (p: Record<string, unknown>) => void;
  removeProject: (id: number) => void;
  updateSettings: (s: Partial<CVSettings>) => void;
  setCurrentStep: (n: number) => void;
  resetCV: () => void;
  loadCV: (cv: CVData) => void;
}

const blankPersonal: PersonalInfo = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  postalCode: '',
  linkedIn: '',
  website: '',
  photo: '',
};

const defaultCV: CVData = {
  template: 'modern',
  personalInfo: { ...blankPersonal },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  references: [],
  customSections: [],
  settings: { primaryColor: '#2563eb', fontFamily: 'Inter', fontSize: 'medium' },
};

export const useCVStore = create<CVState>()(
  persist(
    (set) => ({
      currentCV: { ...defaultCV },
      savedCVs: [],
      currentStep: 1,

      setTemplate: (template) =>
        set((s) => ({ currentCV: { ...s.currentCV, template } })),

      updatePersonalInfo: (info) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            personalInfo: { ...s.currentCV.personalInfo, ...info },
          },
        })),

      setSummary: (summary) =>
        set((s) => ({ currentCV: { ...s.currentCV, summary } })),

      addExperience: (exp) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            experience: [...s.currentCV.experience, { ...exp, id: Date.now() }],
          },
        })),
      updateExperience: (id, exp) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            experience: s.currentCV.experience.map((e) =>
              (e as { id: number }).id === id ? { ...e, ...exp } : e,
            ),
          },
        })),
      removeExperience: (id) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            experience: s.currentCV.experience.filter(
              (e) => (e as { id: number }).id !== id,
            ),
          },
        })),

      addEducation: (edu) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            education: [...s.currentCV.education, { ...edu, id: Date.now() }],
          },
        })),
      updateEducation: (id, edu) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            education: s.currentCV.education.map((e) =>
              (e as { id: number }).id === id ? { ...e, ...edu } : e,
            ),
          },
        })),
      removeEducation: (id) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            education: s.currentCV.education.filter(
              (e) => (e as { id: number }).id !== id,
            ),
          },
        })),

      addSkill: (skill) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            skills: [...s.currentCV.skills, { ...skill, id: Date.now() }],
          },
        })),
      removeSkill: (id) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            skills: s.currentCV.skills.filter(
              (sk) => (sk as { id: number }).id !== id,
            ),
          },
        })),

      addLanguage: (lang) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            languages: [...s.currentCV.languages, { ...lang, id: Date.now() }],
          },
        })),
      removeLanguage: (id) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            languages: s.currentCV.languages.filter(
              (l) => (l as { id: number }).id !== id,
            ),
          },
        })),

      addCertification: (cert) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            certifications: [
              ...s.currentCV.certifications,
              { ...cert, id: Date.now() },
            ],
          },
        })),
      removeCertification: (id) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            certifications: s.currentCV.certifications.filter(
              (c) => (c as { id: number }).id !== id,
            ),
          },
        })),

      addProject: (project) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            projects: [...s.currentCV.projects, { ...project, id: Date.now() }],
          },
        })),
      removeProject: (id) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            projects: s.currentCV.projects.filter(
              (p) => (p as { id: number }).id !== id,
            ),
          },
        })),

      updateSettings: (settings) =>
        set((s) => ({
          currentCV: {
            ...s.currentCV,
            settings: { ...s.currentCV.settings, ...settings },
          },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),
      resetCV: () => set({ currentCV: { ...defaultCV }, currentStep: 1 }),
      loadCV: (cv) => set({ currentCV: cv }),
    }),
    { name: 'cv-storage' },
  ),
);
