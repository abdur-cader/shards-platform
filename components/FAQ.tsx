"use client";
import React, { useState } from 'react';
import FadeInOnScroll from './FadeInOnScroll';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section bg-gradient-to-br from-neutral-100 to-neutral-200 dark:bg-gradient-to-br dark:from-[#2D1B69] dark:to-black py-16 px-4">
      <div className="faq-container max-w-4xl mx-auto">
        <h2 className="faq-title text-4xl font-bold text-center text-neutral-900 dark:text-white mb-2">
          FAQ
        </h2>
        <p className="faq-subtitle text-lg text-center text-neutral-600 dark:text-neutral-300 mb-12">
          Everything you need to know about Shards
        </p>
        <FadeInOnScroll>
          <div className="faq-list flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item transition-all duration-300 ease-in-out ${
                  openIndex === index 
                    ? 'rounded-t-xl shadow-lg dark:shadow-purple-900/30' 
                    : 'rounded-xl shadow-lg dark:shadow-purple-900/20'
                }`}
              >
                <button 
                  className={`faq-question w-full font-prompt flex justify-between items-center p-6 border-none text-left text-lg font-[400] cursor-pointer transition-all duration-300 ease-in-out focus:outline-none ${
                    openIndex === index 
                      ? 'rounded-t-xl bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-100' 
                      : 'rounded-xl bg-white dark:bg-purple-800/30 text-purple-700 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-800/40'
                  }`}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <svg 
                    className={`faq-icon w-5 h-5 transition-transform duration-300 ease-in-out ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path 
                      d="M6 9L12 15L18 9" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                
                <div 
                  id={`faq-answer-${index}`}
                  className="faq-answer overflow-hidden transition-all duration-300 ease-in-out bg-purple-50 dark:bg-purple-900/40"
                  role="region"
                  aria-hidden={openIndex !== index}
                  style={{
                    maxHeight: openIndex === index ? '500px' : '0',
                    opacity: openIndex === index ? '1' : '0',
                    padding: openIndex === index ? '1.5rem' : '0 1.5rem',
                    borderRadius: openIndex === index ? '0 0 0.75rem 0.75rem' : '0.75rem'
                  }}
                >
                  <p className="text-purple-700 dark:text-purple-200 leading-relaxed m-0">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeInOnScroll>
      </div>

      <style jsx>{`
        .faq-question:focus:not(:focus-visible) {
          outline: none;
        }
        .faq-question {
          transition: all 0.3s ease-in-out;
        }
        .faq-answer {
          transition: max-height 0.3s ease-in-out, 
                      padding 0.3s ease-in-out, 
                      border-radius 0.3s ease-in-out,
                      opacity 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FAQSection;