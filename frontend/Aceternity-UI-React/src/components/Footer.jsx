import React from 'react';
import { FileText } from 'lucide-react'; 

const Footer = () => {
  return (
    <footer className="bg-gray-50 backdrop-blur-md border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">QMetric</span>
            </div>
            <p className="text-gray-600 text-sm">
              Ensuring academic excellence through systematic question paper quality analysis for engineering education.
            </p>
          </div>
          <div>
            <h4 className="text-gray-800 font-semibold mb-4">Analysis Features</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors block">CO Mapping</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors block">Bloom's Taxonomy</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors block">Module Coverage</a>
            </div>
          </div>
          <div>
            <h4 className="text-gray-800 font-semibold mb-4">Support</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors block">User Guide</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors block">Technical Support</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors block">Quality Standards</a>
            </div>
          </div>
          <div>
            <h4 className="text-gray-800 font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors block">About Project</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors block">Research</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors block">Contact Team</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          © 2025 QMetric - Automated Question Paper Quality Analysis System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
