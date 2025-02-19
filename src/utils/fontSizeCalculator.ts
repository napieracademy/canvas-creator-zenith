
export const calculateOptimalSizes = (title: string, description: string) => {
  // Calcola il font size del titolo in base alla lunghezza
  let titleFontSize = 111; // Default size
  const titleLength = title.length;
  
  if (titleLength > 50) {
    titleFontSize = 56;
  } else if (titleLength > 30) {
    titleFontSize = 72;
  } else if (titleLength > 20) {
    titleFontSize = 88;
  }

  // Calcola il font size della descrizione
  let descriptionFontSize = 56; // Default size
  const descriptionLength = description.length;
  
  if (descriptionLength > 200) {
    descriptionFontSize = 32;
  } else if (descriptionLength > 100) {
    descriptionFontSize = 40;
  } else if (descriptionLength > 50) {
    descriptionFontSize = 48;
  }

  // Calcola lo spazio tra titolo e descrizione
  let spacing = 100; // Default spacing
  
  // Aumenta lo spazio se entrambi i testi sono corti
  if (titleLength < 20 && descriptionLength < 50) {
    spacing = 120;
  }
  // Riduci lo spazio se uno dei testi è lungo
  else if (titleLength > 30 || descriptionLength > 100) {
    spacing = 80;
  }

  return {
    titleFontSize,
    descriptionFontSize,
    spacing
  };
};
