import React from 'react';
import { AiToolsLibrary } from '../AiToolsLibrary';

interface CreativeAiEcosystemProps {
  onSelectToolForProject?: (toolName: string) => void;
}

export const CreativeAiEcosystem: React.FC<CreativeAiEcosystemProps> = ({
  onSelectToolForProject
}) => {
  return (
    <div className="pt-2">
      <AiToolsLibrary onSelectToolForProject={onSelectToolForProject} />
    </div>
  );
};
