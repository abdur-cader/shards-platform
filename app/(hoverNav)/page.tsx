import HeroMain from "@/components/HeroMain";
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave";
import Image from "next/image";
import {
  Github,
  Sparkles,
  Lightbulb,
  Zap,
  Braces,
  MessageCircleCode,
  TrendingUp,
  Search,
  Code,
  Heart,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import Countup from "@/components/Countup";
import FeatureCard from "@/components/FeatureCard";
import Link from "next/link";
import FAQSection from "@/components/FAQ";
import Footer from "@/components/Footer";
import { InfoCard } from "@/components/InfoCard";

export default function Home() {
  const faqData = [
    {
      question: "What is Shards?",
      answer:
        "Shards is a platform where developers can showcase projects, explore what others are building, and get AI-powered insights on their work.",
    },
    {
      question: "Who can use Shards?",
      answer:
        "Anyone who codes or builds projects—beginners, students, and pros alike.",
    },
    {
      question: "Do I need a GitHub account?",
      answer:
        "Yes, you need a GitHub account to sign in and submit your projects to Shards.",
    },
    {
      question: "Do I need to pay to use Shards?",
      answer:
        "No, Shards is free to use for showcasing projects and using the AI toolkit.",
    },
    {
      question: "How does the AI toolkit work?",
      answer:
        "Submit your project to get AI-powered insights and suggestions on your code or project structure.",
    },
    {
      question: "Is my code private when I upload it?",
      answer:
        "Yes, you can choose to keep projects private or share them publicly while still using AI insights.",
    },
    {
      question: "Can I see other people's projects?",
      answer:
        "Absolutely! Browsing other projects is a key way to discover inspiration and learn from examples.",
    },
    {
      question: "What kind of projects can I share?",
      answer:
        "Any coding or development project—web apps, scripts, experiments, libraries, or anything you've built!",
    },
    {
      question: "How do I get started?",
      answer:
        "Sign in with GitHub, upload a project, and explore the gallery. Then use the AI toolkit for insights.",
    },
  ];

  const accountBtnBase = `
  rounded-full
  bg-gradient-to-r from-lime-500 via-lime-600 to-lime-700
  border border-lime-500
  text-white
  shadow-md shadow-lime-500/20
  relative overflow-hidden
  transition-transform duration-300 ease-in-out
  px-6 py-3
  font-medium
  cursor-pointer`;

  return (
    <>
      <HeroMain />

      {/* Revamped "Why Use Shards" Section */}
      <div className="py-24 bg-background dark:bg-background overflow-hidden font-prompt">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInOnScroll>
            <h2 className="text-4xl text-center font-prompt font-[400] mb-4 text-foreground dark:text-foreground">
              Why developers love it
            </h2>
            <p className="text-muted-foreground dark:text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-16">
              We&apos;ve built the platform developers actually want -
              showcasing code, getting quality feedback, and discovering
              inspiration.
            </p>
          </FadeInOnScroll>

          {/* Feature Grid */}
          <FadeInOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              <InfoCard
                svg={
                  <Braces
                    className="text-purple-200 group-hover:text-purple-100"
                    size={32}
                  />
                }
                title="Showcase Your Work"
                para="Transform GitHub repos into beautiful portfolio pieces that stand out."
                step={1}
              />

              <InfoCard
                svg={
                  <MessageCircleCode
                    className="text-purple-200 group-hover:text-purple-100"
                    size={32}
                  />
                }
                title="Concept to Clarity"
                para="Take messy thoughts and turn them into a clear idea you can manifest."
                step={2}
              />

              <InfoCard
                svg={
                  <TrendingUp
                    className="text-purple-200 group-hover:text-purple-100"
                    size={32}
                  />
                }
                title="Empower Your Skills"
                para="Learn from practical, real-world suggestions to level up your coding abilities."
                step={3}
              />

              <InfoCard
                svg={
                  <Search
                    className="text-purple-200 group-hover:text-purple-100"
                    size={32}
                  />
                }
                title="Discover Inspiration"
                para="Explore projects from other developers and take inspiration to create your own."
                step={4}
              />
            </div>
          </FadeInOnScroll>

          {/* First Screenshot Section - Left image, right text */}
          <FadeInOnScroll>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-30 md:mb-120 mt-20 md:mt-60 relative">
              <div className="w-full md:w-[80vw] lg:w-[85vw] max-w-none md:relative md:left-[-25vw] lg:left-[-30vw] md:scale-120">
                <div className="w-full aspect-video rounded-2xl overflow-hidden flex items-center justify-center">
                  <video
                    src="/shardsviewanimate.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl pointer-events-none select-none"
                  />
                </div>
              </div>
              <div className="w-full md:w-[45vw] lg:w-[40vw] md:max-w-md md:ml-[-10vw] lg:ml-[-12vw] z-10 bg-background md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none">
                <h3 className="text-3xl font-[500] mb-4 text-foreground dark:text-foreground">
                  Get AI-powered code insights
                </h3>
                <p className="text-gray-600 text-lg dark:text-gray-600 font-hind mb-6">
                  Our AI analyzes your code and provides specific, actionable
                  suggestions for improvement. From architecture recommendations
                  to syntax optimizations, get feedback that helps you grow as a
                  developer.
                </p>
                <button className="flex text-lg items-center text-lime-600 dark:text-theme-primary font-medium group">
                  See how it works
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </FadeInOnScroll>

          {/* Second Screenshot Section - Right video, left text */}
          <FadeInOnScroll>
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 mb-30 md:mb-120 relative">
              <div className="w-full md:w-[80vw] lg:w-[85vw] max-w-none md:relative md:right-[-25vw] lg:right-[-30vw] md:scale-120">
                <div className="w-full aspect-video rounded-2xl overflow-hidden flex items-center justify-center">
                  <video
                    src="/shardsviewanimate.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl pointer-events-none select-none"
                  />
                </div>
              </div>
              <div className="w-full md:w-[45vw] lg:w-[40vw] md:max-w-md md:mr-[-10vw] lg:mr-[-12vw] z-10 bg-background md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none order-first md:order-none">
                <h3 className="text-3xl font-[500] mb-4 text-foreground dark:text-foreground">
                  Turn repositories into portfolio pieces
                </h3>
                <p className="text-gray-600 font-lg dark:text-gray-600 font-hind mb-6">
                  Shards transforms your GitHub projects into visually appealing
                  portfolio items that go beyond standard README files. Showcase
                  your work in a format that's both developer-friendly and
                  visually engaging.
                </p>
                <button className="flex items-center text-purple-600 font-medium group">
                  Explore AI features
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </FadeInOnScroll>

          {/* Third Screenshot Section - Left video, right text */}
          <FadeInOnScroll>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-20 md:mb-60 relative">
              <div className="w-full md:w-[80vw] lg:w-[85vw] max-w-none md:relative md:left-[-25vw] lg:left-[-30vw] md:scale-120">
                <div className="w-full aspect-video rounded-2xl overflow-hidden flex items-center justify-center">
                  <video
                    src="/shardsviewanimate.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl pointer-events-none select-none"
                  />
                </div>
              </div>
              <div className="w-full md:w-[45vw] lg:w-[40vw] md:max-w-md md:ml-[-10vw] lg:ml-[-12vw] z-10 bg-background md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none">
                <h3 className="text-3xl font-[500] mb-4 text-foreground dark:text-foreground">
                  Join a community of builders
                </h3>
                <p className="text-gray-600 text-lg dark:text-gray-600 mb-6">
                  Discover projects from developers around the world, share
                  feedback, and collaborate on ideas. Shards is more than a
                  portfolio platform—it&apos;s a community focused on growth and
                  learning.
                </p>
                <button className="flex text-lg items-center text-lime-600 dark:text-theme-primary font-medium group">
                  Join the community
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </div>

      {/* Revamped "Who Shards Is For" Section */}
      <div className="py-24 bg-gradient-to-br from-indigo-50 to-gray-100 dark:from-[#1f0b48] dark:to-black overflow-hidden font-prompt">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-[500] mb-4 text-gray-900 dark:text-purple-50">
                Who Shards Is For
              </h2>
              <p className="text-gray-700 dark:text-purple-200 max-w-2xl mx-auto">
                Shards is built for developers at every stage of their journey
                who want to showcase, improve, and discover great code.
              </p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-60">
              <div>
                <h3 className="text-3xl font-[500] mb-6 text-gray-900 dark:text-purple-50">
                  (It&apos;s basically for anyone)
                </h3>
                <p className="text-gray-700 dark:text-purple-200 mb-6">
                  Whether you&apos;re just starting out or have been coding for
                  years, Shards provides value through its unique combination of
                  portfolio showcasing and AI-powered feedback.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-white shadow-md p-3 rounded-full mr-4 border border-gray-200 dark:bg-[#13082d] dark:shadow-purple-700/20 dark:border-purple-800/30">
                      <TrendingUp
                        className="text-lime-600 dark:text-purple-200"
                        size={20}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-purple-50">
                        Aspiring junior developers
                      </h4>
                      <p className="text-gray-600 dark:text-purple-200 text-sm">
                        Stand out in job applications with a polished portfolio
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-white shadow-md p-3 rounded-full mr-4 border border-gray-200 dark:bg-[#13082d] dark:shadow-purple-700/20 dark:border-purple-800/30">
                      <Github
                        className="text-lime-600 dark:text-purple-200"
                        size={20}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-purple-50">
                        Open-source contributors
                      </h4>
                      <p className="text-gray-600 dark:text-purple-200 text-sm">
                        Get fresh perspectives on your projects
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-white shadow-md p-3 rounded-full mr-4 border border-gray-200 dark:bg-[#13082d] dark:shadow-purple-700/20 dark:border-purple-800/30">
                      <Zap
                        className="text-lime-600 dark:text-purple-200"
                        size={20}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-purple-50">
                        Side project warriors
                      </h4>
                      <p className="text-gray-600 dark:text-purple-200 text-sm">
                        Level up your code quality with AI insights
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-white shadow-md p-3 rounded-full mr-4 border border-gray-200 dark:bg-[#13082d] dark:shadow-purple-700/20 dark:border-purple-800/30">
                      <Heart
                        className="text-lime-600 dark:text-purple-200"
                        size={20}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-purple-50">
                        Lifelong learners
                      </h4>
                      <p className="text-gray-600 dark:text-purple-200 text-sm">
                        Grow with every commit and code review
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200 dark:bg-gradient-to-br dark:from-[#13082d] dark:to-[#0f0524] dark:shadow-purple-800/20 dark:border-purple-700/40">
                  <h4 className="font-medium text-gray-900 dark:text-purple-50 mb-3">
                    Not sure if Shards is for you?
                  </h4>
                  <p className="text-gray-600 dark:text-purple-200 text-sm mb-4">
                    If you love to build apps, tinker with projects, or get
                    inspiration, then yes—Shards is for you.
                  </p>
                  <button className="w-full bg-gradient-to-r from-lime-500 to-lime-600 dark:from-purple-600 dark:to-purple-700 text-white py-2.5 rounded-lg font-medium hover:from-lime-600 hover:to-lime-700 dark:hover:from-purple-700 dark:hover:to-purple-800 transition-all shadow-md shadow-lime-500/30 dark:shadow-purple-600/30">
                    Get Started Now
                  </button>
                </div>

                <div className="bg-gradient-to-r from-lime-50 to-indigo-50 dark:from-[#160a33] dark:to-[#13082d] rounded-xl p-6 text-gray-900 dark:text-white shadow-lg border border-gray-200 dark:shadow-purple-800/20 dark:border-purple-700/40">
                  <h4 className="font-medium mb-3">AI Features for Everyone</h4>
                  <p className="text-sm mb-4 opacity-90">
                    Our AI-powered code review is available to all users,
                    regardless of experience level.
                  </p>
                  <div className="flex items-center">
                    <Sparkles
                      size={18}
                      className="mr-2 text-lime-600 dark:text-purple-200"
                    />
                    <span className="text-sm">Powered by GPT-5</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <div className="text-center mb-30">
              <h2 className="text-4xl md:text-6xl font-[550] mb-10">
                <span
                  className="relative inline-flex flex-col md:flex-row items-center text-transparent bg-clip-text 
              bg-gradient-to-r 
              from-gray-900 via-gray-100 to-gray-900
              dark:from-white dark:via-purple-200 dark:to-white"
                >
                  <span className="text-center md:text-left">Explore</span>
                  <TextShimmerWave
                    className="relative md:-mx-5 z-10 inline-block font-rsalt font-[400] 
                md:translate-y-[-5px] md:rotate-[-7deg] md:scale-110
                mx-2 my-2 md:my-0"
                    duration={1}
                  >
                    AI-Powered
                  </TextShimmerWave>
                  <span className="text-center md:text-left">Tools</span>
                </span>
              </h2>

              <p className="text-gray-700 dark:text-purple-200 max-w-2xl mx-auto">
                Our advanced AI features help you improve code quality, get
                personalized feedback, and grow as a developer.
              </p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              <Countup />

              <FeatureCard
                icon={
                  <Code
                    className="text-lime-600 dark:text-purple-200"
                    size={20}
                  />
                }
                title="No Waiting Around"
                description="Fast responses mean less waiting, faster growth — so you can focus on shipping, not sitting around."
              />

              <FeatureCard
                icon={
                  <Sparkles
                    className="text-lime-600 dark:text-purple-200"
                    size={20}
                  />
                }
                title="Competitive Edge"
                description="Discover what makes your project stand out — get AI-driven insights into its unique value proposition."
              />

              <FeatureCard
                icon={
                  <Lightbulb
                    className="text-lime-600 dark:text-purple-200"
                    size={20}
                  />
                }
                title="Instant Documentation"
                description="Build a polished project overview with AI — automatically generated and displayed on your shard's detail page."
              />
            </div>
          </FadeInOnScroll>
        </div>
      </div>

      {/* Final CTA Section with Lime Pattern */}
      <div className="py-50 diagonal-bg relative overflow-hidden bg-background dark:bg-background">
        <div className="max-w-3xl font-prompt mx-auto px-6 relative z-10">
          <FadeInOnScroll>
            <div className="text-center">
              <h3 className="text-3xl font-[400] mb-4 text-foreground dark:text-foreground">
                Ready to make your projects shine?
              </h3>
              <p className="text-muted-foreground dark:text-muted-foreground mb-8">
                Join the community of developers who showcase projects and get
                AI-powered insights on Shards.
              </p>
              <div className="flex flex-col gap-6 justify-center">
                <button className={`${accountBtnBase} hover:scale-105`}>
                  Create Your Account
                </button>
                <Link
                  href="/shards/explore"
                  className="text-foreground dark:text-foreground cursor-pointer py-1 rounded-lg font-medium group transition-colors"
                >
                  <span className="flex items-center justify-center gap-2">
                    Explore Shards
                    <ChevronRight className="w-5 h-5 transition-all duration-200 group-hover:translate-x-2" />
                  </span>
                </Link>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </div>
      <div>
        <FAQSection faqs={faqData} />
      </div>
      <div className="h-20  diagonal-purple-bg dark:diagonal-purple-bg" />
      <Footer />
    </>
  );
}
