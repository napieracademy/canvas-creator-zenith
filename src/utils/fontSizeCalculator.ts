
export const calculateOptimalSizes = (title: string, description: string, template: 'klaus' | 'lucky' = 'klaus') => {
  if (template === 'lucky') {
    // Calcola il font size del titolo per Lucky
    let titleFontSize = 96; // Default size per Lucky
    const titleLength = title.length;
    
    if (titleLength > 50) {
      titleFontSize = 64;
    } else if (titleLength > 30) {
      titleFontSize = 72;
    } else if (titleLength > 20) {
      titleFontSize = 84;
    }

    // Calcola il font size della descrizione per Lucky
    let descriptionFontSize = 56; // Default size più piccolo per Lucky
    const descriptionLength = description.length;
    
    if (descriptionLength > 200) {
      descriptionFontSize = 36;
    } else if (descriptionLength > 100) {
      descriptionFontSize = 42;
    } else if (descriptionLength > 50) {
      descriptionFontSize = 48;
    }

    // Calcola lo spacing ottimale per Lucky
    let spacing = 80;
    if (titleLength > 30 || descriptionLength > 100) {
      spacing = 60;
    }
    if (titleLength > 50 || descriptionLength > 200) {
      spacing = 40;
    }

    return {
      titleFontSize,
      descriptionFontSize,
      spacing
    };
  }

  // Klaus template mantiene le dimensioni originali
  let titleFontSize = 120;
  const titleLength = title.length;
  
  if (titleLength > 50) {
    titleFontSize = 72;
  } else if (titleLength > 30) {
    titleFontSize = 88;
  } else if (titleLength > 20) {
    titleFontSize = 96;
  }

  let descriptionFontSize = 72;
  const descriptionLength = description.length;
  
  if (descriptionLength > 200) {
    descriptionFontSize = 48;
  } else if (descriptionLength > 100) {
    descriptionFontSize = 56;
  } else if (descriptionLength > 50) {
    descriptionFontSize = 64;
  }

  let spacing = 120;
  
  if (titleLength < 20 && descriptionLength < 50) {
    spacing = 160;
  } else if (titleLength > 30 || descriptionLength > 100) {
    spacing = 100;
  }

  return {
    titleFontSize,
    descriptionFontSize,
    spacing
  };
};
