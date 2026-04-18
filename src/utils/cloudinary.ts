export function getCloudinaryUrl(url: string | undefined, transformations: string = 'f_auto,q_auto'): string {
  if (!url) return '';
  // Check if it's already a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) return url;
  
  // Si la URL ya tiene alguna transformación manual justo de upload/, esto podría empalmar,
  // pero típicamente se guardan como /image/upload/v1234/
  // Las reemplazamos agregando nuestra transformación deseada
  return url.replace('/upload/', `/upload/${transformations}/`);
}
