import React from 'react'
import Image from 'next/image'
import Spline from "@splinetool/react-spline/next"
import { FlipWords } from "@/components/ui/flip-words";
import { Prompt } from "next/font/google"

const PromptFont = Prompt({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-prompt',
})

const Hero = () => {
  const words = ["Discover Shards", "Get inspiration", "Be discovered"];
  return (
    <div className={`relative w-full h-[75vh] bg-zinc-700 overflow-hidden ${PromptFont.className}`}>
      {/* Light mode overlay for better contrast */}
      <div className="absolute inset-0  dark:bg-none z-10 pointer-events-none" />
      
      <div className='absolute pointer-events-none top-10 left-1/2 w-screen h-screen -translate-x-1/2 -translate-y-10 hover:* z-1'>
        <Spline
        scene="https://prod.spline.design/sP3vS0HVxmpfCJ4i/scene.splinecode"/>
      </div>

      <div className="z-20 relative inset-0 text-center mt-[35vh] md:mt-[28vh] md:h-[40vh] w-fit mx-auto text-xl text-[2.2rem] md:text-[4.3rem]">
        <div className="text-neutral-200 dark:text-white font-medium">
          <FlipWords words={words} />
        </div>
        {/* Subtle shadow for better readability in light mode */}
        <div className="absolute inset-0 text-shadow-lg dark:text-shadow-none pointer-events-none" />
      </div>
    </div>
  );
};

export default Hero;