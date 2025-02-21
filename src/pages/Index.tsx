
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileWarning from '@/components/Layout/MobileWarning';
import LoadingOverlay from '@/components/Layout/LoadingOverlay';
import MainContent from '@/components/Layout/MainContent';
import NavigationMenu from '@/components/Layout/NavigationMenu';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIndexState } from '@/hooks/useIndexState';
import { useIndexHandlers } from '@/hooks/useIndexHandlers';
import IndexSidebar from '@/components/Layout/IndexSidebar';

const IndexPage = () => {
  const isMobile = useIsMobile();
  const state = useIndexState();
  const handlers = useIndexHandlers(state);

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="relative">
      <NavigationMenu />
      <div className="flex items-center gap-2 absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={handlers.handleClean}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Ripristina
        </Button>
      </div>
      <div className="flex">
        {state.viewMode === 'full' && (
          <IndexSidebar
            sidebarOpen={state.sidebarOpen}
            setSidebarOpen={state.setSidebarOpen}
            state={state}
            handlers={handlers}
          />
        )}
        <MainContent
          text={state.text}
          description={state.description}
          backgroundColor={state.backgroundColor}
          textAlign={state.textAlign}
          descriptionAlign={state.descriptionAlign}
          textColor={state.textColor}
          fontSize={state.fontSize}
          descriptionFontSize={state.descriptionFontSize}
          spacing={state.spacing}
          showSafeZone={state.showSafeZone}
          format={state.format}
          currentFont={state.currentFont}
          isLoading={state.isLoading}
          credits={state.credits}
          viewMode={state.viewMode}
          logo={state.logo}
          onEffectiveFontSizeChange={state.setEffectiveFontSize}
          onShowSafeZoneChange={state.setShowSafeZone}
          onSpacingChange={state.setSpacing}
          onMagicOptimization={handlers.handleMagicOptimization}
          onDownload={handlers.handleDownload}
          onTextChange={state.setText}
          onDescriptionChange={state.setDescription}
          onTitleExtracted={state.setText}
          onDescriptionExtracted={handlers.handleDescriptionExtracted}
          onImageExtracted={handlers.handleImageExtracted}
          onTabChange={state.setActiveTab}
          onLoadingChange={state.setIsLoading}
          onFormatChange={state.setFormat}
          onViewModeChange={handlers.handleViewModeChange}
        />
      </div>
      {state.isLoading && <LoadingOverlay isLoading={state.isLoading} />}
    </div>
  );
};

export default IndexPage;
