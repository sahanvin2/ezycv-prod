import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Stats Store - Live updating statistics
export const useStatsStore = create(
  persist(
    (set, get) => ({
      stats: {
        cvsCreated: 500,
        totalDownloads: 1000,
        wallpapers: 1000,
        stockPhotos: 1000
      },
      // User-specific stats (tracked locally)
      userStats: {
        cvsCreated: 0,
        cvsDownloaded: 0,
        wallpapersDownloaded: 0,
        photosDownloaded: 0,
        templatesUsed: [],
        totalDownloads: 0
      },
      
      incrementCVs: () => set((state) => ({
        stats: { ...state.stats, cvsCreated: state.stats.cvsCreated + 1 },
        userStats: { 
          ...state.userStats, 
          cvsCreated: state.userStats.cvsCreated + 1,
          cvsDownloaded: state.userStats.cvsDownloaded + 1,
          totalDownloads: state.userStats.totalDownloads + 1
        }
      })),
      
      incrementDownloads: () => set((state) => ({
        stats: { ...state.stats, totalDownloads: state.stats.totalDownloads + 1 }
      })),
      
      incrementWallpapers: () => set((state) => ({
        stats: { ...state.stats, wallpapers: state.stats.wallpapers + 1 },
        userStats: { 
          ...state.userStats, 
          wallpapersDownloaded: state.userStats.wallpapersDownloaded + 1,
          totalDownloads: state.userStats.totalDownloads + 1
        }
      })),
      
      incrementStockPhotos: () => set((state) => ({
        stats: { ...state.stats, stockPhotos: state.stats.stockPhotos + 1 },
        userStats: { 
          ...state.userStats, 
          photosDownloaded: state.userStats.photosDownloaded + 1,
          totalDownloads: state.userStats.totalDownloads + 1
        }
      })),
      
      trackTemplateUsed: (templateName) => set((state) => {
        const currentTemplates = state.userStats?.templatesUsed || [];
        // Only add if not already in the array (unique templates)
        if (!currentTemplates.includes(templateName)) {
          return {
            userStats: { 
              ...state.userStats, 
              templatesUsed: [...currentTemplates, templateName]
            }
          };
        }
        return {}; // No change if template already tracked
      }),
      
      getStats: () => get().stats,
      getUserStats: () => get().userStats,
      
      resetUserStats: () => set({
        userStats: {
          cvsCreated: 0,
          cvsDownloaded: 0,
          wallpapersDownloaded: 0,
          photosDownloaded: 0,
          templatesUsed: [],
          totalDownloads: 0
        }
      })
    }),
    {
      name: 'site-stats',
    }
  )
);

// Auth Store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// CV Store
export const useCVStore = create(
  persist(
    (set, get) => ({
      currentCV: {
        template: 'modern',
        personalInfo: {
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
          photo: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: [],
        references: [],
        customSections: [],
        settings: {
          primaryColor: '#2563eb',
          fontFamily: 'Inter',
          fontSize: 'medium'
        }
      },
      savedCVs: [],
      currentStep: 1,
      
      setTemplate: (template) => set((state) => ({
        currentCV: { ...state.currentCV, template }
      })),
      
      updatePersonalInfo: (info) => set((state) => ({
        currentCV: { 
          ...state.currentCV, 
          personalInfo: { ...state.currentCV.personalInfo, ...info }
        }
      })),
      
      setSummary: (summary) => set((state) => ({
        currentCV: { ...state.currentCV, summary }
      })),
      
      addExperience: (exp) => set((state) => ({
        currentCV: { 
          ...state.currentCV, 
          experience: [...state.currentCV.experience, { ...exp, id: Date.now() }]
        }
      })),
      
      updateExperience: (id, exp) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          experience: state.currentCV.experience.map(e => 
            e.id === id ? { ...e, ...exp } : e
          )
        }
      })),
      
      removeExperience: (id) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          experience: state.currentCV.experience.filter(e => e.id !== id)
        }
      })),
      
      addEducation: (edu) => set((state) => ({
        currentCV: { 
          ...state.currentCV, 
          education: [...state.currentCV.education, { ...edu, id: Date.now() }]
        }
      })),
      
      updateEducation: (id, edu) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          education: state.currentCV.education.map(e => 
            e.id === id ? { ...e, ...edu } : e
          )
        }
      })),
      
      removeEducation: (id) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          education: state.currentCV.education.filter(e => e.id !== id)
        }
      })),
      
      addSkill: (skill) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          skills: [...state.currentCV.skills, { ...skill, id: Date.now() }]
        }
      })),
      
      removeSkill: (id) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          skills: state.currentCV.skills.filter(s => s.id !== id)
        }
      })),
      
      addLanguage: (lang) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          languages: [...state.currentCV.languages, { ...lang, id: Date.now() }]
        }
      })),
      
      removeLanguage: (id) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          languages: state.currentCV.languages.filter(l => l.id !== id)
        }
      })),
      
      addCertification: (cert) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          certifications: [...state.currentCV.certifications, { ...cert, id: Date.now() }]
        }
      })),
      
      removeCertification: (id) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          certifications: state.currentCV.certifications.filter(c => c.id !== id)
        }
      })),
      
      addProject: (project) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          projects: [...state.currentCV.projects, { ...project, id: Date.now() }]
        }
      })),
      
      removeProject: (id) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          projects: state.currentCV.projects.filter(p => p.id !== id)
        }
      })),
      
      updateSettings: (settings) => set((state) => ({
        currentCV: {
          ...state.currentCV,
          settings: { ...state.currentCV.settings, ...settings }
        }
      })),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      resetCV: () => set({
        currentCV: {
          template: 'modern',
          personalInfo: {
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
            photo: ''
          },
          summary: '',
          experience: [],
          education: [],
          skills: [],
          languages: [],
          certifications: [],
          projects: [],
          references: [],
          customSections: [],
          settings: {
            primaryColor: '#2563eb',
            fontFamily: 'Inter',
            fontSize: 'medium'
          }
        },
        currentStep: 1
      }),
      
      loadCV: (cv) => set({ currentCV: cv }),
    }),
    {
      name: 'cv-storage',
    }
  )
);
