
type FeatureVariant = {
  id: string;
  code: string;
  description: string;
  location: string;
  isEnabled: boolean;
};

class FeatureManager {
  private static variants: FeatureVariant[] = [];

  static addVariant(variant: FeatureVariant) {
    this.variants.push(variant);
    console.log(`Variant ${variant.id} registered for ${variant.location}`);
  }

  static getVariantsForLocation(location: string): FeatureVariant[] {
    return this.variants.filter(v => 
      v.location === location && v.isEnabled
    );
  }

  static enableVariant(id: string) {
    const variant = this.variants.find(v => v.id === id);
    if (variant) {
      variant.isEnabled = true;
      console.log(`Variant ${id} enabled`);
    }
  }

  static disableVariant(id: string) {
    const variant = this.variants.find(v => v.id === id);
    if (variant) {
      variant.isEnabled = false;
      console.log(`Variant ${id} disabled`);
    }
  }
}

export default FeatureManager;
