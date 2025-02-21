
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Settings,
  Home,
  Image,
  Palette,
  Info
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';

interface NavigationProps {
  onColorSelect: (background: string, text: string) => void;
  onMagicOptimization: () => void;
  onViewModeChange: (mode: 'full' | 'fast') => void;
  viewMode: 'full' | 'fast';
}

const Navigation: React.FC<NavigationProps> = ({
  onColorSelect,
  onMagicOptimization,
  onViewModeChange,
  viewMode
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => onViewModeChange(viewMode === 'full' ? 'fast' : 'full')}
          >
            <Home className="mr-2 h-4 w-4" />
            {viewMode === 'full' ? 'Modalità Semplificata' : 'Modalità Completa'}
          </Button>

          <Separator />

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={onMagicOptimization}
          >
            <Image className="mr-2 h-4 w-4" />
            Ottimizza Layout
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => onColorSelect('#1a1a1a', '#ffffff')}
          >
            <Palette className="mr-2 h-4 w-4" />
            Cambia Colori
          </Button>

          <Separator />

          <div className="fixed bottom-4 left-0 right-0 px-6">
            <Button variant="ghost" className="w-full justify-start">
              <Info className="mr-2 h-4 w-4" />
              Versione 1.0
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Navigation;
