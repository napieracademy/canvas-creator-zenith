
export const isValidImageUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => path.endsWith(ext));
  } catch {
    return false;
  }
};

export const handleImageUrl = async (imageUrl: string) => {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};
