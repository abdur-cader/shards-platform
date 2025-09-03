// app/(sidebar)/user/ai-toolkit/ToolGrid.tsx
"use client";
import { tools } from "./constants";
import AiToolkitCard from "@/components/AiToolkitCard";
import { useState } from "react";
import IdeaGeneratorModal from "./services/IdeaGeneratorModal";
import StackRecommenderModal from "./services/StackRecommenderModal";
import ReadmeBuilderModal from "./services/ReadmeBuilderModal";
import CompetitiveAngleModal from "./services/CompetitiveAngleModal";
// import CodeBootstrapperModal from "./services/CodeBootstrapperModal";

export default function ToolGrid() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenModal = (slug: string) => setActiveModal(slug);
  const handleCloseModal = () => setActiveModal(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
      {/* Subtle purple glow behind the grid */}
      <div className="absolute inset-0 bg-purple-900/10 blur-xl rounded-full transform scale-125 -z-10"></div>

      {tools.map((tool) => (
        <AiToolkitCard
          key={tool.slug}
          title={tool.title}
          description={tool.description}
          icon={tool.icon}
          action={() => handleOpenModal(tool.slug)}
        />
      ))}

      {activeModal === "idea-generator" && (
        <IdeaGeneratorModal onClose={handleCloseModal} />
      )}
      {activeModal === "stack-recommender" && (
        <StackRecommenderModal onClose={handleCloseModal} />
      )}
      {activeModal === "readme-builder" && (
        <ReadmeBuilderModal onClose={handleCloseModal} />
      )}
      {activeModal === "competitive-angle" && (
        <CompetitiveAngleModal onClose={handleCloseModal} />
      )}
    </div>
  );
}
