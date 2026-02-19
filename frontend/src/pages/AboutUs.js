import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const team = [
    {
      name: 'Sahan Nawarathne',
      role: 'Founder & CEO',
      roles: ['Founder', 'CEO', 'Lead Developer', 'Lead Designer'],
      image: 'https://f005.backblazeb2.com/file/movia-prod/users/aboutus/459005242_122100061838519907_2627003881630151942_n.jpg',
      description: 'Visionary entrepreneur and full-stack developer passionate about empowering job seekers worldwide.',
      bio: 'With a deep understanding of both technology and design, Sahan built Ezy CV from the ground up to make professional CV creation accessible to everyone.',
      linkedin: 'https://www.linkedin.com/in/sahan-nawarathne-210b562ab/',
      github: 'https://github.com/sahanvin2'
    }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Mission-Driven',
      description: 'We believe everyone deserves a professional CV that showcases their potential.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Constantly improving our tools to provide the best user experience.'
    },
    {
      icon: '🤝',
      title: 'User First',
      description: 'Every decision we make puts our users\' needs at the forefront.'
    },
    {
      icon: '🌍',
      title: 'Accessibility',
      description: 'Making professional CV creation free and accessible to everyone worldwide.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Ezy CV</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              We're on a mission to help millions of job seekers create professional CVs 
              that open doors to their dream careers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for Job Seekers, by Job Seekers
              </h2>
              <p className="text-gray-600 mb-4">
                Ezy CV was born from a simple frustration: creating a professional CV shouldn't 
                be complicated or expensive. Our founder experienced this firsthand while job hunting 
                and decided to build a solution.
              </p>
              <p className="text-gray-600 mb-6">
                Since our launch, we've helped over 100 people create stunning CVs that have 
                landed them interviews at top companies worldwide. We're just getting started.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">50K+</div>
                  <div className="text-gray-600">CVs Created</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">150+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">4.9★</div>
                  <div className="text-gray-600">User Rating</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
                alt="Team working"
                className="relative rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              These core principles guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Enhanced Single Founder */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                Meet the Founder
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">The Mind Behind Ezy CV</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                One person's vision to revolutionize how people create professional CVs
              </p>
            </motion.div>
          </div>
          
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
                <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
                  {/* Profile Image */}
                  <div className="md:col-span-2">
                    <div className="relative group">
                      {/* Glow Effect */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 blur-2xl transition-opacity"></div>
                      
                      {/* Main Image */}
                      <div className="relative">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full aspect-square rounded-2xl object-cover shadow-2xl border-4 border-white/30"
                        />
                        {/* Badge */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-xl border-2 border-white/50">
                          <span className="text-white font-bold text-sm whitespace-nowrap">🚀 Founder & CEO</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="md:col-span-3 text-center md:text-left mt-8 md:mt-0">
                    <h3 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                      {member.name}
                    </h3>
                    
                    {/* Multiple Roles */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                      {member.roles.map((role, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/30"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-lg text-white/90 mb-4 leading-relaxed">
                      {member.description}
                    </p>
                    
                    <p className="text-white/70 mb-6 leading-relaxed">
                      {member.bio}
                    </p>
                    
                    {/* Social Links */}
                    <div className="flex gap-3 justify-center md:justify-start">
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/10 hover:bg-blue-600 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors border border-white/20"
                        title="LinkedIn"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </motion.a>
                      
                      <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/10 hover:bg-gray-700 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors border border-white/20"
                        title="GitHub"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </motion.a>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">5+</div>
                        <div className="text-xs text-white/60">Years Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">100+</div>
                        <div className="text-xs text-white/60">Users Helped</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">10+</div>
                        <div className="text-xs text-white/60">Templates Created</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your CV?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of successful job seekers who've used Ezy CV
          </p>
          <Link
            to="/cv-builder"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Building Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
