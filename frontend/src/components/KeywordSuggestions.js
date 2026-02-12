import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KeywordSuggestions = ({ jobTitle, currentSkills = [], onAddKeyword }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Comprehensive keyword database by category
  const keywordDatabase = {
    // Technical Skills
    frontend: ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'Next.js', 'Webpack', 'Responsive Design', 'UI/UX', 'SASS/SCSS'],
    backend: ['Node.js', 'Express.js', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'REST API', 'GraphQL', 'Microservices', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
    devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'Git', 'Linux', 'Nginx', 'Terraform', 'Ansible'],
    mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Mobile Development', 'App Store', 'Google Play'],
    
    // Soft Skills & Action Verbs
    leadership: ['Led', 'Managed', 'Coordinated', 'Directed', 'Mentored', 'Supervised', 'Facilitated', 'Team Leadership', 'Project Management', 'Stakeholder Management'],
    achievement: ['Achieved', 'Delivered', 'Implemented', 'Developed', 'Designed', 'Optimized', 'Increased', 'Reduced', 'Improved', 'Enhanced', 'Streamlined'],
    communication: ['Collaborated', 'Presented', 'Communicated', 'Negotiated', 'Cross-functional', 'Agile', 'Scrum', 'Documentation', 'Technical Writing'],
    
    // Industry-Specific
    finance: ['Financial Modeling', 'Risk Management', 'Compliance', 'Auditing', 'Financial Analysis', 'Bloomberg Terminal', 'Excel', 'SAP', 'QuickBooks'],
    healthcare: ['HIPAA', 'Electronic Health Records', 'Patient Care', 'Medical Coding', 'Healthcare IT', 'Telemedicine', 'Clinical Documentation'],
    marketing: ['SEO', 'Google Analytics', 'Content Marketing', 'Social Media', 'Email Marketing', 'Brand Management', 'Digital Marketing', 'A/B Testing'],
    sales: ['CRM', 'Salesforce', 'Lead Generation', 'Account Management', 'Sales Forecasting', 'Negotiation', 'Client Relations', 'Revenue Growth'],
    
    // Data & Analytics
    data: ['Python', 'SQL', 'Data Analysis', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Data Visualization', 'Tableau', 'Power BI', 'Big Data', 'ETL'],
  };

  // Smart keyword suggestions based on job title
  const suggestedKeywords = useMemo(() => {
    const title = (jobTitle || '').toLowerCase();
    let suggestions = [];

    // Tech roles
    if (title.includes('frontend') || title.includes('front-end') || title.includes('react')) {
      suggestions = [...keywordDatabase.frontend, ...keywordDatabase.achievement];
    } else if (title.includes('backend') || title.includes('back-end') || title.includes('node')) {
      suggestions = [...keywordDatabase.backend, ...keywordDatabase.achievement];
    } else if (title.includes('full stack') || title.includes('fullstack')) {
      suggestions = [...keywordDatabase.frontend, ...keywordDatabase.backend, ...keywordDatabase.achievement];
    } else if (title.includes('devops') || title.includes('cloud')) {
      suggestions = [...keywordDatabase.devops, ...keywordDatabase.achievement];
    } else if (title.includes('mobile')) {
      suggestions = [...keywordDatabase.mobile, ...keywordDatabase.achievement];
    } else if (title.includes('data') || title.includes('analyst') || title.includes('scientist')) {
      suggestions = [...keywordDatabase.data, ...keywordDatabase.achievement];
    }
    // Business roles
    else if (title.includes('manager') || title.includes('lead')) {
      suggestions = [...keywordDatabase.leadership, ...keywordDatabase.communication, ...keywordDatabase.achievement];
    } else if (title.includes('marketing')) {
      suggestions = [...keywordDatabase.marketing, ...keywordDatabase.achievement];
    } else if (title.includes('sales')) {
      suggestions = [...keywordDatabase.sales, ...keywordDatabase.achievement];
    } else if (title.includes('finance')) {
      suggestions = [...keywordDatabase.finance, ...keywordDatabase.achievement];
    } else if (title.includes('healthcare') || title.includes('medical')) {
      suggestions = [...keywordDatabase.healthcare, ...keywordDatabase.achievement];
    }
    // Default: mix of everything
    else {
      suggestions = [
        ...keywordDatabase.achievement,
        ...keywordDatabase.communication,
        ...keywordDatabase.leadership,
        ...keywordDatabase.frontend.slice(0, 5),
        ...keywordDatabase.backend.slice(0, 5)
      ];
    }

    // Filter out already added skills
    const currentSkillsLower = currentSkills.map(s => s.toLowerCase());
    return [...new Set(suggestions)].filter(kw => !currentSkillsLower.includes(kw.toLowerCase()));
  }, [jobTitle, currentSkills]);

  // Get all keywords by category for browsing
  const getAllKeywords = () => {
    if (selectedCategory === 'all') {
      return suggestedKeywords.slice(0, 30);
    }
    return keywordDatabase[selectedCategory] || [];
  };

  const categories = [
    { id: 'all', label: '🎯 Recommended', icon: '✨' },
    { id: 'frontend', label: 'Frontend', icon: '🎨' },
    { id: 'backend', label: 'Backend', icon: '⚙️' },
    { id: 'devops', label: 'DevOps', icon: '🚀' },
    { id: 'mobile', label: 'Mobile', icon: '📱' },
    { id: 'data', label: 'Data & AI', icon: '📊' },
    { id: 'leadership', label: 'Leadership', icon: '👥' },
    { id: 'achievement', label: 'Action Verbs', icon: '💪' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-md overflow-hidden border border-blue-100"
    >
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🔑</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">ATS Keywords Optimizer</h3>
            <p className="text-blue-100 text-sm">Boost your CV visibility by 87%</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              {/* Info Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="flex-1">
                  <p className="text-amber-900 text-sm font-medium">ATS (Applicant Tracking Systems) scan CVs for keywords</p>
                  <p className="text-amber-700 text-xs mt-1">Add relevant keywords from below to increase your chances of getting noticed!</p>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Keyword Pills */}
              <div className="flex flex-wrap gap-2">
                {getAllKeywords().map((keyword, index) => (
                  <motion.button
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => onAddKeyword(keyword)}
                    className="px-4 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-400 rounded-full text-sm font-medium text-gray-700 hover:text-blue-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2 group"
                  >
                    <span>{keyword}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.button>
                ))}
              </div>

              {getAllKeywords().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">🎉</span>
                  <p className="font-medium">Great! You've added all suggested keywords.</p>
                  <p className="text-sm">Try exploring other categories for more options.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KeywordSuggestions;
