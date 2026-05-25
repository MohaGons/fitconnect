import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1, 
    maxWidthOrHeight: 800, 
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Erreur lors de la compression:', error);
    return file; 
  }
};

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const processFileToBase64 = async (file: File): Promise<string> => {
  const compressedFile = await compressImage(file);
  const base64 = await convertToBase64(compressedFile);
  return base64;
};
