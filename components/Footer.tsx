import { Sparkles, Github, MessageCircle, Twitter,  } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    // Add this after the FAQ section
    <footer className="bg-gradient-to-br from-gray-50 to-lime-50 dark:from-black dark:to-[#1f6e0f] text-gray-900 dark:text-white py-16 px-6">
    <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="md:col-span-2">
            <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-lime-500 rounded-md mr-2 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-semibold">Shards</span>
            </div>
            <p className="text-gray-600 dark:text-lime-100 mb-6 max-w-md">
            Where developers showcase projects, get AI-powered insights, and discover inspiration.
            </p>
            <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full bg-lime-100 dark:bg-lime-800/50 flex items-center justify-center hover:bg-lime-200 dark:hover:bg-lime-700 transition-colors">
                <Github size={18} className="text-lime-600 dark:text-lime-200" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-lime-100 dark:bg-lime-800/50 flex items-center justify-center hover:bg-lime-200 dark:hover:bg-lime-700 transition-colors">
                <MessageCircle size={18} className="text-lime-600 dark:text-lime-200" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-lime-100 dark:bg-lime-800/50 flex items-center justify-center hover:bg-lime-200 dark:hover:bg-lime-700 transition-colors">
                <Twitter size={18} className="text-lime-600 dark:text-lime-200" />
            </a>
            </div>
        </div>

        {/* Product Links */}
        <div>
            <h4 className="font-semibold mb-4 text-lime-600 dark:text-lime-300">Product</h4>
            <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 dark:text-lime-100 hover:text-lime-700 dark:hover:text-white transition-colors">Features</a></li>
                    <li><a href="#" className="text-gray-600 dark:text-lime-100 hover:text-lime-700 dark:hover:text-white transition-colors">AI Tools</a></li>
            <li><a href="#" className="text-gray-600 dark:text-lime-100 hover:text-lime-700 dark:hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="text-gray-600 dark:text-lime-100 hover:text-lime-700 dark:hover:text-white transition-colors">Examples</a></li>
            </ul>
        </div>

        {/* Resources Links */}
        <div>
            <h4 className="font-semibold mb-4 text-lime-600 dark:text-lime-300">Resources</h4>
            <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 dark:text-lime-100 hover:text-lime-700 dark:hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="text-gray-600 dark:text-lime-100 hover:text-lime-700 dark:hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="text-gray-600 dark:text-lime-100 hover:text-lime-700 dark:hover:text-white transition-colors">Tutorials</a></li>
            <li><a href="#" className="text-gray-600 dark:text-lime-100 hover:text-lime-700 dark:hover:text-white transition-colors">Support</a></li>
            </ul>
        </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 dark:border-lime-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 dark:text-lime-200 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Shards. All rights reserved.
        </p>
        <div className="flex space-x-6">
            <a href="#" className="text-gray-500 dark:text-lime-200 hover:text-lime-600 dark:hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 dark:text-lime-200 hover:text-lime-600 dark:hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 dark:text-lime-200 hover:text-lime-600 dark:hover:text-white text-sm transition-colors">Cookie Policy</a>
        </div>
        </div>
    </div>
    </footer>
  )
}

export default Footer