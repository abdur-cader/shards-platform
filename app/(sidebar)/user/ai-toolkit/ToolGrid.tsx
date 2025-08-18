// app/(sidebar)/user/ai-toolkit/ToolGrid.tsx
"use client";
import { tools, type Tool } from "./constants";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      {/* {activeModal === "code-snippet-bootstrapper" && (
        <CodeBootstrapperModal onClose={handleCloseModal} />
      )} */}
    </div>
  );
}