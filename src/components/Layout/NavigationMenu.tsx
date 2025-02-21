
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Menu,
  Home,
  FileText,
  Save,
  Settings
} from 'lucide-react';

const NavigationMenu = () => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-50 bg-white hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/extracted-content')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Contenuto Estratto
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/saved-content')}
          >
            <Save className="mr-2 h-4 w-4" />
            Contenuti Salvati
          </Button>

          <Separator />

          <div className="fixed bottom-4 left-0 right-0 px-6">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Versione 1.0
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationMenu;
