export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dwe66cwnj/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "usermanagement";

  const formData = new FormData();
  formData.append("file", file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.secure_url) {
      throw new Error("Image upload failed - no URL returned");
    }
    
    return data.secure_url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Image upload failed");
  }
};