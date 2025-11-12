const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Generates music from a voice file using the FastSAG backend.
 *
 * @param {File} voiceFile - The user's uploaded vocal track.
 * @returns {Promise<string>} A promise that resolves with the URL of the generated audio file.
 */
export const generateMusic = async (voiceFile: File): Promise<string> => {
  console.log(`Starting music generation for: ${voiceFile.name}`);

  try {
    // Create form data with the voice file
    const formData = new FormData();
    formData.append('file', voiceFile);

    // Send request to backend
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate music');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Music generation failed');
    }

    // Return the full URL for downloading the generated file
    const downloadUrl = `${API_BASE_URL}${data.download_url}`;
    console.log(`Music generation successful. Processing time: ${data.processing_time}s`);
    console.log(`Audio available at: ${downloadUrl}`);
    
    return downloadUrl;
  } catch (error) {
    console.error('Error generating music:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during music generation');
  }
};

/**
 * Check backend health status
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy' && data.models_loaded;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};
