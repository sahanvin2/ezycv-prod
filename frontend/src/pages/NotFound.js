import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileText, LayoutTemplate, ImageIcon, Camera } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>

            <Link
              to="/cv-builder"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200"
            >
              <FileText className="w-5 h-5 mr-2" />
              Create CV
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link
              to="/cv-templates"
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-blue-600 mb-2">
                <LayoutTemplate className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm font-medium text-gray-900">CV Templates</p>
            </Link>

            <Link
              to="/wallpapers"
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-pink-600 mb-2">
                <ImageIcon className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm font-medium text-gray-900">Wallpapers</p>
            </Link>

            <Link
              to="/stock-photos"
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-green-600 mb-2">
                <Camera className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm font-medium text-gray-900">Stock Photos</p>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
