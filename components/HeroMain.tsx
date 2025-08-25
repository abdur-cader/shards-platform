import React from 'react'
import { ArrowRight } from 'lucide-react'
import { ShaderAnimation } from '@/components/shader-animation'
import { FlipWords } from "@/components/ui/flip-words"
import { Prompt } from "next/font/google"

const PromptFont = Prompt({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-prompt',
})

const HeroMain = () => {
  const words = ["For you.", "From you.", "By you.", "With purpose.", "With love.", "For anyone.", "Worth sharing.",
    "To inspire.", "With impact.", "That can hit.", "Built to last."];
    
  return (
    <div className={`relative w-full h-screen overflow-hidden ${PromptFont.className}`}>
      <div className='absolute pointer-events-none top-0 left-0 w-full h-full z-1'>
        <ShaderAnimation />
      </div>

      <div className="z-2 absolute inset-0 flex flex-col md:flex-row justify-center items-center text-white px-8">
        {/* Left Content - Main Text */}
        <div className="md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left mb-8 md:mb-0">
          <div className="text-3xl md:text-5xl lg:text-6xl font-medium">
            Ideas. <FlipWords words={words} />
          </div>
          <p className='font-extralight text-sm mt-4 text-gray-300 md:max-w-md'>Showcase Projects. Get AI Feedback.</p>
        </div>
        
        {/* Right Content - Description */}
        <div className="md:w-1/2 flex flex-col justify-center md:pl-12 max-w-md">
          <p className="text-base md:text-lg font-light leading-relaxed mb-6">
            Shards helps developers get instant, AI-powered feedback on their GitHub projects. 
            Submit your repo and get actionable insights to improve code quality, documentation, 
            and best practices—all in one place.
          </p>
          
          {/* Call to Action Button */}
          <button className="bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 w-full md:w-auto">
            <span className="flex items-center justify-center">Get Started <ArrowRight className="h-5 w-5"/></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroMain;