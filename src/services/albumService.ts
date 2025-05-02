import api from './api';

export interface Album {
  id: string;
  _id?: string;
  title: string;
  photographerName?: string;
  coverImage: string;
  coverImagePublicId?: string;
  images: { id: string; url: string; publicId?: string }[];
  createdAt: string;
  updatedAt?: string;
  isPasswordProtected?: boolean;
}

// Format album data from API to client format
const formatAlbum = (album: any): Album => {
  return {
    id: album._id,
    title: album.title,
    photographerName: album.photographerName,
    coverImage: album.coverImage,
    coverImagePublicId: album.coverImagePublicId,
    images: album.images.map((img: any) => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId
    })),
    createdAt: album.createdAt,
    updatedAt: album.updatedAt,
    isPasswordProtected: album.isPasswordProtected
  };
};

// Format album data from client to API format
const formatAlbumForAPI = (album: Album): any => {
  return {
    title: album.title,
    photographerName: album.photographerName,
    coverImage: album.coverImage,
    coverImagePublicId: album.coverImagePublicId,
    images: album.images.map((img) => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId
    }))
  };
};

// Get all albums
export const getAllAlbums = async (): Promise<Album[]> => {
  try {
    const response = await api.get('/albums');
    return response.data.map(formatAlbum);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
};

// Get album by ID
export const getAlbumById = async (id: string): Promise<Album | undefined> => {
  try {
    const response = await api.get(`/albums/${id}`);
    return formatAlbum(response.data);
  } catch (error) {
    console.error(`Error fetching album ${id}:`, error);
    return undefined;
  }
};

// Verify album password
export const verifyAlbumPassword = async (
  albumId: string, 
  password: string
): Promise<{ success: boolean; message: string; album?: Album }> => {
  try {
    const response = await api.post(`/albums/${albumId}/verify-password`, { password });
    return {
      success: response.data.success,
      message: response.data.message,
      album: response.data.album ? formatAlbum(response.data.album) : undefined
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to verify password'
    };
  }
};

// Create a new album with optional password
export const saveAlbum = async (album: Album, password?: string): Promise<Album | undefined> => {
  try {
    // Start with basic album data
    const albumData = formatAlbumForAPI(album);
    
    // Add password if provided
    if (password) {
      albumData.password = password;
    }

    console.log('Sending album data to server:', { 
      ...albumData, 
      password: password ? '[REDACTED]' : undefined,
      hasPassword: !!password
    });
    
    const response = await api.post('/albums', albumData);
    return formatAlbum(response.data);
  } catch (error) {
    console.error('Error saving album:', error);
    return undefined;
  }
};

// Update album password
export const updateAlbumPassword = async (
  albumId: string,
  newPassword?: string,
  removePassword?: boolean
): Promise<Album | undefined> => {
  try {
    const data: any = {};
    
    if (newPassword) {
      data.password = newPassword;
    }
    
    if (removePassword) {
      data.removePassword = true;
    }
    
    const response = await api.put(`/albums/${albumId}`, data);
    return formatAlbum(response.data);
  } catch (error) {
    console.error(`Error updating album password ${albumId}:`, error);
    return undefined;
  }
};

// Update an existing album
export const updateAlbum = async (album: Album): Promise<Album | undefined> => {
  try {
    const response = await api.put(`/albums/${album.id}`, {
      title: album.title,
      photographerName: album.photographerName
    });
    return formatAlbum(response.data);
  } catch (error) {
    console.error(`Error updating album ${album.id}:`, error);
    return undefined;
  }
};

// Delete an album
export const deleteAlbum = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/albums/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting album ${id}:`, error);
    return false;
  }
};

// Add image to album
export const addImageToAlbum = async (
  albumId: string,
  image: { id: string; url: string; publicId: string }
): Promise<Album | undefined> => {
  try {
    const response = await api.post(`/albums/${albumId}/images`, image);
    return formatAlbum(response.data);
  } catch (error) {
    console.error(`Error adding image to album ${albumId}:`, error);
    return undefined;
  }
};

// Remove image from album
export const removeImageFromAlbum = async (
  albumId: string,
  imageId: string
): Promise<Album | undefined> => {
  try {
    const response = await api.delete(`/albums/${albumId}/images/${imageId}`);
    return formatAlbum(response.data);
  } catch (error) {
    console.error(`Error removing image from album ${albumId}:`, error);
    return undefined;
  }
};

// Upload image to Cloudinary
export const uploadImage = async (
  file: File, 
  options?: { 
    signal?: AbortSignal; 
    onProgress?: (progress: number) => void 
  }
): Promise<{ id: string; url: string; publicId: string } | undefined> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    // Create config with extended timeout for large files
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 3600000, // Increase timeout to 1 hour for large files
      signal: options?.signal,
      onUploadProgress: options?.onProgress ? 
        (progressEvent: any) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          options.onProgress!(percentCompleted);
        } : undefined
    };

    const response = await api.post('/upload', formData, config);

    if (!response.data) {
      console.error('No response data received');
      throw new Error('No response data received from server');
    }

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleImages = async (
  files: File[],
  options?: { 
    signal?: AbortSignal; 
    onProgress?: (progress: number) => void 
  }
): Promise<{ id: string; url: string; publicId: string }[] | undefined> => {
  try {
    console.log(`Creating form data for ${files.length} files`);
    const formData = new FormData();
    
    // Add multiple files with the same field name
    files.forEach((file, index) => {
      console.log(`Adding file ${index+1}/${files.length} to form data: ${file.name} (${file.size} bytes)`);
      formData.append('images', file);
    });

    // Debug the FormData content
    console.log('FormData entries:');
    for (const pair of formData.entries()) {
      console.log(`- ${pair[0]}: ${pair[1] instanceof File ? pair[1].name : pair[1]}`);
    }

    console.log('Sending multiple files upload request to /upload/multiple');
    
    // Config with extended timeout and progress tracking
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 3600000, // Increase timeout to 1 hour for large files
      signal: options?.signal,
      onUploadProgress: options?.onProgress ? 
        (progressEvent: any) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          options.onProgress!(percentCompleted);
        } : undefined
    };
    
    const response = await api.post('/upload/multiple', formData, config);

    console.log('Multiple upload response status:', response.status);
    console.log('Multiple upload response data:', response.data);
    
    if (!response.data) {
      console.error('No response data received');
      throw new Error('No response data received from server');
    }
    
    if (!Array.isArray(response.data)) {
      console.error('Unexpected response format:', response.data);
      throw new Error('Server returned invalid data format');
    }
    
    if (response.data.length === 0) {
      console.error('Server returned empty array');
      throw new Error('No images were processed by the server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    throw new Error('Image upload failed');
  }
};
