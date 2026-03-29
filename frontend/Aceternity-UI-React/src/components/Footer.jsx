import React from 'react';
import { FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-md border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                QMetric
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ensuring academic excellence through systematic question paper quality analysis for engineering education.
            </p>
          </div>

          {/* Analysis Features */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Analysis Features</h4>
            <div className="space-y-2.5 text-sm">
              {['CO Mapping', "Bloom's Taxonomy", 'Module Coverage'].map(item => (
                <a key={item} href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <div className="space-y-2.5 text-sm">
              {['User Guide', 'Technical Support', 'Quality Standards'].map(item => (
                <a key={item} href="#" className="block text-gray-400 hover:text-blue-400 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <div className="space-y-2.5 text-sm">
              {[
                { label: 'About Project', href: '#about' },
                { label: 'Research', href: '#' },
                { label: 'Our Team', href: '/team' },
              ].map(item => (
                <a key={item.label} href={item.href} className="block text-gray-400 hover:text-blue-400 transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>© 2025 QMetric — Automated Question Paper Quality Analysis System. All rights reserved.</span>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <span className="text-red-400 mx-1">♥</span>
            <span>by the QMetric Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
