export const extractAndProcessImages = (quillContent: string) => {
    const imageRegex = /<img[^>]+src="data:image\/(png|jpeg|jpg|gif);base64,[^">]+"[^>]*>/g; // Match base64 images
    const localImages: string[] = [];
    let match;
  
    // Extract all base64 image data
    while ((match = imageRegex.exec(quillContent)) !== null) {
      localImages.push(match[0]); // Add base64 image tag to the array
    }
  
    // Replace base64 images with placeholders (can be modified later)
    // const cleanedContent = quillContent.replace(imageRegex, "<img src='' alt='image'>");
    const cleanedContent = quillContent.replace(imageRegex, " ");
  
    return { cleanedContent, localImages };
  };
  