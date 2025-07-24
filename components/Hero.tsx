
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
  const words = ["For you.", "From you.", "By you.", "With purpose.", "With love.", "For anyone.", "Worth sharing.",
    "To inspire.", "With impact.", "That can hit.", "Built to last."];
  return (
    <div className={`relative w-full h-[75vh] overflow-hidden ${PromptFont.className}`}>
      <div className='absolute pointer-events-none top-10 left-1/2 w-screen h-screen -translate-x-1/2 -translate-y-10  hover:* z-1'>
        <Spline
        scene="https://prod.spline.design/sP3vS0HVxmpfCJ4i/scene.splinecode"/>
      </div>

      <div className="z-2 absolute inset-0 text-white text-center mt-[35vh] md:mt-[28vh] md:h-[40vh] w-fit mx-auto text-xl text-[2.2rem] md:text-[4.3rem]">
        Ideas. <FlipWords words={words} />
        <p className='font-extralight text-sm py-20 text-gray-400'>Showcase Projects. Get AI Feedback.</p>
      </div>
    </div>
  );
};

export default Hero;

