import { AlertTriangle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Important Notice</p>
              <p>
                This app is not a substitute for professional mental health care. 
                If you are in crisis, please call your local helpline immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright and Links */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Heart className="w-4 h-4 text-red-500" />
            <p className="text-sm">
              Made with care for mental wellness © 2025 MindSoothe Journal
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-green-600 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-green-600 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="hover:text-green-600 transition-colors duration-200">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}