
export const calculateOptimalSizes = (title: string, description: string) => {
  // Calcola il font size del titolo in base alla lunghezza
  let titleFontSize = 120; // Default size più grande per mobile
  const titleLength = title.length;
  
  if (titleLength > 50) {
    titleFontSize = 72; // Minimo 72px per garantire leggibilità
  } else if (titleLength > 30) {
    titleFontSize = 88;
  } else if (titleLength > 20) {
    titleFontSize = 96;
  }

  // Calcola il font size della descrizione
  let descriptionFontSize = 72; // Default size più grande per mobile
  const descriptionLength = description.length;
  
  if (descriptionLength > 200) {
    descriptionFontSize = 48; // Minimo 48px per garantire leggibilità
  } else if (descriptionLength > 100) {
    descriptionFontSize = 56;
  } else if (descriptionLength > 50) {
    descriptionFontSize = 64;
  }

  // Calcola lo spazio tra titolo e descrizione
  let spacing = 120; // Default spacing più ampio
  
  // Aumenta lo spazio se entrambi i testi sono corti
  if (titleLength < 20 && descriptionLength < 50) {
    spacing = 160;
  }
  // Riduci lo spazio se uno dei testi è lungo, ma mantieni comunque una buona spaziatura
  else if (titleLength > 30 || descriptionLength > 100) {
    spacing = 100;
  }

  return {
    titleFontSize,
    descriptionFontSize,
    spacing
  };
};
