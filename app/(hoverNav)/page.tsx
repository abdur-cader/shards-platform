import Image from "next/image";
import Navbar from "../../components/Navbar";
import Hero from "@/components/Hero";
import { InfoCard } from "@/components/InfoCard";
import {
  Github,
  Sparkles,
  Zap,
  Braces,
  MessageCircleCode,
  TrendingUp,
  Search,
} from "lucide-react";
import { FlipWords } from "@/components/ui/flip-words";
import { Separator } from "@/components/ui/separator";
import FadeInOnScroll from "@/components/FadeInOnScroll";

export default function Home() {
  const words = ["Share.", "Get feedback.", "Easily Discover.", "Improve."];
  return (
    <>
      <Hero />
      <FadeInOnScroll>
        <section className="py-24 text-center bg-background">
          <h2 className="text-4xl font-prompt font-[400] mb-4">
            what's a shard?
          </h2>
          <span>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              a shard is a snapshot of your GitHub project — Conceptually
              created to help people easily discover creations, get inspired,
              and boost projects with AI.
            </p>
          </span>
        </section>
      </FadeInOnScroll>

      <div className="animate-radial-orbit py-20 bg-theme-secondary overflow-hidden font-prompt">
        <FadeInOnScroll>
          <section className="text-center mb-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-theme-primary mb-4 transition-colors duration-300">
              How it works
            </h2>
            <p className="text-xl text-theme-secondary max-w-2xl mx-auto text-gray-400">
              Get shit done in 3 simple steps.
            </p>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll>
          <section className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <InfoCard
              svg={<Github />}
              title="Connect to GitHub"
              para="Link your GitHub to sync your public repos and get started instantly."
              step={1}
            />
            <InfoCard
              svg={<Zap />}
              title="Submit a Shard"
              para="Directly submit a shard from one of your existing repositories and have it displayed."
              step={2}
            />
            <InfoCard
              svg={<Sparkles />}
              title="Get help from AI"
              para="Get AI tips or ideas from your Shard to improve or start new projects."
              step={3}
            />
          </section>
        </FadeInOnScroll>
      </div>

      <div className="py-24 bg-theme-secondary overflow-hidden font-prompt">
        <section className="bg-background max-w-6xl mx-auto px-6">
          <FadeInOnScroll>
            <h2 className="text-4xl text-center font-prompt font-[400] mb-12">
              Why use Shards?
            </h2>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {/* 1 */}

              <div className="flex flex-col items-center">
                <div className="text-4xl mb-4">
                  <Braces color="#e80e0e" />
                </div>
                <h3 className="font-[400] mb-2">Show Off Your Code</h3>
                <p className="text-gray-400 max-w-xs">
                  Turn your repos into beautiful, scrollable portfolio items.
                </p>
              </div>

              {/* 2 */}
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-4">
                  <MessageCircleCode color="#e87b0e" />
                </div>
                <h3 className="font-[400] mb-2">AI Code Reviews</h3>
                <p className="text-gray-400 max-w-xs">
                  GPT-4o gives smart, human-like feedback on your work.
                </p>
              </div>

              {/* 3 */}
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-4">
                  <TrendingUp color="#26eb4a" />
                </div>
                <h3 className="font-[400] mb-2">Improve & Iterate</h3>
                <p className="text-gray-400 max-w-xs">
                  Get concrete suggestions on how to level up your code.
                </p>
              </div>

              {/* 4 */}
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-4">
                  <Search color="#268feb" />
                </div>
                <h3 className="font-[400] mb-2">Discover Other Devs</h3>
                <p className="text-gray-400 max-w-xs">
                  Browse other people’s shards and learn from them too.
                </p>
              </div>
            </div>
          </FadeInOnScroll>
        </section>
      </div>
      <hr className="w-2/4 mx-auto " />
      <FadeInOnScroll>
        <section className="py-24 bg-theme-secondary font-prompt max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side - title */}
            <h2 className="text-4xl font-semibold text-theme-primary self-center">
              Who Shards Is For
            </h2>

            {/* Right side - description */}
            <div className="text-theme-secondary space-y-4 text-gray-400">
              <p>
                Shards is built for devs who want more than just code on GitHub
                — it’s for those who want to show off their projects with style
                and get real, actionable feedback powered by AI*.
              </p>

              <p>Whether you’re a:</p>

              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Aspiring junior dev looking to stand out in job apps</li>
                <li>Open-source contributor craving fresh eyes on your work</li>
                <li>
                  Side project warrior wanting to level up your code quality
                </li>
                <li>
                  Hacker at heart who loves learning and growing with every
                  commit
                </li>
              </ul>

              <p>
                Shards helps you turn your code into a portfolio that speaks
                louder than just a README.
              </p>
            </div>
          </div>
          <p className="py-20 text-muted-foreground text-center">
            *Basically, it's for anyone.
          </p>
        </section>
      </FadeInOnScroll>
    </>
  );
}
