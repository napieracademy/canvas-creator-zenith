import React from 'react';
import FeatureManager from './utils/featureManager';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Registriamo la variante no-logo
FeatureManager.addVariant({
  id: 'no-logo',
  code: `
    // Rimuove la funzionalità del logo sia dal Sidebar che dal Canvas
    - Sidebar: rimozione input file per upload logo
    - Canvas: disabilitazione funzione drawLogo
  `,
  description: 'Disabilita la funzionalità del logo',
  location: 'Sidebar',
  isEnabled: true
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
