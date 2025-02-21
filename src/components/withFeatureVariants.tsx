
import React from 'react';
import FeatureManager from '@/utils/featureManager';

export function withFeatureVariants<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  location: string
) {
  return function WithFeatureVariantsComponent(props: P) {
    const variants = FeatureManager.getVariantsForLocation(location);
    
    // Qui potremmo iniettare il codice delle varianti
    // Per ora logghiamo solo le varianti attive
    console.log(`Active variants for ${location}:`, variants);

    return <WrappedComponent {...props} />;
  };
}
