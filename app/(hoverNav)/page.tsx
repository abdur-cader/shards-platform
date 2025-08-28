import Image from "next/image";
import Navbar from "../../components/Navbar";
import HeroMain from "@/components/HeroMain";
import { InfoCard } from "@/components/InfoCard";
import CountUp from "react-countup";
import {
  Github,
  Sparkles,
  Lightbulb,
  Zap,
  Braces,
  MessageCircleCode,
  TrendingUp,
  Search,
  Users,
  MessageCircle,
  Code,
  Bot,
  Heart,
  ArrowRight
} from "lucide-react";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import Countup from "@/components/Countup";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <>
      <HeroMain />
      
      {/* Existing sections remain the same until the "Why Use Shards" section */}
      
      {/* Revamped "Why Use Shards" Section */}
      <div className="py-24 bg-background overflow-hidden font-prompt">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInOnScroll>
            <h2 className="text-4xl text-center font-prompt font-[400] mb-4">
              Why developers love Shards
            </h2>
            <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-16">
              We've built the platform developers actually want - showcasing code, 
              getting quality feedback, and discovering inspiration.
            </p>
          </FadeInOnScroll>

          {/* Feature Grid */}
          <FadeInOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              <div className="flex flex-col items-center p-6 bg-theme-secondary/10 rounded-xl hover:shadow-lg transition-all">
                <div className="p-3 bg-theme-primary/10 rounded-full mb-4">
                  <Braces className="text-theme-primary" size={32} />
                </div>
                <h3 className="font-[500] mb-2 text-center">Showcase Your Work</h3>
                <p className="text-gray-600 text-center text-sm">
                  Transform GitHub repos into beautiful portfolio pieces that stand out.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 bg-theme-secondary/10 rounded-xl hover:shadow-lg transition-all">
                <div className="p-3 bg-purple-100 rounded-full mb-4">
                  <MessageCircleCode className="text-purple-600" size={32} />
                </div>
                <h3 className="font-[500] mb-2 text-center">AI-Powered Reviews</h3>
                <p className="text-gray-600 text-center text-sm">
                  Get intelligent, actionable feedback from GPT-4o on your code.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 bg-theme-secondary/10 rounded-xl hover:shadow-lg transition-all">
                <div className="p-3 bg-theme-primary/10 rounded-full mb-4">
                  <TrendingUp className="text-theme-primary" size={32} />
                </div>
                <h3 className="font-[500] mb-2 text-center">Grow Your Skills</h3>
                <p className="text-gray-600 text-center text-sm">
                  Learn from concrete suggestions to level up your coding abilities.
                </p>
              </div>

              <div className="flex flex-col items-center p-6 bg-theme-secondary/10 rounded-xl hover:shadow-lg transition-all">
                <div className="p-3 bg-theme-primary/10 rounded-full mb-4">
                  <Search className="text-theme-primary" size={32} />
                </div>
                <h3 className="font-[500] mb-2 text-center">Discover Inspiration</h3>
                <p className="text-gray-600 text-center text-sm">
                  Explore projects from other developers and find new ideas.
                </p>
              </div>
            </div>
          </FadeInOnScroll>

          {/* First Screenshot Section - Left image, right text */}
          <FadeInOnScroll>
            <div className="flex flex-col md:flex-row items-center gap-12 mb-15 relative">
              <div className="md:w-1/2 relative md:left-[-35%] w-[125%]">
                <div className="w-200 h-100 bg-gradient-to-br from-theme-primary to-emerald-400 rounded-2xl shadow-xl transform -rotate-2 transition-transform hover:rotate-0">
                  <div className="absolute inset-8 bg-white/90 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-theme-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Braces className="text-white" size={28} />
                      </div>
                      <h3 className="font-semibold text-theme-primary">Project Showcase</h3>
                      <p className="text-sm text-gray-600 mt-2">Beautiful portfolio view</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 md:pr-8">
                <h3 className="text-2xl font-[500] mb-4">Turn repositories into portfolio pieces</h3>
                <p className="text-gray-600 mb-6">
                  Shards transforms your GitHub projects into visually appealing portfolio items that 
                  go beyond standard README files. Showcase your work in a format that's both 
                  developer-friendly and visually engaging.
                </p>
                <button className="flex items-center text-theme-primary font-medium group">
                  See how it works
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </FadeInOnScroll>

          {/* Second Screenshot Section - Right image, left text */}
          <FadeInOnScroll>
            <div className="flex flex-col md:flex-row items-center gap-12 mb-28 relative">
              <div className="md:w-1/2 order-2 md:order-1 md:pl-8">
                <h3 className="text-2xl font-[500] mb-4">Get AI-powered code insights</h3>
                <p className="text-gray-600 mb-6">
                  Our AI analyzes your code and provides specific, actionable suggestions for 
                  improvement. From architecture recommendations to syntax optimizations, 
                  get feedback that helps you grow as a developer.
                </p>
                <button className="flex items-center text-purple-600 font-medium group">
                  Explore AI features
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="md:w-1/2 relative order-1 md:order-2 md:right-[-25%] w-[125%]">
                <div className="w-full h-80 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-xl transform rotate-2 transition-transform hover:rotate-0">
                  <div className="absolute inset-8 bg-white/90 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Sparkles className="text-white" size={28} />
                      </div>
                      <h3 className="font-semibold text-purple-600">AI Analysis</h3>
                      <p className="text-sm text-gray-600 mt-2">Intelligent code feedback</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          {/* Third Screenshot Section - Left image, right text */}
          <FadeInOnScroll>
            <div className="flex flex-col md:flex-row items-center gap-12 relative">
              <div className="md:w-1/2 relative md:left-[-25%] w-[125%]">
                <div className="w-full h-80 bg-gradient-to-br from-theme-primary to-emerald-400 rounded-2xl shadow-xl transform -rotate-2 transition-transform hover:rotate-0">
                  <div className="absolute inset-8 bg-white/90 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-theme-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="text-white" size={28} />
                      </div>
                      <h3 className="font-semibold text-theme-primary">Community Hub</h3>
                      <p className="text-sm text-gray-600 mt-2">Connect with other developers</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 md:pr-8">
                <h3 className="text-2xl font-[500] mb-4">Join a community of builders</h3>
                <p className="text-gray-600 mb-6">
                  Discover projects from developers around the world, share feedback, and 
                  collaborate on ideas. Shards is more than a portfolio platform—it's a 
                  community focused on growth and learning.
                </p>
                <button className="flex items-center text-theme-primary font-medium group">
                  Join the community
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </div>

      {/* Revamped "Who Shards Is For" Section */}
      <div className="py-24 bg-gradient-to-br from-[#1f0b48] to-black overflow-hidden font-prompt">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-[500] mb-4 text-purple-50">Who Shards Is For</h2>
              <p className="text-purple-200 max-w-2xl mx-auto">
                Shards is built for developers at every stage of their journey who want to showcase, 
                improve, and discover great code.
              </p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h3 className="text-3xl font-[500] mb-6 text-purple-50">(TL;DR: it's for anyone who wants up their dev game)</h3>
                <p className="text-purple-200 mb-6">
                  Whether you're just starting out or have been coding for years, Shards provides 
                  value through its unique combination of portfolio showcasing and AI-powered feedback.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#13082d] p-3 rounded-full mr-4 shadow-lg shadow-purple-700/20 border border-purple-800/30">
                      <TrendingUp className="text-purple-200" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-50">Aspiring junior developers</h4>
                      <p className="text-purple-200 text-sm">Stand out in job applications with a polished portfolio</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#13082d] p-3 rounded-full mr-4 shadow-lg shadow-purple-700/20 border border-purple-800/30">
                      <Github className="text-purple-200" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-50">Open-source contributors</h4>
                      <p className="text-purple-200 text-sm">Get fresh perspectives on your projects</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#13082d] p-3 rounded-full mr-4 shadow-lg shadow-purple-700/20 border border-purple-800/30">
                      <Zap className="text-purple-200" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-50">Side project warriors</h4>
                      <p className="text-purple-200 text-sm">Level up your code quality with AI insights</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#13082d] p-3 rounded-full mr-4 shadow-lg shadow-purple-700/20 border border-purple-800/30">
                      <Heart className="text-purple-200" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-50">Lifelong learners</h4>
                      <p className="text-purple-200 text-sm">Grow with every commit and code review</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="">
                <div className="bg-gradient-to-br from-[#13082d] to-[#0f0524] rounded-xl p-6 mb-6 shadow-lg shadow-purple-800/20 border border-purple-700/40">
                  <h4 className="font-medium text-purple-50 mb-3">Not sure if Shards is for you?</h4>
                  <p className="text-purple-200 text-sm mb-4">
                    If you love to build apps, tinker with projects, or get inspiration, then yes—Shards is for you.
                  </p>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md shadow-purple-600/30">
                    Get Started Now
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-[#160a33] to-[#13082d] rounded-xl p-6 text-white shadow-lg shadow-purple-800/20 border border-purple-700/40">
                  <h4 className="font-medium mb-3">AI Features for Everyone</h4>
                  <p className="text-sm mb-4 opacity-90">
                    Our AI-powered code review is available to all users, regardless of experience level.
                  </p>
                  <div className="flex items-center">
                    <Sparkles size={18} className="mr-2 text-purple-200" />
                    <span className="text-sm">Powered by GPT-4o</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
          
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-[500] mb-4 text-purple-50">Explore AI Powered Tools</h2>
              <p className="text-purple-200 max-w-2xl mx-auto">
                Our advanced AI features help you improve code quality, get personalized feedback, 
                and grow as a developer.
              </p>
            </div>
          </FadeInOnScroll>
          
          <FadeInOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              <Countup />
              
              <FeatureCard
                icon={<Code className="text-purple-200" size={20} />}
                title="No Waiting Around"
                description="Fast responses mean less waiting, faster growth — so you can focus on shipping, not sitting around."
              />

              <FeatureCard
                icon={<Sparkles className="text-purple-200" size={20} />}
                title="Competitive Edge"
                description="Discover what makes your project stand out — get AI-driven insights into its unique value proposition."
              />

              <FeatureCard
                icon={<Lightbulb className="text-purple-200" size={20} />}
                title="Instant Documentation"
                description="Build a polished project overview with AI — automatically generated and displayed on your shard's detail page."
              />
            </div>
          </FadeInOnScroll>
          
        </div>
      </div>
      
      {/* Final CTA Section with Lime Pattern */}
      <div className="py-20 relative overflow-hidden bg-background">
        {/* Diagonal lime pattern background */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{
               backgroundImage: `repeating-linear-gradient(
                 45deg,
                 rgb(132 204 22 / 0.1),
                 rgb(132 204 22 / 0.1) 10px,
                 transparent 10px,
                 transparent 20px
               )`
             }}>
        </div>
        
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <FadeInOnScroll>
            <div className="text-center">
              <h3 className="text-3xl font-[500] mb-4">Ready to transform how you showcase code?</h3>
              <p className="text-muted-foreground mb-8">
                Join thousands of developers who are already using Shards to display their projects, 
                get quality feedback, and discover inspiration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-lime-600 to-lime-500 text-white px-6 py-3 rounded-lg font-medium hover:from-lime-700 hover:to-lime-600 transition-all shadow-md shadow-lime-500/20">
                  Create Your Account
                </button>
                <button className="border border-lime-600 text-foreground px-6 py-3 rounded-lg font-medium hover:bg-lime-600/10 transition-colors">
                  Explore Shards Gallery
                </button>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </>
  );
}