// app/(sidebar)/user/ai-toolkit/constants.ts
import { Brain, Code, FileText, FlaskConical, Terminal } from "lucide-react";

export const tools = [
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
//   {
//     slug: "code-snippet-bootstrapper",
//     title: "Code Bootstrapper",
//     description: "Generate starter code for common patterns",
//     icon: Terminal,
//   },
];

export type Tool = typeof tools[number];