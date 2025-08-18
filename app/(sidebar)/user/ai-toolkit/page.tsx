"use client";
import { useState, useEffect } from "react";
import {
  Brain,
  Code,
  FileText,
  FlaskConical,
  Terminal,
  Copy,
  ChevronRight,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const tools = [
  {
    slug: "idea-generator",
    title: "Idea Generator",
    description: "Get unique project ideas tailored to your skills",
    icon: Brain,
  },
  {
    slug: "stack-recommender",
    title: "Stack Recommender",
    description: "Get technology recommendations for your project",
    icon: Code,
  },
  {
    slug: "readme-builder",
    title: "README Builder",
    description: "Generate professional README files instantly",
    icon: FileText,
  },
  {
    slug: "competitive-angle",
    title: "Competitive Angle",
    description: "Find your project's unique value proposition",
    icon: FlaskConical,
  },
  {
    slug: "code-snippet-bootstrapper",
    title: "Code Bootstrapper",
    description: "Generate starter code for common patterns",
    icon: Terminal,
  },
];

const recentRuns = [
  {
    id: "1",
    tool_slug: "idea-generator",
    tool_title: "Idea Generator",
    input_json: { topic: "AI tools for developers" },
    output_md: "1. AI-powered code review assistant...",
    created_at: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    tool_slug: "readme-builder",
    tool_title: "README Builder",
    input_json: { project_name: "Shards" },
    output_md: "# Shards\n\nAI feedback for GitHub projects...",
    created_at: new Date(Date.now() - 86400000),
  },
];

export default function AIToolkitPage() {
  const [selectedTool, setSelectedTool] = useState<typeof tools[0] | null>(null);
  const [credits, setCredits] = useState(15);
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="min-h-screen min-w-screen text-gray-100 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(
            circle at ${gradientPos.x}% ${gradientPos.y}%, 
            rgba(109, 14, 218, 0.08) 0%, 
            rgba(11, 16, 27, 0.95) 30%,
            rgba(9, 3, 20, 0.08) 80%
          ),
          linear-gradient(
            to bottom right,
            rgba(3, 7, 18, 1) 0%,
            rgba(15, 23, 42, 1) 50%,
            rgba(3, 7, 18, 1) 100%
          )
        `
      }}
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold font-prompt bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500 tracking-tight">
              DevAI Toolkit
            </h1>
            <p className="text-gray-400 mt-2 font-light">
              Essential AI tools for developers
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700 rounded-full px-4 py-2 backdrop-blur-sm hover:bg-gray-700/80 transition-all duration-300">
              <Zap className="w-5 h-5 text-indigo-400" />
              <span className="font-medium">{credits}</span>
              <span className="text-gray-400 text-sm">credits</span>
            </div>
            <Button
              variant="outline"
              className="border-indigo-400/30 bg-indigo-400/10 hover:bg-indigo-400/20 text-indigo-400 hover:text-indigo-300 transition-all duration-300"
            >
              Add credits
            </Button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <section className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <button
                  key={tool.slug}
                  onClick={() => setSelectedTool(tool)}
                  className="group relative bg-gray-800/50 hover:bg-gray-700/60 rounded-xl p-6 transition-all duration-300 overflow-hidden border border-gray-700/50 hover:border-indigo-400/30"
                >
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_linear_infinite]"></div>
                  </div>
                  
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-indigo-400/10 group-hover:bg-indigo-400/20 transition-all duration-300">
                      <tool.icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-[500] font-prompt text-lg group-hover:text-indigo-300 transition-colors">{tool.title}</h3>
                      <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-300 transition-colors">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10 flex justify-end mt-4">
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="lg:col-span-1">
            <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 h-full backdrop-blur-sm transition-all duration-300">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Activity
              </h2>
              {recentRuns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent activity
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRuns.map((run) => (
                    <div
                      key={run.id}
                      className="bg-gray-700/40 hover:bg-gray-700/60 rounded-lg p-3 transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-400/10 relative overflow-hidden"
                      onClick={() => {
                        const tool = tools.find((t) => t.slug === run.tool_slug);
                        if (tool) setSelectedTool(tool);
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{run.tool_title}</h3>
                          <p className="text-gray-400 text-xs mt-1">
                            {run.created_at.toLocaleString()}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-indigo-400 p-1 transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="relative z-10 mt-2 text-sm text-gray-300 line-clamp-2">
                        {run.output_md.split("\n")[0]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {selectedTool && (
        <ToolDialog
          tool={selectedTool}
          credits={credits}
          onClose={() => setSelectedTool(null)}
          onRun={() => setCredits((c) => c - 1)}
        />
      )}

      <style jsx global>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
          }
        }
      `}</style>
    </div>
  );
}

function ToolDialog({
  tool,
  credits,
  onClose,
  onRun,
}: {
  tool: typeof tools[0];
  credits: number;
  onClose: () => void;
  onRun: () => void;
}) {
  const Icon = tool.icon;
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = () => {
    setIsLoading(true);
    onRun();
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <Dialog open={!!tool} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-gray-800/95 border-gray-700 rounded-xl font-prompt overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 to-blue-500/5 opacity-30 pointer-events-none"></div>
        <DialogHeader className="relative z-10 border-b border-gray-700 pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-400/10">
              <Icon className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
              {tool.title}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 text-gray-300">Input</h3>
              {tool.slug === "idea-generator" && <IdeaGeneratorForm />}
              {tool.slug === "stack-recommender" && <StackRecommenderForm />}
              {tool.slug === "readme-builder" && <ReadmeBuilderForm />}
              {tool.slug === "competitive-angle" && <CompetitiveAngleForm />}
              {tool.slug === "code-snippet-bootstrapper" && <CodeBootstrapperForm />}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                {credits > 0 ? (
                  <span>This will use 1 credit</span>
                ) : (
                  <span className="text-rose-400">Not enough credits</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-500 hover:bg-indigo-400 text-white transition-all"
                  disabled={credits <= 0 || isLoading}
                  onClick={handleRun}
                >
                  {isLoading ? "Processing..." : "Run Tool"}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-300">Output</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 h-64 overflow-auto transition-all">
                <div className="prose prose-invert prose-sm max-w-none">
                  {tool.slug === "idea-generator" && (
                    <>
                      <h3 className="text-indigo-400">Generated Ideas</h3>
                      <ol className="space-y-3">
                        <li>AI-powered code review assistant</li>
                        <li>Automated documentation generator</li>
                        <li>Smart commit message writer</li>
                        <li>Personalized learning path creator</li>
                        <li>Code smell detector with explanations</li>
                      </ol>
                    </>
                  )}
                  {tool.slug === "stack-recommender" && (
                    <>
                      <h3 className="text-indigo-400">Recommended Stack</h3>
                      <ul className="space-y-2">
                        <li>
                          <strong>Frontend:</strong> Next.js, TypeScript
                        </li>
                        <li>
                          <strong>Backend:</strong> Node.js, Express
                        </li>
                        <li>
                          <strong>Database:</strong> PostgreSQL
                        </li>
                        <li>
                          <strong>Auth:</strong> NextAuth.js
                        </li>
                        <li>
                          <strong>Deployment:</strong> Vercel + Railway
                        </li>
                      </ul>
                    </>
                  )}
                  {tool.slug === "readme-builder" && (
                    <>
                      <h1 className="text-2xl font-bold">Project Name</h1>
                      <p>A brief description of what your project does.</p>
                      <h2 className="text-xl font-semibold mt-4">Features</h2>
                      <ul>
                        <li>Feature one description</li>
                        <li>Feature two description</li>
                        <li>Feature three description</li>
                      </ul>
                      <h2 className="text-xl font-semibold mt-4">
                        Installation
                      </h2>
                      <pre className="bg-gray-800 p-3 rounded">
                        <code>npm install</code>
                      </pre>
                    </>
                  )}
                  {tool.slug === "competitive-angle" && (
                    <>
                      <h3 className="text-indigo-400">Unique Value Proposition</h3>
                      <ul className="space-y-2">
                        <li>Focuses specifically on developer experience</li>
                        <li>Open-source alternative to commercial tools</li>
                        <li>Seamless GitHub integration</li>
                        <li>Privacy-focused data handling</li>
                      </ul>
                    </>
                  )}
                  {tool.slug === "code-snippet-bootstrapper" && (
                    <>
                      <h3 className="text-indigo-400">Starter Code</h3>
                      <pre className="bg-gray-800 p-3 rounded overflow-x-auto">
                        <code>{
`// Example React component
function MyComponent() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Fetch data here
  }, []);

  return (
    <div className="container">
      {/* Your JSX */}
    </div>
  );
}`}
                        </code>
                      </pre>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IdeaGeneratorForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Topic or Interest</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., AI tools for developers"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Your Skills</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., React, Python, Machine Learning"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Project Complexity</Label>
        <select className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-400/50 focus:border-indigo-400/50 hover:border-gray-500 transition-all">
          <option value="beginner">Beginner (1-2 weeks)</option>
          <option value="intermediate">Intermediate (1-3 months)</option>
          <option value="advanced">Advanced (3-6 months)</option>
        </select>
      </div>
    </div>
  );
}

function StackRecommenderForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Project Type</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., SaaS, mobile app"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Key Requirements</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., real-time updates, user auth"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Your Preferences</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., prefer JavaScript"
        />
      </div>
    </div>
  );
}

function ReadmeBuilderForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Project Name</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., Shards"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Description</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="Brief description of your project"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Key Features</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="List the main features"
          rows={3}
        />
      </div>
    </div>
  );
}

function CompetitiveAngleForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Project Description</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="Describe your project in 1-2 sentences"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Competitors</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="List similar projects/products (optional)"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Target Audience</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., developers, designers, startups"
        />
      </div>
    </div>
  );
}

function CodeBootstrapperForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Language/Framework</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., React, Python, Express.js"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">What You're Building</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="Describe the functionality you need"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Special Requirements</Label>
        <Input
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="e.g., authentication, database connection"
        />
      </div>
    </div>
  );
}