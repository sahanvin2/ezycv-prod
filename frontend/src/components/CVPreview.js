import React from 'react';

const CVPreview = ({ data, forPDF = false }) => {
  // eslint-disable-next-line no-unused-vars
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, settings, template } = data;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // SVG Icons as inline components for PDF compatibility
  // Preview mode: pure inline-flex centering (looks perfect in browser)
  // PDF mode: adds position offset to compensate for html2canvas flex rendering differences
  const iconBaseStyle = forPDF ? {
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'middle',
    lineHeight: 0,
    position: 'relative',
    top: '2px'
  } : {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    verticalAlign: 'middle',
    lineHeight: 0
  };

  const Icons = {
    email: (color = 'currentColor', size = 12) => (
      <span style={{ ...iconBaseStyle, width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      </span>
    ),
    phone: (color = 'currentColor', size = 12) => (
      <span style={{ ...iconBaseStyle, width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </span>
    ),
    location: (color = 'currentColor', size = 12) => (
      <span style={{ ...iconBaseStyle, width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </span>
    ),
    linkedin: (color = 'currentColor', size = 12) => (
      <span style={{ ...iconBaseStyle, width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </span>
    ),
    website: (color = 'currentColor', size = 12) => (
      <span style={{ ...iconBaseStyle, width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </span>
    ),
    briefcase: (color = 'currentColor', size = 14) => (
      <span style={{ ...iconBaseStyle, width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      </span>
    ),
    graduation: (color = 'currentColor', size = 14) => (
      <span style={{ ...iconBaseStyle, width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </span>
    ),
    star: (color = 'currentColor', size = 14) => (
      <span style={{ ...iconBaseStyle, width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </span>
    ),
    globe: (color = 'currentColor', size = 14) => (
      <span style={{ ...iconBaseStyle, width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </span>
    ),
    award: (color = 'currentColor', size = 14) => (
      <span style={{ ...iconBaseStyle, width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"/>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
        </svg>
      </span>
    )
  };

  // Template configurations - 30 UNIQUE templates
  const templateConfigs = {
    // === SINGLE COLUMN TEMPLATES ===
    modern: { name: 'Modern', layout: 'modern-single', hasPhoto: true, accentColor: '#2563eb' },
    classic: { name: 'Classic', layout: 'classic-single', hasPhoto: true, accentColor: '#374151' },
    minimal: { name: 'Minimal', layout: 'minimal-single', hasPhoto: false, accentColor: '#000000' },
    professional: { name: 'Professional', layout: 'professional-single', hasPhoto: true, accentColor: '#0369a1' },
    elegant: { name: 'Elegant', layout: 'elegant-single', hasPhoto: true, accentColor: '#be123c' },
    tech: { name: 'Tech', layout: 'tech-single', hasPhoto: true, accentColor: '#059669' },
    academic: { name: 'Academic', layout: 'academic-single', hasPhoto: true, accentColor: '#3730a3' },
    bold: { name: 'Bold', layout: 'bold-single', hasPhoto: true, accentColor: '#dc2626' },
    monochrome: { name: 'Monochrome', layout: 'monochrome-single', hasPhoto: false, accentColor: '#171717' },
    artistic: { name: 'Artistic', layout: 'artistic-single', hasPhoto: true, accentColor: '#8b5cf6' },
    
    // === TWO COLUMN LEFT SIDEBAR ===
    creative: { name: 'Creative', layout: 'creative-sidebar', hasPhoto: true, accentColor: '#9333ea' },
    executive: { name: 'Executive', layout: 'executive-sidebar', hasPhoto: true, accentColor: '#1e293b' },
    designer: { name: 'Designer', layout: 'designer-sidebar', hasPhoto: true, accentColor: '#ec4899' },
    startup: { name: 'Startup', layout: 'startup-sidebar', hasPhoto: true, accentColor: '#06b6d4' },
    vibrant: { name: 'Vibrant', layout: 'vibrant-sidebar', hasPhoto: true, accentColor: '#f59e0b' },
    
    // === TWO COLUMN RIGHT SIDEBAR ===
    compact: { name: 'Compact', layout: 'compact-right', hasPhoto: false, accentColor: '#4b5563' },
    clean: { name: 'Clean', layout: 'clean-right', hasPhoto: false, accentColor: '#3b82f6' },
    consultant: { name: 'Consultant', layout: 'consultant-right', hasPhoto: true, accentColor: '#075985' },
    
    // === TIMELINE / UNIQUE LAYOUTS ===
    timeline: { name: 'Timeline', layout: 'timeline', hasPhoto: true, accentColor: '#7c3aed' },
    infographic: { name: 'Infographic', layout: 'infographic', hasPhoto: true, accentColor: '#0891b2' },
    
    // === PROFESSION-SPECIFIC ===
    developer: { name: 'Developer', layout: 'developer', hasPhoto: true, accentColor: '#22c55e' },
    corporate: { name: 'Corporate', layout: 'corporate', hasPhoto: true, accentColor: '#1e3a5f' },
    healthcare: { name: 'Healthcare', layout: 'healthcare', hasPhoto: true, accentColor: '#0d9488' },
    finance: { name: 'Finance', layout: 'finance', hasPhoto: true, accentColor: '#166534' },
    lawyer: { name: 'Lawyer', layout: 'lawyer', hasPhoto: true, accentColor: '#92400e' },
    engineer: { name: 'Engineer', layout: 'engineer', hasPhoto: true, accentColor: '#ea580c' },
    teacher: { name: 'Teacher', layout: 'teacher', hasPhoto: true, accentColor: '#65a30d' },
    sales: { name: 'Sales', layout: 'sales', hasPhoto: true, accentColor: '#c026d3' },
    manager: { name: 'Manager', layout: 'manager', hasPhoto: true, accentColor: '#475569' },
    analyst: { name: 'Analyst', layout: 'analyst', hasPhoto: true, accentColor: '#44403c' }
  };

  const config = templateConfigs[template] || templateConfigs.modern;
  const accentColor = settings?.primaryColor || config.accentColor;
  const fontFamily = settings?.fontFamily || 'Arial, Helvetica, sans-serif';

  // Helper: Check if color is light
  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  };

  // Photo Component - FIXED for proper PDF rendering with aspect-ratio
  const Photo = ({ size = 80, borderColor = '#ffffff' }) => {
    if (!config.hasPhoto) return null;
    
    const containerStyle = {
      width: `${size}px`,
      height: `${size}px`,
      minWidth: `${size}px`,
      minHeight: `${size}px`,
      maxWidth: `${size}px`,
      maxHeight: `${size}px`,
      borderRadius: '50%',
      overflow: 'hidden',
      border: `3px solid ${borderColor}`,
      backgroundColor: '#e5e7eb',
      flexShrink: 0,
      position: 'relative',
      aspectRatio: '1 / 1'
    };

    if (personalInfo?.photo) {
      return (
        <div style={containerStyle}>
          <img 
            src={personalInfo.photo} 
            alt=""
            crossOrigin="anonymous"
            width={size}
            height={size}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              minWidth: `${size}px`,
              minHeight: `${size}px`,
              maxWidth: `${size}px`,
              maxHeight: `${size}px`,
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block',
              borderRadius: '50%',
              aspectRatio: '1 / 1',
              imageRendering: forPDF ? 'high-quality' : 'auto'
            }}
          />
        </div>
      );
    }

    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: accentColor + '30' }}>
        <span style={{ fontSize: `${size * 0.4}px`, fontWeight: '700', color: accentColor }}>
          {personalInfo?.fullName?.charAt(0)?.toUpperCase() || '?'}
        </span>
      </div>
    );
  };

  // Global text safety styles applied to all CV containers
  const textSafetyStyle = {
    overflowWrap: 'anywhere',
    wordBreak: 'break-word'
  };

  // Contact Item with Icon - separate styles for preview vs PDF
  const ContactItem = ({ icon, text, color = 'inherit' }) => {
    if (!text) return null;
    const iconWrapStyle = forPDF ? {
      display: 'inline-block',
      width: '12px',
      height: '12px',
      flexShrink: 0,
      verticalAlign: 'middle',
      position: 'relative',
      top: '2px'
    } : {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '12px',
      height: '12px',
      flexShrink: 0
    };
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '10px', color, lineHeight: '1.4' }}>
        <span style={iconWrapStyle}>{icon}</span>
        <span style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{text}</span>
      </div>
    );
  };

  // Get layout component based on template
  const renderTemplate = () => {
    const layout = config.layout;
    
    // MODERN SINGLE COLUMN
    if (layout === 'modern-single' || layout === 'professional-single' || layout === 'bold-single') {
      return <ModernSingleTemplate />;
    }
    
    // CLASSIC SINGLE
    if (layout === 'classic-single' || layout === 'corporate' || layout === 'finance' || layout === 'lawyer') {
      return <ClassicSingleTemplate />;
    }
    
    // MINIMAL SINGLE
    if (layout === 'minimal-single' || layout === 'monochrome-single') {
      return <MinimalSingleTemplate />;
    }
    
    // ELEGANT SINGLE
    if (layout === 'elegant-single' || layout === 'artistic-single') {
      return <ElegantSingleTemplate />;
    }
    
    // TECH SINGLE
    if (layout === 'tech-single' || layout === 'developer') {
      return <TechSingleTemplate />;
    }
    
    // ACADEMIC SINGLE
    if (layout === 'academic-single' || layout === 'teacher' || layout === 'healthcare') {
      return <AcademicSingleTemplate />;
    }
    
    // ENGINEER SINGLE
    if (layout === 'engineer' || layout === 'manager' || layout === 'analyst') {
      return <EngineerSingleTemplate />;
    }
    
    // SIDEBAR TEMPLATES
    if (layout === 'creative-sidebar' || layout === 'designer-sidebar' || layout === 'sales') {
      return <CreativeSidebarTemplate />;
    }
    
    if (layout === 'executive-sidebar' || layout === 'startup-sidebar' || layout === 'vibrant-sidebar') {
      return <ExecutiveSidebarTemplate />;
    }
    
    // RIGHT SIDEBAR
    if (layout === 'compact-right' || layout === 'clean-right' || layout === 'consultant-right') {
      return <CompactRightTemplate />;
    }
    
    // TIMELINE
    if (layout === 'timeline') {
      return <TimelineTemplate />;
    }
    
    // INFOGRAPHIC
    if (layout === 'infographic') {
      return <InfographicTemplate />;
    }
    
    // Default
    return <ModernSingleTemplate />;
  };

  // ==================== TEMPLATE COMPONENTS ====================

  // MODERN SINGLE COLUMN TEMPLATE
  const ModernSingleTemplate = () => {
    const headerTextColor = isLightColor(accentColor) ? '#1f2937' : '#ffffff';
    
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily,
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1f2937',
        ...textSafetyStyle
      }}>
        {/* Header */}
        <div style={{ backgroundColor: accentColor, padding: '24px', color: headerTextColor }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Photo size={90} borderColor={headerTextColor} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', lineHeight: '1.2' }}>
                {personalInfo?.fullName || 'Your Name'}
              </h1>
              {personalInfo?.jobTitle && (
                <p style={{ fontSize: '14px', opacity: '0.9', marginBottom: '12px' }}>{personalInfo.jobTitle}</p>
              )}
              
              {/* Contact with Icons - Fixed alignment */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '10px', lineHeight: '1.4' }}>
                {personalInfo?.email && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    {Icons.email(headerTextColor, 11)}<span>{personalInfo.email}</span>
                  </span>
                )}
                {personalInfo?.phone && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    {Icons.phone(headerTextColor, 11)}<span>{personalInfo.phone}</span>
                  </span>
                )}
                {(personalInfo?.city || personalInfo?.country) && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    {Icons.location(headerTextColor, 11)}<span>{[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')}</span>
                  </span>
                )}
              </div>
              {(personalInfo?.linkedIn || personalInfo?.website) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '10px', marginTop: '6px', lineHeight: '1.4' }}>
                  {personalInfo?.linkedIn && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      {Icons.linkedin(headerTextColor, 11)}<span>{personalInfo.linkedIn}</span>
                    </span>
                  )}
                  {personalInfo?.website && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      {Icons.website(headerTextColor, 11)}<span>{personalInfo.website}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          {/* Summary */}
          {summary && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '8px', paddingBottom: '4px', borderBottom: `2px solid ${accentColor}`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Professional Summary
              </h2>
              <p style={{ color: '#374151', lineHeight: '1.6', textAlign: 'justify' }}>{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '10px', paddingBottom: '4px', borderBottom: `2px solid ${accentColor}`, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '1.2' }}>
                {Icons.briefcase(accentColor, 14)} Work Experience
              </h2>
              {experience.map((exp, i) => (
                <div key={exp.id || i} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: `3px solid ${accentColor}40` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                    <h3 style={{ fontWeight: '600', fontSize: '12px', color: '#1f2937' }}>{exp.jobTitle}</h3>
                    <span style={{ fontSize: '10px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p style={{ color: accentColor, fontSize: '11px', marginBottom: '4px' }}>{exp.company}{exp.location && ` • ${exp.location}`}</p>
                  {exp.description && <p style={{ color: '#4b5563', lineHeight: '1.5' }}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '10px', paddingBottom: '4px', borderBottom: `2px solid ${accentColor}`, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '1.2' }}>
                {Icons.graduation(accentColor, 14)} Education
              </h2>
              {education.map((edu, i) => (
                <div key={edu.id || i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                    <h3 style={{ fontWeight: '600', fontSize: '12px', color: '#1f2937' }}>{edu.degree}</h3>
                    <span style={{ fontSize: '10px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p style={{ color: '#4b5563' }}>{edu.institution}</p>
                  {edu.grade && <p style={{ color: '#6b7280', fontSize: '10px' }}>Grade: {edu.grade}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Two column: Skills & Languages */}
          <div style={{ display: 'flex', gap: '24px' }}>
            {/* Skills */}
            {skills?.length > 0 && (
              <section style={{ flex: 1 }}>
                <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '10px', paddingBottom: '4px', borderBottom: `2px solid ${accentColor}`, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '1.2' }}>
                  {Icons.star(accentColor, 14)} Skills
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skills.map((skill, i) => (
                    <span key={skill.id || i} style={{ padding: '4px 10px', backgroundColor: accentColor + '15', color: accentColor, borderRadius: '12px', fontSize: '10px', border: `1px solid ${accentColor}30` }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages?.length > 0 && (
              <section style={{ flex: 1 }}>
                <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '10px', paddingBottom: '4px', borderBottom: `2px solid ${accentColor}`, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '1.2' }}>
                  {Icons.globe(accentColor, 14)} Languages
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {languages.map((lang, i) => (
                    <span key={lang.id || i} style={{ fontSize: '10px' }}>
                      <strong>{lang.name}</strong> <span style={{ color: '#6b7280' }}>({lang.proficiency})</span>
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Certifications */}
          {certifications?.length > 0 && (
            <section style={{ marginTop: '18px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '10px', paddingBottom: '4px', borderBottom: `2px solid ${accentColor}`, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '1.2' }}>
                {Icons.award(accentColor, 14)} Certifications
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {certifications.map((cert, i) => (
                  <div key={cert.id || i} style={{ fontSize: '10px' }}>
                    <strong>{cert.name}</strong> <span style={{ color: '#6b7280' }}>• {cert.issuer}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  };

  // CLASSIC SINGLE COLUMN TEMPLATE
  const ClassicSingleTemplate = () => {
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily: 'Georgia, Times New Roman, serif',
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1f2937',
        padding: '30px',
        ...textSafetyStyle
      }}>
        {/* Header - Centered Classic Style */}
        <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: `2px solid ${accentColor}` }}>
          {config.hasPhoto && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><Photo size={85} borderColor={accentColor} /></div>}
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: accentColor, marginBottom: '4px', letterSpacing: '1px' }}>
            {personalInfo?.fullName?.toUpperCase() || 'YOUR NAME'}
          </h1>
          {personalInfo?.jobTitle && <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>{personalInfo.jobTitle}</p>}
          
          {/* Contact Row with Icons - Fixed alignment */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '10px', color: '#4b5563', lineHeight: '1.4' }}>
            {personalInfo?.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>{Icons.email('#4b5563', 10)}<span>{personalInfo.email}</span></span>}
            {personalInfo?.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>{Icons.phone('#4b5563', 10)}<span>{personalInfo.phone}</span></span>}
            {(personalInfo?.city || personalInfo?.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>{Icons.location('#4b5563', 10)}<span>{[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')}</span></span>}
          </div>
          {(personalInfo?.linkedIn || personalInfo?.website) && (
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '10px', color: '#4b5563', marginTop: '6px', lineHeight: '1.4' }}>
              {personalInfo?.linkedIn && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>{Icons.linkedin('#4b5563', 10)}<span>{personalInfo.linkedIn}</span></span>}
              {personalInfo?.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>{Icons.website('#4b5563', 10)}<span>{personalInfo.website}</span></span>}
            </div>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>Summary</h2>
            <p style={{ textAlign: 'justify', color: '#374151', lineHeight: '1.7' }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', paddingBottom: '4px', borderBottom: `1px solid ${accentColor}40` }}>Professional Experience</h2>
            {experience.map((exp, i) => (
              <div key={exp.id || i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontWeight: '700', fontSize: '12px' }}>{exp.jobTitle}</h3>
                  <span style={{ fontSize: '10px', color: '#6b7280', fontStyle: 'italic' }}>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                </div>
                <p style={{ color: accentColor, fontSize: '11px', fontStyle: 'italic' }}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                {exp.description && <p style={{ color: '#4b5563', marginTop: '4px', lineHeight: '1.6' }}>{exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', paddingBottom: '4px', borderBottom: `1px solid ${accentColor}40` }}>Education</h2>
            {education.map((edu, i) => (
              <div key={edu.id || i} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontWeight: '700', fontSize: '11px' }}>{edu.degree}</h3>
                  <span style={{ fontSize: '10px', color: '#6b7280', fontStyle: 'italic' }}>{formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}</span>
                </div>
                <p style={{ color: '#4b5563', fontStyle: 'italic' }}>{edu.institution}</p>
              </div>
            ))}
          </section>
        )}

        {/* Skills & Languages in columns */}
        <div style={{ display: 'flex', gap: '30px' }}>
          {skills?.length > 0 && (
            <section style={{ flex: 1 }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>Skills</h2>
              <p style={{ textAlign: 'center', fontSize: '10px', color: '#4b5563' }}>{skills.map(s => s.name).join(' • ')}</p>
            </section>
          )}
          {languages?.length > 0 && (
            <section style={{ flex: 1 }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>Languages</h2>
              <p style={{ textAlign: 'center', fontSize: '10px', color: '#4b5563' }}>{languages.map(l => `${l.name} (${l.proficiency})`).join(' • ')}</p>
            </section>
          )}
        </div>
      </div>
    );
  };

  // MINIMAL SINGLE COLUMN TEMPLATE
  const MinimalSingleTemplate = () => {
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '11px',
        lineHeight: '1.6',
        color: '#1f2937',
        padding: '40px 50px',
        ...textSafetyStyle
      }}>
        {/* Header - Super Clean */}
        <div style={{ marginBottom: '24px', borderBottom: `1px solid ${accentColor}`, paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '300', color: accentColor, marginBottom: '4px', letterSpacing: '-0.5px' }}>
            {personalInfo?.fullName || 'Your Name'}
          </h1>
          {personalInfo?.jobTitle && <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{personalInfo.jobTitle}</p>}
          
          {/* Single line contact */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '10px', color: '#6b7280' }}>
            {personalInfo?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{Icons.email('#6b7280', 9)} {personalInfo.email}</span>}
            {personalInfo?.phone && <><span>|</span><span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{Icons.phone('#6b7280', 9)} {personalInfo.phone}</span></>}
            {(personalInfo?.city || personalInfo?.country) && <><span>|</span><span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{Icons.location('#6b7280', 9)} {[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')}</span></>}
            {personalInfo?.linkedIn && <><span>|</span><span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{Icons.linkedin('#6b7280', 9)} {personalInfo.linkedIn}</span></>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <section style={{ marginBottom: '20px' }}>
            <p style={{ color: '#374151', lineHeight: '1.7' }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '700', color: accentColor, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Experience</h2>
            {experience.map((exp, i) => (
              <div key={exp.id || i} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span><strong>{exp.jobTitle}</strong> — {exp.company}</span>
                  <span style={{ fontSize: '10px', color: '#9ca3af' }}>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                </div>
                {exp.description && <p style={{ color: '#6b7280', marginTop: '4px' }}>{exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '700', color: accentColor, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Education</h2>
            {education.map((edu, i) => (
              <div key={edu.id || i} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span><strong>{edu.degree}</strong> — {edu.institution}</span>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>{formatDate(edu.endDate) || 'Present'}</span>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <section style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '700', color: accentColor, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>Skills</h2>
            <p style={{ color: '#6b7280' }}>{skills.map(s => s.name).join(', ')}</p>
          </section>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <section>
            <h2 style={{ fontSize: '11px', fontWeight: '700', color: accentColor, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>Languages</h2>
            <p style={{ color: '#6b7280' }}>{languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}</p>
          </section>
        )}
      </div>
    );
  };

  // ELEGANT SINGLE COLUMN TEMPLATE
  const ElegantSingleTemplate = () => {
    const headerTextColor = isLightColor(accentColor) ? '#1f2937' : '#ffffff';
    
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily: 'Georgia, serif',
        fontSize: '11px',
        lineHeight: '1.6',
        color: '#1f2937',
        ...textSafetyStyle
      }}>
        {/* Elegant Header with Photo Circle */}
        <div style={{ position: 'relative', paddingTop: config.hasPhoto ? '60px' : '0' }}>
          {config.hasPhoto && (
            <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
              <Photo size={100} borderColor="#ffffff" />
            </div>
          )}
          <div style={{ backgroundColor: accentColor, padding: config.hasPhoto ? '70px 30px 24px' : '30px', textAlign: 'center', color: headerTextColor }}>
            <h1 style={{ fontSize: '26px', fontWeight: '400', letterSpacing: '3px', marginBottom: '4px' }}>
              {personalInfo?.fullName?.toUpperCase() || 'YOUR NAME'}
            </h1>
            {personalInfo?.jobTitle && <p style={{ fontSize: '13px', fontWeight: '300', letterSpacing: '1px', opacity: '0.9' }}>{personalInfo.jobTitle}</p>}
          </div>
        </div>

        {/* Contact Bar */}
        <div style={{ backgroundColor: '#f9fafb', padding: '12px 30px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '10px', color: '#4b5563', borderBottom: `1px solid ${accentColor}20` }}>
          {personalInfo?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.email(accentColor, 10)} {personalInfo.email}</span>}
          {personalInfo?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.phone(accentColor, 10)} {personalInfo.phone}</span>}
          {(personalInfo?.city || personalInfo?.country) && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.location(accentColor, 10)} {[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')}</span>}
          {personalInfo?.linkedIn && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.linkedin(accentColor, 10)} {personalInfo.linkedIn}</span>}
        </div>

        {/* Content */}
        <div style={{ padding: '24px 30px' }}>
          {summary && (
            <section style={{ marginBottom: '20px', textAlign: 'center' }}>
              <p style={{ color: '#4b5563', fontStyle: 'italic', lineHeight: '1.8', maxWidth: '480px', margin: '0 auto' }}>"{summary}"</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '400', color: accentColor, textAlign: 'center', marginBottom: '14px', letterSpacing: '3px', textTransform: 'uppercase' }}>— Experience —</h2>
              {experience.map((exp, i) => (
                <div key={exp.id || i} style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: i < experience.length - 1 ? `1px solid ${accentColor}20` : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontWeight: '600', fontSize: '12px', color: '#1f2937' }}>{exp.jobTitle}</h3>
                    <span style={{ fontSize: '10px', color: '#9ca3af', fontStyle: 'italic' }}>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  <p style={{ color: accentColor, fontSize: '11px' }}>{exp.company}</p>
                  {exp.description && <p style={{ color: '#6b7280', marginTop: '6px' }}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {education?.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '400', color: accentColor, textAlign: 'center', marginBottom: '14px', letterSpacing: '3px', textTransform: 'uppercase' }}>— Education —</h2>
              {education.map((edu, i) => (
                <div key={edu.id || i} style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontWeight: '600', fontSize: '11px' }}>{edu.degree}</h3>
                  <p style={{ color: '#6b7280', fontSize: '10px' }}>{edu.institution} • {formatDate(edu.endDate) || 'Present'}</p>
                </div>
              ))}
            </section>
          )}

          <div style={{ display: 'flex', gap: '30px' }}>
            {skills?.length > 0 && (
              <section style={{ flex: 1 }}>
                <h2 style={{ fontSize: '12px', fontWeight: '400', color: accentColor, textAlign: 'center', marginBottom: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>— Skills —</h2>
                <p style={{ textAlign: 'center', fontSize: '10px', color: '#6b7280' }}>{skills.map(s => s.name).join(' • ')}</p>
              </section>
            )}
            {languages?.length > 0 && (
              <section style={{ flex: 1 }}>
                <h2 style={{ fontSize: '12px', fontWeight: '400', color: accentColor, textAlign: 'center', marginBottom: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>— Languages —</h2>
                <p style={{ textAlign: 'center', fontSize: '10px', color: '#6b7280' }}>{languages.map(l => l.name).join(' • ')}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  };

  // TECH SINGLE COLUMN TEMPLATE
  const TechSingleTemplate = () => {
    const headerTextColor = '#ffffff';
    
    return (
      <div style={{ 
        backgroundColor: '#0f172a', 
        width: '595px', 
        minHeight: '842px',
        fontFamily: 'Consolas, Monaco, monospace',
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#e2e8f0',
        ...textSafetyStyle
      }}>
        {/* Terminal-style Header */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px 24px', borderBottom: `3px solid ${accentColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Photo size={80} borderColor={accentColor} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: accentColor }}>$</span>
                <h1 style={{ fontSize: '22px', fontWeight: '700', color: headerTextColor }}>{personalInfo?.fullName || 'Your Name'}</h1>
              </div>
              {personalInfo?.jobTitle && <p style={{ fontSize: '13px', color: accentColor, marginBottom: '10px' }}>{'// '}{personalInfo.jobTitle}</p>}
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '10px', color: '#94a3b8' }}>
                {personalInfo?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.email(accentColor, 10)} {personalInfo.email}</span>}
                {personalInfo?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.phone(accentColor, 10)} {personalInfo.phone}</span>}
                {personalInfo?.linkedIn && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.linkedin(accentColor, 10)} {personalInfo.linkedIn}</span>}
                {personalInfo?.website && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.website(accentColor, 10)} {personalInfo.website}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          {summary && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: accentColor, fontSize: '12px', marginBottom: '8px' }}>{'/* About Me */'}</h2>
              <p style={{ color: '#cbd5e1', lineHeight: '1.7' }}>{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: accentColor, fontSize: '12px', marginBottom: '12px' }}>{'/* Experience */'}</h2>
              {experience.map((exp, i) => (
                <div key={exp.id || i} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: `2px solid ${accentColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span><span style={{ color: '#f472b6' }}>function</span> <span style={{ color: '#fbbf24' }}>{exp.jobTitle.replace(/\s+/g, '_')}</span>()</span>
                    <span style={{ color: '#64748b', fontSize: '10px' }}>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '10px' }}>@ {exp.company}</p>
                  {exp.description && <p style={{ color: '#64748b', marginTop: '4px' }}>{'// '}{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {education?.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: accentColor, fontSize: '12px', marginBottom: '12px' }}>{'/* Education */'}</h2>
              {education.map((edu, i) => (
                <div key={edu.id || i} style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#a78bfa' }}>import</span> <span style={{ color: '#fbbf24' }}>"{edu.degree}"</span> <span style={{ color: '#a78bfa' }}>from</span> <span style={{ color: '#34d399' }}>"{edu.institution}"</span>
                  <span style={{ color: '#64748b', marginLeft: '8px', fontSize: '10px' }}>{'// '}{formatDate(edu.endDate) || 'Present'}</span>
                </div>
              ))}
            </section>
          )}

          {skills?.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: accentColor, fontSize: '12px', marginBottom: '10px' }}>{'/* Tech Stack */'}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.map((skill, i) => (
                  <span key={skill.id || i} style={{ padding: '4px 10px', backgroundColor: accentColor + '30', color: accentColor, borderRadius: '4px', fontSize: '10px', border: `1px solid ${accentColor}` }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {languages?.length > 0 && (
            <section>
              <h2 style={{ color: accentColor, fontSize: '12px', marginBottom: '10px' }}>{'/* Languages */'}</h2>
              <p style={{ color: '#94a3b8', fontSize: '10px' }}>[{languages.map(l => `"${l.name}"`).join(', ')}]</p>
            </section>
          )}
        </div>
      </div>
    );
  };

  // ACADEMIC SINGLE COLUMN TEMPLATE
  const AcademicSingleTemplate = () => {
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily: 'Times New Roman, serif',
        fontSize: '11px',
        lineHeight: '1.6',
        color: '#1f2937',
        padding: '30px 40px',
        ...textSafetyStyle
      }}>
        {/* Academic Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: `3px double ${accentColor}` }}>
          {config.hasPhoto && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}><Photo size={75} borderColor={accentColor} /></div>}
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: accentColor, marginBottom: '2px' }}>{personalInfo?.fullName || 'Your Name'}</h1>
          {personalInfo?.jobTitle && <p style={{ fontSize: '14px', color: '#4b5563', fontStyle: 'italic' }}>{personalInfo.jobTitle}</p>}
          
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '10px', color: '#4b5563', marginTop: '10px' }}>
            {personalInfo?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{Icons.email(accentColor, 9)} {personalInfo.email}</span>}
            {personalInfo?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{Icons.phone(accentColor, 9)} {personalInfo.phone}</span>}
            {(personalInfo?.city || personalInfo?.country) && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{Icons.location(accentColor, 9)} {[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')}</span>}
          </div>
        </div>

        {summary && (
          <section style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '6px', textTransform: 'uppercase' }}>Research Interests / Summary</h2>
            <p style={{ textAlign: 'justify', lineHeight: '1.7' }}>{summary}</p>
          </section>
        )}

        {education?.length > 0 && (
          <section style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '10px', textTransform: 'uppercase', borderBottom: `1px solid ${accentColor}`, paddingBottom: '2px' }}>Education</h2>
            {education.map((edu, i) => (
              <div key={edu.id || i} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{edu.degree}</strong>
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>{formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}</span>
                </div>
                <p style={{ color: '#4b5563' }}>{edu.institution}</p>
                {edu.grade && <p style={{ fontSize: '10px', color: '#6b7280' }}>Grade/GPA: {edu.grade}</p>}
              </div>
            ))}
          </section>
        )}

        {experience?.length > 0 && (
          <section style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '10px', textTransform: 'uppercase', borderBottom: `1px solid ${accentColor}`, paddingBottom: '2px' }}>Professional Experience</h2>
            {experience.map((exp, i) => (
              <div key={exp.id || i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{exp.jobTitle}</strong>
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                </div>
                <p style={{ color: '#4b5563', fontStyle: 'italic' }}>{exp.company}</p>
                {exp.description && <p style={{ marginTop: '4px', textAlign: 'justify' }}>{exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        <div style={{ display: 'flex', gap: '24px' }}>
          {skills?.length > 0 && (
            <section style={{ flex: 1 }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '6px', textTransform: 'uppercase' }}>Skills</h2>
              <p style={{ fontSize: '10px' }}>{skills.map(s => s.name).join(', ')}</p>
            </section>
          )}
          {languages?.length > 0 && (
            <section style={{ flex: 1 }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '6px', textTransform: 'uppercase' }}>Languages</h2>
              <p style={{ fontSize: '10px' }}>{languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}</p>
            </section>
          )}
        </div>

        {certifications?.length > 0 && (
          <section style={{ marginTop: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '6px', textTransform: 'uppercase' }}>Certifications & Awards</h2>
            {certifications.map((cert, i) => (
              <p key={cert.id || i} style={{ fontSize: '10px', marginBottom: '2px' }}>• {cert.name} — {cert.issuer} ({cert.year})</p>
            ))}
          </section>
        )}
      </div>
    );
  };

  // ENGINEER SINGLE TEMPLATE
  const EngineerSingleTemplate = () => {
    const headerTextColor = isLightColor(accentColor) ? '#1f2937' : '#ffffff';
    
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1f2937',
        ...textSafetyStyle
      }}>
        {/* Angled Header */}
        <div style={{ backgroundColor: accentColor, padding: '24px', color: headerTextColor, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Photo size={85} borderColor={headerTextColor} />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>{personalInfo?.fullName || 'Your Name'}</h1>
              {personalInfo?.jobTitle && <p style={{ fontSize: '14px', opacity: '0.9', marginBottom: '8px' }}>{personalInfo.jobTitle}</p>}
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '10px' }}>
                {personalInfo?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '3px' }}>{Icons.email(headerTextColor, 10)} {personalInfo.email}</span>}
                {personalInfo?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '3px' }}>{Icons.phone(headerTextColor, 10)} {personalInfo.phone}</span>}
              </div>
              {(personalInfo?.city || personalInfo?.linkedIn) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '10px', marginTop: '6px' }}>
                  {(personalInfo?.city || personalInfo?.country) && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '3px' }}>{Icons.location(headerTextColor, 10)} {[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')}</span>}
                  {personalInfo?.linkedIn && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '3px' }}>{Icons.linkedin(headerTextColor, 10)} {personalInfo.linkedIn}</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {summary && (
            <section style={{ marginBottom: '18px', padding: '12px', backgroundColor: '#f8fafc', borderLeft: `4px solid ${accentColor}`, borderRadius: '0 4px 4px 0' }}>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#1f2937', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '24px', height: '24px', backgroundColor: accentColor, color: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.briefcase('#fff', 12)}</span>
                WORK EXPERIENCE
              </h2>
              {experience.map((exp, i) => (
                <div key={exp.id || i} style={{ marginBottom: '14px', paddingLeft: '32px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '10px', top: '0', width: '2px', height: '100%', backgroundColor: accentColor + '40' }}></div>
                  <div style={{ position: 'absolute', left: '6px', top: '4px', width: '10px', height: '10px', backgroundColor: accentColor, borderRadius: '50%' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontWeight: '600', fontSize: '12px' }}>{exp.jobTitle}</h3>
                    <span style={{ fontSize: '10px', color: '#6b7280', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' }}>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  <p style={{ color: accentColor, fontSize: '11px' }}>{exp.company}</p>
                  {exp.description && <p style={{ color: '#6b7280', marginTop: '4px' }}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {education?.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#1f2937', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '24px', height: '24px', backgroundColor: accentColor, color: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.graduation('#fff', 12)}</span>
                EDUCATION
              </h2>
              {education.map((edu, i) => (
                <div key={edu.id || i} style={{ marginBottom: '10px', paddingLeft: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontWeight: '600', fontSize: '11px' }}>{edu.degree}</h3>
                    <span style={{ fontSize: '10px', color: '#6b7280' }}>{formatDate(edu.endDate) || 'Present'}</span>
                  </div>
                  <p style={{ color: '#6b7280' }}>{edu.institution}</p>
                </div>
              ))}
            </section>
          )}

          <div style={{ display: 'flex', gap: '20px' }}>
            {skills?.length > 0 && (
              <section style={{ flex: 1 }}>
                <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#1f2937', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '24px', height: '24px', backgroundColor: accentColor, color: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.star('#fff', 12)}</span>
                  SKILLS
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {skills.map((skill, i) => (
                    <span key={skill.id || i} style={{ padding: '3px 8px', backgroundColor: '#f1f5f9', color: '#374151', borderRadius: '3px', fontSize: '10px' }}>{skill.name}</span>
                  ))}
                </div>
              </section>
            )}
            {languages?.length > 0 && (
              <section style={{ flex: 1 }}>
                <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#1f2937', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '24px', height: '24px', backgroundColor: accentColor, color: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.globe('#fff', 12)}</span>
                  LANGUAGES
                </h2>
                {languages.map((lang, i) => (
                  <p key={lang.id || i} style={{ fontSize: '10px', marginBottom: '2px' }}><strong>{lang.name}</strong> — {lang.proficiency}</p>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    );
  };

  // CREATIVE SIDEBAR TEMPLATE (Two Column - Left Sidebar)
  const CreativeSidebarTemplate = () => {
    const sidebarTextColor = isLightColor(accentColor) ? '#1f2937' : '#ffffff';
    
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily,
        fontSize: '11px',
        lineHeight: '1.5',
        display: 'flex',
        ...textSafetyStyle
      }}>
        {/* Sidebar */}
        <div style={{ width: '200px', backgroundColor: accentColor, color: sidebarTextColor, padding: '24px 16px', flexShrink: 0 }}>
          {/* Photo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Photo size={110} borderColor={sidebarTextColor} />
          </div>
          
          <h1 style={{ fontSize: '18px', fontWeight: '700', textAlign: 'center', marginBottom: '4px' }}>{personalInfo?.fullName || 'Your Name'}</h1>
          {personalInfo?.jobTitle && <p style={{ fontSize: '11px', textAlign: 'center', opacity: '0.9', marginBottom: '16px' }}>{personalInfo.jobTitle}</p>}
          
          {/* Contact */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', opacity: '0.8' }}>Contact</h3>
            <ContactItem icon={Icons.email(sidebarTextColor, 10)} text={personalInfo?.email} color={sidebarTextColor} />
            <ContactItem icon={Icons.phone(sidebarTextColor, 10)} text={personalInfo?.phone} color={sidebarTextColor} />
            <ContactItem icon={Icons.location(sidebarTextColor, 10)} text={[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')} color={sidebarTextColor} />
            <ContactItem icon={Icons.linkedin(sidebarTextColor, 10)} text={personalInfo?.linkedIn} color={sidebarTextColor} />
            <ContactItem icon={Icons.website(sidebarTextColor, 10)} text={personalInfo?.website} color={sidebarTextColor} />
          </div>

          {/* Skills */}
          {skills?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', opacity: '0.8' }}>Skills</h3>
              {skills.map((skill, i) => (
                <div key={skill.id || i} style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: '10px', marginBottom: '2px' }}>{skill.name}</div>
                  <div style={{ width: '100%', backgroundColor: isLightColor(accentColor) ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)', borderRadius: '10px', height: '4px' }}>
                    <div style={{ backgroundColor: sidebarTextColor, borderRadius: '10px', height: '4px', width: skill.level === 'expert' ? '100%' : skill.level === 'advanced' ? '80%' : skill.level === 'intermediate' ? '60%' : '40%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', opacity: '0.8' }}>Languages</h3>
              {languages.map((lang, i) => (
                <div key={lang.id || i} style={{ fontSize: '10px', marginBottom: '3px' }}>{lang.name} <span style={{ opacity: '0.7' }}>({lang.proficiency})</span></div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '24px', color: '#1f2937' }}>
          {summary && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>About Me</h2>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Experience</h2>
              {experience.map((exp, i) => (
                <div key={exp.id || i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontWeight: '600', fontSize: '11px' }}>{exp.jobTitle}</h3>
                    <span style={{ fontSize: '9px', color: '#6b7280' }}>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  <p style={{ color: accentColor, fontSize: '10px' }}>{exp.company}</p>
                  {exp.description && <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '10px' }}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {education?.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Education</h2>
              {education.map((edu, i) => (
                <div key={edu.id || i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontWeight: '600', fontSize: '11px' }}>{edu.degree}</h3>
                    <span style={{ fontSize: '9px', color: '#6b7280' }}>{formatDate(edu.endDate) || 'Present'}</span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '10px' }}>{edu.institution}</p>
                </div>
              ))}
            </section>
          )}

          {certifications?.length > 0 && (
            <section>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certifications</h2>
              {certifications.map((cert, i) => (
                <div key={cert.id || i} style={{ fontSize: '10px', marginBottom: '4px' }}>
                  <strong>{cert.name}</strong> — {cert.issuer}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    );
  };

  // EXECUTIVE SIDEBAR TEMPLATE
  const ExecutiveSidebarTemplate = () => {
    const sidebarTextColor = '#ffffff';
    
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily,
        fontSize: '11px',
        lineHeight: '1.5',
        display: 'flex',
        ...textSafetyStyle
      }}>
        {/* Dark Sidebar */}
        <div style={{ width: '210px', backgroundColor: '#1e293b', color: sidebarTextColor, padding: '0', flexShrink: 0 }}>
          {/* Photo & Name Header */}
          <div style={{ backgroundColor: accentColor, padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <Photo size={100} borderColor="#ffffff" />
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{personalInfo?.fullName || 'Your Name'}</h1>
            {personalInfo?.jobTitle && <p style={{ fontSize: '11px', opacity: '0.9' }}>{personalInfo.jobTitle}</p>}
          </div>
          
          <div style={{ padding: '20px 16px' }}>
            {/* Contact */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: accentColor }}>Contact</h3>
              <ContactItem icon={Icons.email('#94a3b8', 10)} text={personalInfo?.email} color="#cbd5e1" />
              <ContactItem icon={Icons.phone('#94a3b8', 10)} text={personalInfo?.phone} color="#cbd5e1" />
              <ContactItem icon={Icons.location('#94a3b8', 10)} text={[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')} color="#cbd5e1" />
              <ContactItem icon={Icons.linkedin('#94a3b8', 10)} text={personalInfo?.linkedIn} color="#cbd5e1" />
            </div>

            {/* Skills */}
            {skills?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: accentColor }}>Expertise</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {skills.map((skill, i) => (
                    <span key={skill.id || i} style={{ padding: '3px 8px', backgroundColor: '#334155', color: '#e2e8f0', borderRadius: '3px', fontSize: '9px' }}>{skill.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: accentColor }}>Languages</h3>
                {languages.map((lang, i) => (
                  <div key={lang.id || i} style={{ fontSize: '10px', color: '#cbd5e1', marginBottom: '3px' }}>{lang.name} <span style={{ color: '#94a3b8' }}>({lang.proficiency})</span></div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '24px', color: '#1f2937' }}>
          {summary && (
            <section style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${accentColor}30` }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Executive Summary</h2>
              <p style={{ color: '#374151', lineHeight: '1.7' }}>{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Professional Experience</h2>
              {experience.map((exp, i) => (
                <div key={exp.id || i} style={{ marginBottom: '14px', paddingLeft: '12px', borderLeft: `3px solid ${accentColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontWeight: '700', fontSize: '12px', color: '#0f172a' }}>{exp.jobTitle}</h3>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  <p style={{ color: accentColor, fontSize: '11px', fontWeight: '500' }}>{exp.company}</p>
                  {exp.description && <p style={{ color: '#64748b', marginTop: '6px', lineHeight: '1.5' }}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {education?.length > 0 && (
            <section>
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Education</h2>
              {education.map((edu, i) => (
                <div key={edu.id || i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontWeight: '600', fontSize: '11px' }}>{edu.degree}</h3>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{formatDate(edu.endDate) || 'Present'}</span>
                  </div>
                  <p style={{ color: '#64748b' }}>{edu.institution}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    );
  };

  // COMPACT RIGHT SIDEBAR TEMPLATE
  const CompactRightTemplate = () => {
    const headerTextColor = isLightColor(accentColor) ? '#1f2937' : '#ffffff';
    
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily,
        fontSize: '11px',
        lineHeight: '1.5',
        ...textSafetyStyle
      }}>
        {/* Header */}
        <div style={{ backgroundColor: accentColor, padding: '20px 24px', color: headerTextColor }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {config.hasPhoto && <Photo size={70} borderColor={headerTextColor} />}
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '2px' }}>{personalInfo?.fullName || 'Your Name'}</h1>
              {personalInfo?.jobTitle && <p style={{ fontSize: '12px', opacity: '0.9' }}>{personalInfo.jobTitle}</p>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          {/* Main Content */}
          <div style={{ flex: 1, padding: '20px 24px', color: '#1f2937' }}>
            {summary && (
              <section style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '11px', fontWeight: '700', color: accentColor, marginBottom: '6px', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: `2px solid ${accentColor}` }}>Summary</h2>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>{summary}</p>
              </section>
            )}

            {experience?.length > 0 && (
              <section style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '11px', fontWeight: '700', color: accentColor, marginBottom: '10px', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: `2px solid ${accentColor}` }}>Experience</h2>
                {experience.map((exp, i) => (
                  <div key={exp.id || i} style={{ marginBottom: '12px', position: 'relative', paddingLeft: '12px', borderLeft: `2px solid ${accentColor}40` }}>
                    <div style={{ position: 'absolute', left: '-5px', top: '2px', width: '8px', height: '8px', backgroundColor: accentColor, borderRadius: '50%' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontWeight: '600', fontSize: '11px' }}>{exp.jobTitle}</h3>
                      <span style={{ fontSize: '9px', color: '#6b7280' }}>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                    </div>
                    <p style={{ color: accentColor, fontSize: '10px' }}>{exp.company}</p>
                    {exp.description && <p style={{ color: '#6b7280', marginTop: '3px', fontSize: '10px' }}>{exp.description}</p>}
                  </div>
                ))}
              </section>
            )}

            {education?.length > 0 && (
              <section>
                <h2 style={{ fontSize: '11px', fontWeight: '700', color: accentColor, marginBottom: '10px', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: `2px solid ${accentColor}` }}>Education</h2>
                {education.map((edu, i) => (
                  <div key={edu.id || i} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontWeight: '600', fontSize: '11px' }}>{edu.degree}</h3>
                      <span style={{ fontSize: '9px', color: '#6b7280' }}>{formatDate(edu.endDate) || 'Present'}</span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '10px' }}>{edu.institution}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div style={{ width: '180px', backgroundColor: '#f8fafc', padding: '20px 16px', borderLeft: `1px solid ${accentColor}20`, flexShrink: 0 }}>
            {/* Contact */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '10px', fontWeight: '700', color: accentColor, textTransform: 'uppercase', marginBottom: '8px' }}>Contact</h3>
              <div style={{ fontSize: '9px', color: '#4b5563' }}>
                {personalInfo?.email && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '4px' }}>{Icons.email(accentColor, 9)} <span style={{ wordBreak: 'break-all' }}>{personalInfo.email}</span></div>}
                {personalInfo?.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>{Icons.phone(accentColor, 9)} {personalInfo.phone}</div>}
                {(personalInfo?.city || personalInfo?.country) && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>{Icons.location(accentColor, 9)} {[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')}</div>}
                {personalInfo?.linkedIn && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>{Icons.linkedin(accentColor, 9)} <span style={{ wordBreak: 'break-all' }}>{personalInfo.linkedIn}</span></div>}
              </div>
            </div>

            {/* Skills */}
            {skills?.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: '700', color: accentColor, textTransform: 'uppercase', marginBottom: '8px' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {skills.map((skill, i) => (
                    <span key={skill.id || i} style={{ padding: '2px 6px', backgroundColor: accentColor + '15', color: accentColor, borderRadius: '3px', fontSize: '9px' }}>{skill.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '10px', fontWeight: '700', color: accentColor, textTransform: 'uppercase', marginBottom: '8px' }}>Languages</h3>
                {languages.map((lang, i) => (
                  <div key={lang.id || i} style={{ fontSize: '9px', color: '#4b5563', marginBottom: '2px' }}>{lang.name} <span style={{ color: '#9ca3af' }}>({lang.proficiency})</span></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // TIMELINE TEMPLATE
  const TimelineTemplate = () => {
    const headerTextColor = isLightColor(accentColor) ? '#1f2937' : '#ffffff';
    
    return (
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily,
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1f2937',
        ...textSafetyStyle
      }}>
        {/* Header */}
        <div style={{ backgroundColor: accentColor, padding: '24px', color: headerTextColor }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Photo size={90} borderColor={headerTextColor} />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>{personalInfo?.fullName || 'Your Name'}</h1>
              {personalInfo?.jobTitle && <p style={{ fontSize: '14px', opacity: '0.9', marginBottom: '10px' }}>{personalInfo.jobTitle}</p>}
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '10px' }}>
                {personalInfo?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.email(headerTextColor, 10)} {personalInfo.email}</span>}
                {personalInfo?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.phone(headerTextColor, 10)} {personalInfo.phone}</span>}
                {(personalInfo?.city || personalInfo?.country) && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{Icons.location(headerTextColor, 10)} {[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')}</span>}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {summary && (
            <section style={{ marginBottom: '18px', padding: '12px', backgroundColor: accentColor + '10', borderRadius: '8px' }}>
              <p style={{ color: '#374151', lineHeight: '1.6', fontStyle: 'italic' }}>{summary}</p>
            </section>
          )}

          {/* Timeline Experience */}
          {experience?.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '14px' }}>Career Timeline</h2>
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                <div style={{ position: 'absolute', left: '8px', top: '0', bottom: '0', width: '2px', backgroundColor: accentColor + '30' }}></div>
                {experience.map((exp, i) => (
                  <div key={exp.id || i} style={{ marginBottom: '16px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-20px', top: '2px', width: '14px', height: '14px', backgroundColor: accentColor, borderRadius: '50%', border: '3px solid #ffffff', boxShadow: `0 0 0 2px ${accentColor}30` }}></div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: `3px solid ${accentColor}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <h3 style={{ fontWeight: '700', fontSize: '12px', color: '#1f2937' }}>{exp.jobTitle}</h3>
                        <span style={{ fontSize: '10px', color: '#6b7280', backgroundColor: '#e5e7eb', padding: '2px 8px', borderRadius: '10px' }}>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                      </div>
                      <p style={{ color: accentColor, fontSize: '11px', fontWeight: '500' }}>{exp.company}</p>
                      {exp.description && <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '10px' }}>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education & Skills in columns */}
          <div style={{ display: 'flex', gap: '20px' }}>
            {education?.length > 0 && (
              <section style={{ flex: 1 }}>
                <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '10px' }}>Education</h2>
                {education.map((edu, i) => (
                  <div key={edu.id || i} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                    <h3 style={{ fontWeight: '600', fontSize: '11px' }}>{edu.degree}</h3>
                    <p style={{ color: '#6b7280', fontSize: '10px' }}>{edu.institution}</p>
                  </div>
                ))}
              </section>
            )}

            <div style={{ flex: 1 }}>
              {skills?.length > 0 && (
                <section style={{ marginBottom: '14px' }}>
                  <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '8px' }}>Skills</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {skills.map((skill, i) => (
                      <span key={skill.id || i} style={{ padding: '4px 10px', backgroundColor: accentColor + '15', color: accentColor, borderRadius: '15px', fontSize: '10px' }}>{skill.name}</span>
                    ))}
                  </div>
                </section>
              )}

              {languages?.length > 0 && (
                <section>
                  <h2 style={{ fontSize: '13px', fontWeight: '700', color: accentColor, marginBottom: '8px' }}>Languages</h2>
                  <p style={{ fontSize: '10px', color: '#6b7280' }}>{languages.map(l => `${l.name} (${l.proficiency})`).join(' • ')}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // INFOGRAPHIC TEMPLATE
  const InfographicTemplate = () => {
    const headerTextColor = '#ffffff';
    
    return (
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        width: '595px', 
        minHeight: '842px',
        fontFamily,
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#1f2937',
        ...textSafetyStyle
      }}>
        {/* Header with Photo */}
        <div style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`, padding: '24px', color: headerTextColor, display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Photo size={100} borderColor={headerTextColor} />
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>{personalInfo?.fullName || 'Your Name'}</h1>
            {personalInfo?.jobTitle && <p style={{ fontSize: '14px', opacity: '0.9' }}>{personalInfo.jobTitle}</p>}
          </div>
        </div>

        {/* Contact Icons Bar */}
        <div style={{ backgroundColor: '#1e293b', padding: '12px 24px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '8px' }}>
          {personalInfo?.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '10px' }}>
              <div style={{ width: '28px', height: '28px', backgroundColor: accentColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.email('#fff', 12)}</div>
              {personalInfo.email}
            </div>
          )}
          {personalInfo?.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '10px' }}>
              <div style={{ width: '28px', height: '28px', backgroundColor: accentColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.phone('#fff', 12)}</div>
              {personalInfo.phone}
            </div>
          )}
          {(personalInfo?.city || personalInfo?.country) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '10px' }}>
              <div style={{ width: '28px', height: '28px', backgroundColor: accentColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icons.location('#fff', 12)}</div>
              {[personalInfo?.city, personalInfo?.country].filter(Boolean).join(', ')}
            </div>
          )}
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* Summary Card */}
          {summary && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '8px' }}>ABOUT ME</h2>
              <p style={{ color: '#4b5563', lineHeight: '1.7' }}>{summary}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px' }}>
            {/* Left Column */}
            <div style={{ flex: 1 }}>
              {/* Experience */}
              {experience?.length > 0 && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '12px' }}>EXPERIENCE</h2>
                  {experience.map((exp, i) => (
                    <div key={exp.id || i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: i < experience.length - 1 ? '1px dashed #e5e7eb' : 'none' }}>
                      <h3 style={{ fontWeight: '700', fontSize: '11px', color: '#1f2937' }}>{exp.jobTitle}</h3>
                      <p style={{ color: accentColor, fontSize: '10px' }}>{exp.company} • {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                      {exp.description && <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '10px' }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {education?.length > 0 && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '12px' }}>EDUCATION</h2>
                  {education.map((edu, i) => (
                    <div key={edu.id || i} style={{ marginBottom: '8px' }}>
                      <h3 style={{ fontWeight: '600', fontSize: '11px' }}>{edu.degree}</h3>
                      <p style={{ color: '#6b7280', fontSize: '10px' }}>{edu.institution}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div style={{ width: '180px' }}>
              {/* Skills */}
              {skills?.length > 0 && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '10px' }}>SKILLS</h2>
                  {skills.map((skill, i) => (
                    <div key={skill.id || i} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
                        <span>{skill.name}</span>
                      </div>
                      <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '10px', height: '6px' }}>
                        <div style={{ backgroundColor: accentColor, borderRadius: '10px', height: '6px', width: skill.level === 'expert' ? '100%' : skill.level === 'advanced' ? '85%' : skill.level === 'intermediate' ? '65%' : '45%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Languages */}
              {languages?.length > 0 && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '12px', fontWeight: '700', color: accentColor, marginBottom: '10px' }}>LANGUAGES</h2>
                  {languages.map((lang, i) => (
                    <div key={lang.id || i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: accentColor, borderRadius: '50%' }}></div>
                      <span style={{ fontSize: '10px' }}>{lang.name} <span style={{ color: '#9ca3af' }}>({lang.proficiency})</span></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderTemplate();
};

export default CVPreview;
