import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore, useStatsStore } from '../store/store';
import CVPreview from '../components/CVPreview';
import KeywordSuggestions from '../components/KeywordSuggestions';
import toast from 'react-hot-toast';
import { cvAPI } from '../services/api';
import { triggerSupportPopup } from '../components/SupportPopup';
import { ChevronsLeft, ChevronsRight, Download, Loader2, Info, ChevronLeft, ChevronRight, Menu, Check, User, ImageIcon, Briefcase, Mail, Phone, MapPin, Globe, Trash2, Plus, Zap, Search, Languages } from 'lucide-react';

const CVBuilder = () => {
  const cvStore = useCVStore();
  const { currentCV, currentStep, setCurrentStep, setTemplate } = cvStore;
  const { incrementCVs, incrementDownloads, trackTemplateUsed } = useStatsStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const cvPreviewRef = useRef(null);
  const [searchParams] = useSearchParams();

  // Set template from URL on component mount
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam) {
      const validTemplates = ['modern', 'classic', 'creative', 'minimal', 'professional', 'elegant', 'executive', 'tech', 'academic', 'compact', 'developer', 'corporate', 'designer', 'healthcare', 'finance', 'bold', 'vibrant', 'monochrome', 'artistic', 'clean', 'manager', 'startup', 'lawyer', 'engineer', 'teacher', 'sales', 'consultant', 'analyst', 'timeline', 'infographic'];
      if (validTemplates.includes(templateParam)) {
        setTemplate(templateParam);
        // Track template usage
        trackTemplateUsed(templateParam);
      }
    }
  }, [searchParams, setTemplate, trackTemplateUsed]);

  const steps = [
    { id: 1, name: 'Personal Info', icon: '👤' },
    { id: 2, name: 'Summary', icon: '📝' },
    { id: 3, name: 'Experience', icon: '💼' },
    { id: 4, name: 'Education', icon: '🎓' },
    { id: 5, name: 'Skills', icon: '⚡' },
    { id: 6, name: 'Finalize', icon: '✨' }
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateCV = () => {
    if (!currentCV.personalInfo.fullName || !currentCV.personalInfo.email) {
      toast.error('Please fill in required personal information');
      setCurrentStep(1);
      return;
    }
    generatePDF();
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const fileName = currentCV.personalInfo.fullName
        ? `${currentCV.personalInfo.fullName.replace(/\s+/g, '_')}_CV`
        : 'My_CV';

      // ── Clone the live preview CV element ─────────────────────────
      // cvPreviewRef wraps the live <CVPreview> — its firstElementChild
      // is the 595px wide template root with all inline styles intact.
      const previewRoot = cvPreviewRef.current?.firstElementChild;

      if (!previewRoot) throw new Error('CV preview not found');

      const clone = previewRoot.cloneNode(true);
      // Strip any screen-only transform scale from the live preview panel
      clone.style.removeProperty('transform');
      clone.style.removeProperty('transformOrigin');
      // Keep width: 595px — zoom will scale it to 794px (A4 width)

      // ── Inject into a hidden iframe – completely invisible to user ──
      const iframe = document.createElement('iframe');
      Object.assign(iframe.style, {
        position: 'fixed',
        right: '0', bottom: '0',
        width: '0', height: '0',
        border: 'none',
        visibility: 'hidden',
        opacity: '0',
      });
      document.body.appendChild(iframe);

      const idoc = iframe.contentDocument || iframe.contentWindow.document;
      idoc.open();
      idoc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${fileName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    html, body { background: white; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 0; }
    /* zoom instead of transform so page breaks are layout-aware */
    /* 595px × 1.335 ≈ 794px = A4 width @96dpi */
    body > div { zoom: 1.335; font-size: 9px; line-height: 1.35; }
    body > div h1 { font-size: 20px; line-height: 1.15; margin-bottom: 2px; }
    body > div h2 { font-size: 10.5px; line-height: 1.2; margin-bottom: 5px; }
    body > div h3 { font-size: 10px; line-height: 1.2; margin-bottom: 2px; }
    body > div p  { font-size: 8.5px; line-height: 1.3; margin-bottom: 2px; }
    body > div li { font-size: 8.5px; line-height: 1.3; margin-bottom: 1px; }
    body > div section { margin-bottom: 8px; }
    h1,h2,h3,h4,h5,h6 { break-after: avoid; page-break-after: avoid; }
    img { break-inside: avoid; page-break-inside: avoid; max-width: 100%; }
  </style>
</head>
<body>${clone.outerHTML}</body>
</html>`);
      idoc.close();

      // Wait for fonts / images inside the iframe to load
      await new Promise(resolve => setTimeout(resolve, 500));

      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // Clean up iframe after the print dialog is closed
      const cleanup = () => {
        iframe.remove();
        iframe.contentWindow?.removeEventListener('afterprint', cleanup);
      };
      iframe.contentWindow.addEventListener('afterprint', cleanup);
      // Fallback cleanup in case afterprint doesn't fire
      setTimeout(cleanup, 30000);

      // Update live stats
      incrementCVs();
      incrementDownloads();

      // Backup to cloud (non-blocking)
      try {
        const sessionId = localStorage.getItem('cvSessionId') ||
          `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('cvSessionId', sessionId);
        cvAPI.backupToCloud(currentCV, sessionId).catch(() => {});
      } catch (_) { /* silent */ }

      toast.success('Print dialog opened! Choose "Save as PDF" to download.');
      triggerSupportPopup();
    } catch (error) {
      console.error('PDF error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Steps Navigation */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-30 overflow-y-auto shadow-lg"
          >
            <div className="p-5">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">CV Builder</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-1.5">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentStep === step.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : currentStep > step.id
                        ? 'text-green-700 bg-green-50/50 hover:bg-green-50'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                      currentStep === step.id
                        ? 'bg-blue-600 text-white'
                        : currentStep > step.id
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                    </span>
                    <span>{step.name}</span>
                    {currentStep === step.id && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span className="font-semibold text-gray-700">{Math.round((currentStep / 6) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 6) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {currentStep === 6 ? '🎉 Ready to download!' : `${6 - currentStep} step${6 - currentStep !== 1 ? 's' : ''} remaining`}
                </p>
              </div>

              {/* Download button only on Finalize */}
              {currentStep === 6 && (
                <div className="mt-5">
                  <button
                    onClick={handleGenerateCV}
                    disabled={isGenerating}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      isGenerating
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Data info */}
              <div className="mt-5 flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-600">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>Your CV data is stored locally and backed up to cloud when you download.</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar toggle button (visible when sidebar is closed) */}
      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSidebarOpen(true)}
          className="fixed left-3 top-20 z-30 p-2 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg text-gray-600 hover:text-blue-600 transition-all duration-200"
          title="Show steps"
        >
          <ChevronsRight className="w-5 h-5" />
        </motion.button>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          {/* Mobile step indicator */}
          <div className="lg:hidden flex items-center gap-3 mb-4 px-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-blue-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium text-gray-600">
              Step {currentStep} of 6: <span className="text-gray-900">{steps[currentStep - 1]?.name}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && <PersonalInfoForm />}
                  {currentStep === 2 && <SummaryForm />}
                  {currentStep === 3 && <ExperienceForm />}
                  {currentStep === 4 && <EducationForm />}
                  {currentStep === 5 && <SkillsForm />}
                  {currentStep === 6 && <FinalizeForm />}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 text-sm md:text-base ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                
                {currentStep < 6 ? (
                  <button
                    onClick={handleNext}
                    className="px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm md:text-base"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateCV}
                    className="px-4 md:px-6 py-2.5 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg text-sm md:text-base"
                  >
                    <Download className="w-5 h-5" />
                    Download CV
                  </button>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live Preview
                </h3>
                <div className="overflow-auto max-h-[600px] border rounded-xl bg-gray-100 p-2">
                  <div ref={cvPreviewRef} data-cv-preview="true" style={{ transformOrigin: 'top center' }}>
                    <CVPreview data={currentCV} />
                  </div>
                </div>
              </div>
            </div>

            {/* No hidden print element needed – PDF uses iframe clone of live preview */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Personal Info Form Component
const PersonalInfoForm = () => {
  const { currentCV, updatePersonalInfo } = useCVStore();
  const { personalInfo } = currentCV;
  const fileInputRef = React.useRef(null);
  const [focusedField, setFocusedField] = React.useState(null);

  const handleChange = (e) => {
    updatePersonalInfo({ [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo({ photo: reader.result });
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo({ photo: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Field hints for better UX
  const fieldHints = {
    fullName: 'Use your professional name as it appears on official documents',
    jobTitle: 'Your current or desired job title (e.g., "Senior Software Engineer")',
    email: 'Use a professional email address',
    phone: 'Include country code for international applications',
    linkedIn: 'Just the profile URL (e.g., linkedin.com/in/yourname)',
    website: 'Your portfolio or personal website'
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <p className="text-gray-500 text-sm">Make a great first impression</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-700 font-medium">Step 1 of 6</span>
          <span className="text-blue-600">
            {personalInfo.fullName && personalInfo.email ? '✓ Required fields complete' : 'Fill required fields to continue'}
          </span>
        </div>
      </div>

      {/* Photo Upload Section */}
      <motion.div 
        className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📸 Profile Photo 
          <span className="font-normal text-gray-400 ml-1">(Makes your CV stand out!)</span>
        </label>
        <div className="flex items-center gap-5">
          {personalInfo.photo ? (
            <motion.div 
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img 
                src={personalInfo.photo} 
                alt="Profile" 
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl"
              />
              <motion.button
                onClick={removePhoto}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 shadow-lg"
              >
                ×
              </motion.button>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <Check className="w-3 h-3 text-white" />
              </div>
            </motion.div>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <motion.label
              htmlFor="photo-upload"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
            >
              <ImageIcon className="w-4 h-4" />
              {personalInfo.photo ? 'Change Photo' : 'Upload Photo'}
            </motion.label>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG • Max 5MB • Square works best</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 text-blue-500" />
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handleChange}
            onFocus={() => setFocusedField('fullName')}
            onBlur={() => setFocusedField(null)}
            placeholder="John Doe"
            className="input-field input-animated"
            required
          />
          {focusedField === 'fullName' && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-blue-600 mt-1"
            >
              💡 {fieldHints.fullName}
            </motion.p>
          )}
        </div>

        {/* Job Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 text-purple-500" />
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            value={personalInfo.jobTitle || ''}
            onChange={handleChange}
            onFocus={() => setFocusedField('jobTitle')}
            onBlur={() => setFocusedField(null)}
            placeholder="Software Engineer"
            className="input-field input-animated"
          />
          {focusedField === 'jobTitle' && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-purple-600 mt-1"
            >
              💡 {fieldHints.jobTitle}
            </motion.p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Mail className="w-4 h-4 text-green-500" />
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={personalInfo.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder="john@example.com"
            className="input-field input-animated"
            required
          />
          {focusedField === 'email' && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-green-600 mt-1"
            >
              💡 {fieldHints.email}
            </motion.p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Phone className="w-4 h-4 text-orange-500" />
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            placeholder="+1 234 567 890"
            className="input-field input-animated"
          />
          {focusedField === 'phone' && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-orange-600 mt-1"
            >
              💡 {fieldHints.phone}
            </motion.p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 text-red-500" />
            City
          </label>
          <input
            type="text"
            name="city"
            value={personalInfo.city}
            onChange={handleChange}
            placeholder="New York"
            className="input-field input-animated"
          />
        </div>

        {/* Country */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Globe className="w-4 h-4 text-teal-500" />
            Country
          </label>
          <input
            type="text"
            name="country"
            value={personalInfo.country}
            onChange={handleChange}
            placeholder="United States"
            className="input-field input-animated"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </label>
          <input
            type="url"
            name="linkedIn"
            value={personalInfo.linkedIn}
            onChange={handleChange}
            onFocus={() => setFocusedField('linkedIn')}
            onBlur={() => setFocusedField(null)}
            placeholder="linkedin.com/in/johndoe"
            className="input-field input-animated"
          />
          {focusedField === 'linkedIn' && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-blue-600 mt-1"
            >
              💡 {fieldHints.linkedIn}
            </motion.p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            Portfolio / Website
          </label>
          <input
            type="url"
            name="website"
            value={personalInfo.website}
            onChange={handleChange}
            onFocus={() => setFocusedField('website')}
            onBlur={() => setFocusedField(null)}
            placeholder="www.johndoe.com"
            className="input-field input-animated"
          />
          {focusedField === 'website' && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-indigo-600 mt-1"
            >
              💡 {fieldHints.website}
            </motion.p>
          )}
        </div>
      </div>

      {/* Quick Tips Card */}
      <motion.div 
        className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">Pro Tips for This Section</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Use your full professional name consistently</li>
              <li>• A good photo increases callback rates by 40%</li>
              <li>• LinkedIn profiles help recruiters learn more about you</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Summary Form Component
const SummaryForm = () => {
  const { currentCV, setSummary } = useCVStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Summary</h2>
      <p className="text-gray-600 mb-6">Write a brief summary about yourself and your career goals</p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
        <textarea
          value={currentCV.summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="A dedicated and results-driven professional with 5+ years of experience in..."
          rows={6}
          className="input-field resize-none"
          maxLength={1000}
        />
        <p className="text-sm text-gray-500 mt-2">
          {currentCV.summary.length}/1000 characters
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h4 className="font-medium text-blue-800 mb-2">💡 Tips for a great summary:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep it concise (3-5 sentences)</li>
          <li>• Highlight your key achievements</li>
          <li>• Mention your years of experience</li>
          <li>• Include relevant skills and expertise</li>
        </ul>
      </div>
    </div>
  );
};

// Experience Form Component
const ExperienceForm = () => {
  const { currentCV, addExperience, removeExperience } = useCVStore();
  const [newExp, setNewExp] = useState({
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleAdd = () => {
    if (newExp.jobTitle && newExp.company) {
      addExperience(newExp);
      setNewExp({
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
      toast.success('Experience added!');
    } else {
      toast.error('Please fill in job title and company');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h2>
      <p className="text-gray-600 mb-6">Add your work history, starting with the most recent</p>

      {/* Existing experiences */}
      {currentCV.experience.length > 0 && (
        <div className="mb-6 space-y-4">
          {currentCV.experience.map((exp, index) => (
            <div key={exp.id} className="p-4 bg-gray-50 rounded-xl border">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new experience form */}
      <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl">
        <h4 className="font-medium text-gray-900 mb-4">Add New Experience</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              value={newExp.jobTitle}
              onChange={(e) => setNewExp({ ...newExp, jobTitle: e.target.value })}
              placeholder="Software Developer"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={newExp.company}
              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              placeholder="Google Inc."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={newExp.location}
              onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
              placeholder="San Francisco, CA"
              className="input-field"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="month"
                value={newExp.startDate}
                onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="month"
              value={newExp.endDate}
              onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
              disabled={newExp.current}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newExp.current}
                onChange={(e) => setNewExp({ ...newExp, current: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">I currently work here</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newExp.description}
              onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
              placeholder="Describe your responsibilities and achievements..."
              rows={4}
              className="input-field resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>
    </div>
  );
};

// Education Form Component
const EducationForm = () => {
  const { currentCV, addEducation, removeEducation } = useCVStore();
  const [newEdu, setNewEdu] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    grade: '',
    description: ''
  });

  const handleAdd = () => {
    if (newEdu.degree && newEdu.institution) {
      addEducation(newEdu);
      setNewEdu({
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        grade: '',
        description: ''
      });
      toast.success('Education added!');
    } else {
      toast.error('Please fill in degree and institution');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Education</h2>
      <p className="text-gray-600 mb-6">Add your educational background</p>

      {/* Existing education */}
      {currentCV.education.length > 0 && (
        <div className="mb-6 space-y-4">
          {currentCV.education.map((edu) => (
            <div key={edu.id} className="p-4 bg-gray-50 rounded-xl border">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                </div>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new education form */}
      <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl">
        <h4 className="font-medium text-gray-900 mb-4">Add New Education</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
            <input
              type="text"
              value={newEdu.degree}
              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              placeholder="Bachelor of Science in Computer Science"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
            <input
              type="text"
              value={newEdu.institution}
              onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
              placeholder="Harvard University"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="month"
              value={newEdu.startDate}
              onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="month"
              value={newEdu.endDate}
              onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
              disabled={newEdu.current}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade/GPA</label>
            <input
              type="text"
              value={newEdu.grade}
              onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
              placeholder="3.8 GPA"
              className="input-field"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newEdu.current}
                onChange={(e) => setNewEdu({ ...newEdu, current: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Currently studying here</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Education
        </button>
      </div>
    </div>
  );
};

// Skills Form Component
const SkillsForm = () => {
  const { currentCV, addSkill, removeSkill, addLanguage, removeLanguage } = useCVStore();
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate' });
  const [newLang, setNewLang] = useState({ name: '', proficiency: 'conversational' });

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      addSkill(newSkill);
      setNewSkill({ name: '', level: 'intermediate' });
      toast.success('Skill added!');
    } else {
      toast.error('Please enter a skill name');
    }
  };

  const handleAddLanguage = () => {
    if (newLang.name.trim()) {
      addLanguage(newLang);
      setNewLang({ name: '', proficiency: 'conversational' });
      toast.success('Language added!');
    } else {
      toast.error('Please enter a language name');
    }
  };

  const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const proficiencyLevels = ['basic', 'conversational', 'fluent', 'native'];

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Skills & Languages</h2>
          <p className="text-gray-500 text-sm">Showcase your expertise</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-700 font-medium">Step 5 of 6</span>
          <span className="text-purple-600">
            {currentCV.skills.length} skills • {currentCV.languages.length} languages
          </span>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚡</span>
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
        </div>
        
        {currentCV.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentCV.skills.map((skill) => (
              <motion.span
                key={skill.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-xl shadow-sm border border-blue-200"
              >
                <span className="font-medium">{skill.name}</span>
                <span className="text-xs text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">
                  {skill.level}
                </span>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="text-blue-400 hover:text-red-500 transition-colors ml-1"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Type a skill (e.g., JavaScript, React, Python)"
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-blue-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            {newSkill.name && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                Press Enter to add
              </div>
            )}
          </div>
          <select
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            className="px-4 py-3 bg-white border-2 border-blue-200 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all sm:w-40"
          >
            {skillLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
          <motion.button
            onClick={handleAddSkill}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </motion.button>
        </div>

        {/* AI-Powered Keyword Suggestions */}
        <KeywordSuggestions
          jobTitle={currentCV.personalInfo.jobTitle || ''}
          currentSkills={currentCV.skills.map(s => s.name)}
          onAddKeyword={(keyword) => {
            addSkill({ name: keyword, level: 'intermediate' });
            toast.success(`${keyword} added!`);
          }}
        />
      </div>

      {/* Languages Section */}
      <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🌍</span>
          <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
        </div>
        
        {currentCV.languages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentCV.languages.map((lang) => (
              <motion.span
                key={lang.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-xl shadow-sm border border-green-200"
              >
                <span className="font-medium">{lang.name}</span>
                <span className="text-xs text-green-500 bg-green-100 px-2 py-0.5 rounded-full">
                  {lang.proficiency}
                </span>
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className="text-green-400 hover:text-red-500 transition-colors ml-1"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Languages className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={newLang.name}
              onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
              placeholder="Type a language (e.g., English, Spanish)"
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-green-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
            />
            {newLang.name && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                Press Enter to add
              </div>
            )}
          </div>
          <select
            value={newLang.proficiency}
            onChange={(e) => setNewLang({ ...newLang, proficiency: e.target.value })}
            className="px-4 py-3 bg-white border-2 border-green-200 rounded-xl text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all sm:w-40"
          >
            {proficiencyLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
          <motion.button
            onClick={handleAddLanguage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </motion.button>
        </div>

        {/* Suggested languages */}
        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-xs text-green-600 mb-2 font-medium">💡 Common languages (click to add):</p>
          <div className="flex flex-wrap gap-2">
            {['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Hindi', 'Portuguese'].map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  if (!currentCV.languages.find(l => l.name.toLowerCase() === lang.toLowerCase())) {
                    addLanguage({ name: lang, proficiency: 'conversational' });
                    toast.success(`${lang} added!`);
                  } else {
                    toast.error(`${lang} already added`);
                  }
                }}
                className="px-3 py-1 text-xs bg-white text-green-600 rounded-full border border-green-200 hover:bg-green-600 hover:text-white transition-all"
              >
                + {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Finalize Form Component
const FinalizeForm = () => {
  const { currentCV, setTemplate, updateSettings } = useCVStore();
  const { trackTemplateUsed } = useStatsStore();

  const templates = [
    { id: 'modern', name: 'Modern', color: '#2563eb', hasPhoto: true, layout: 'Single', icon: '🎨' },
    { id: 'classic', name: 'Classic', color: '#374151', hasPhoto: true, layout: 'Single', icon: '📜' },
    { id: 'creative', name: 'Creative', color: '#9333ea', hasPhoto: true, layout: 'Two-col', icon: '🎭' },
    { id: 'minimal', name: 'Minimal', color: '#000000', hasPhoto: false, layout: 'Single', icon: '⚪' },
    { id: 'professional', name: 'Professional', color: '#0369a1', hasPhoto: true, layout: 'Single', icon: '💼' },
    { id: 'elegant', name: 'Elegant', color: '#be123c', hasPhoto: true, layout: 'Single', icon: '✨' },
    { id: 'executive', name: 'Executive', color: '#1e293b', hasPhoto: true, layout: 'Two-col', icon: '👔' },
    { id: 'tech', name: 'Tech', color: '#059669', hasPhoto: true, layout: 'Single', icon: '💻' },
    { id: 'academic', name: 'Academic', color: '#3730a3', hasPhoto: true, layout: 'Single', icon: '🎓' },
    { id: 'compact', name: 'Compact', color: '#4b5563', hasPhoto: false, layout: 'Two-col', icon: '📄' },
    { id: 'developer', name: 'Developer', color: '#22c55e', hasPhoto: true, layout: 'Single', icon: '⌨️' },
    { id: 'corporate', name: 'Corporate', color: '#1e3a5f', hasPhoto: true, layout: 'Single', icon: '🏢' },
    { id: 'designer', name: 'Designer', color: '#ec4899', hasPhoto: true, layout: 'Two-col', icon: '🎨' },
    { id: 'healthcare', name: 'Healthcare', color: '#0d9488', hasPhoto: true, layout: 'Single', icon: '⚕️' },
    { id: 'finance', name: 'Finance', color: '#166534', hasPhoto: true, layout: 'Single', icon: '📊' },
    { id: 'timeline', name: 'Timeline', color: '#7c3aed', hasPhoto: true, layout: 'Timeline', icon: '📅' },
    { id: 'infographic', name: 'Infographic', color: '#0891b2', hasPhoto: true, layout: 'Cards', icon: '📊' },
    { id: 'bold', name: 'Bold', color: '#dc2626', hasPhoto: true, layout: 'Single', icon: '💪' },
    { id: 'vibrant', name: 'Vibrant', color: '#f59e0b', hasPhoto: true, layout: 'Two-col', icon: '🌈' },
    { id: 'monochrome', name: 'Monochrome', color: '#171717', hasPhoto: false, layout: 'Single', icon: '⚫' },
    { id: 'artistic', name: 'Artistic', color: '#8b5cf6', hasPhoto: true, layout: 'Single', icon: '🖼️' },
    { id: 'clean', name: 'Clean', color: '#3b82f6', hasPhoto: false, layout: 'Two-col', icon: '✨' },
    { id: 'manager', name: 'Manager', color: '#475569', hasPhoto: true, layout: 'Single', icon: '👨‍💼' },
    { id: 'startup', name: 'Startup', color: '#06b6d4', hasPhoto: true, layout: 'Two-col', icon: '🚀' },
    { id: 'lawyer', name: 'Lawyer', color: '#92400e', hasPhoto: true, layout: 'Single', icon: '⚖️' },
    { id: 'engineer', name: 'Engineer', color: '#ea580c', hasPhoto: true, layout: 'Single', icon: '🔧' },
    { id: 'teacher', name: 'Teacher', color: '#65a30d', hasPhoto: true, layout: 'Single', icon: '👩‍🏫' },
    { id: 'sales', name: 'Sales', color: '#c026d3', hasPhoto: true, layout: 'Two-col', icon: '📈' },
    { id: 'consultant', name: 'Consultant', color: '#075985', hasPhoto: true, layout: 'Two-col', icon: '💡' },
    { id: 'analyst', name: 'Analyst', color: '#44403c', hasPhoto: true, layout: 'Single', icon: '📉' }
  ];

  const colors = [
    '#2563eb', '#7c3aed', '#0891b2', '#059669', 
    '#d97706', '#dc2626', '#1f2937', '#6366f1',
    '#be123c', '#9333ea', '#0369a1', '#374151'
  ];

  const fonts = [
    { id: 'Inter', name: 'Inter (Modern)' },
    { id: 'Georgia, serif', name: 'Georgia (Classic)' },
    { id: 'Poppins', name: 'Poppins (Clean)' },
    { id: 'Roboto', name: 'Roboto (Professional)' },
    { id: 'Playfair Display', name: 'Playfair (Elegant)' },
    { id: 'Montserrat', name: 'Montserrat (Bold)' },
    { id: 'Lato', name: 'Lato (Simple)' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Finalize Your CV</h2>
      <p className="text-gray-600 mb-6">Choose a template and customize the appearance</p>

      {/* Template Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Choose Template</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">30 templates</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => {
                setTemplate(template.id);
                trackTemplateUsed(template.id);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                currentCV.template === template.id
                  ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{template.icon}</span>
                <div 
                  className="flex-1 h-2 rounded"
                  style={{ backgroundColor: template.color }}
                />
              </div>
              <span className="font-medium text-gray-900 text-xs block">{template.name}</span>
              <div className="flex gap-1 mt-1">
                {template.hasPhoto && (
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Photo</span>
                )}
                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{template.layout}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accent Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => updateSettings({ primaryColor: color })}
              className={`w-10 h-10 rounded-full transition-all ${
                currentCV.settings.primaryColor === color
                  ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Font Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fonts.map((font) => (
            <button
              key={font.id}
              onClick={() => updateSettings({ fontFamily: font.id })}
              className={`p-3 rounded-xl border-2 transition-all ${
                currentCV.settings.fontFamily === font.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ fontFamily: font.id }}
            >
              <span className="font-medium text-gray-900 text-sm">{font.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-green-50 rounded-xl">
        <h4 className="font-semibold text-green-800 mb-3">✅ Your CV is ready!</h4>
        <ul className="text-sm text-green-700 space-y-2">
          <li className="flex items-center gap-2">
            <span className={currentCV.personalInfo.fullName ? 'text-green-600' : 'text-orange-500'}>
              {currentCV.personalInfo.fullName ? '✓' : '○'}
            </span>
            Personal Information: {currentCV.personalInfo.fullName || 'Not added'}
          </li>
          <li className="flex items-center gap-2">
            <span className={currentCV.personalInfo.photo ? 'text-green-600' : 'text-gray-400'}>
              {currentCV.personalInfo.photo ? '✓' : '○'}
            </span>
            Profile Photo: {currentCV.personalInfo.photo ? 'Added' : 'Not added'}
          </li>
          <li className="flex items-center gap-2">
            <span className={currentCV.summary ? 'text-green-600' : 'text-gray-400'}>
              {currentCV.summary ? '✓' : '○'}
            </span>
            Summary: {currentCV.summary ? 'Added' : 'Not added'}
          </li>
          <li className="flex items-center gap-2">
            <span className={currentCV.experience.length > 0 ? 'text-green-600' : 'text-orange-500'}>
              {currentCV.experience.length > 0 ? '✓' : '○'}
            </span>
            Experience: {currentCV.experience.length} entries
          </li>
          <li className="flex items-center gap-2">
            <span className={currentCV.education.length > 0 ? 'text-green-600' : 'text-orange-500'}>
              {currentCV.education.length > 0 ? '✓' : '○'}
            </span>
            Education: {currentCV.education.length} entries
          </li>
          <li className="flex items-center gap-2">
            <span className={currentCV.skills.length > 0 ? 'text-green-600' : 'text-gray-400'}>
              {currentCV.skills.length > 0 ? '✓' : '○'}
            </span>
            Skills: {currentCV.skills.length} skills
          </li>
          <li className="flex items-center gap-2">
            <span className={currentCV.languages.length > 0 ? 'text-green-600' : 'text-gray-400'}>
              {currentCV.languages.length > 0 ? '✓' : '○'}
            </span>
            Languages: {currentCV.languages.length} languages
          </li>
        </ul>
        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-sm text-green-700">
            <strong>Selected Template:</strong> {templates.find(t => t.id === currentCV.template)?.name || 'Modern'}
            {templates.find(t => t.id === currentCV.template)?.hasPhoto && currentCV.personalInfo.photo && ' (with photo)'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
