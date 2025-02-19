
import React from 'react';
import { canvasTemplates } from '@/data/templates';
import { Button } from '@/components/ui/button';

interface TemplateSelectorProps {
  currentTemplate: 'klaus' | 'lucky';
  onTemplateChange: (template: 'klaus' | 'lucky') => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  currentTemplate,
  onTemplateChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-2 bg-background rounded-lg border">
      {canvasTemplates.map((template) => (
        <Button
          key={template.id}
          variant={currentTemplate === template.id ? "default" : "outline"}
          onClick={() => onTemplateChange(template.id)}
          className="w-full"
        >
          {template.name}
        </Button>
      ))}
    </div>
  );
};

export default TemplateSelector;
