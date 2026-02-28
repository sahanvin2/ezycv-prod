'use client';

import Link from 'next/link';

export default function CVBuilderClient() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Free CV Builder</h1>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Create your professional CV with our easy-to-use builder. Choose from 10+ templates and download as PDF.
        </p>
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <p className="text-gray-500 mb-6">CV Builder interface — full interactive builder coming soon.</p>
          <Link href="/cv-templates" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            Browse Templates
          </Link>
        </div>
      </div>
    </div>
  );
}
