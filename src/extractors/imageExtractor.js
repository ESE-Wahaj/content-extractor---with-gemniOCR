import { callGeminiAPI } from '../services/apiService.js';
// The original Tesseract dependencies (loadTesseract, readFileAsDataURL) are no longer needed.

/**
 * Extracts content from an image file using the Gemini Multimodal API for high-accuracy OCR.
 * This is superior for complex images, printed text, and handwriting.
 * @param {File} file The image file object.
 * @param {function(string)} onProgress Callback for progress updates.
 * @returns {Promise<string>} The extracted text content.
 */
export const extractImageContent = async (file, onProgress) => {
  try {
    onProgress?.('Sending image to AI for robust OCR...');
    
    // Prompt tailored for robust, high-quality OCR (including handwriting)
    const prompt = 'Perform high-accuracy Optical Character Recognition (OCR) on this image. Extract all text, including any handwriting, printed characters, or text within objects. Return ONLY the raw, extracted text content in English.';

    // callGeminiAPI handles file reading, Base64 encoding, and API calls internally
    const text = await callGeminiAPI(file, prompt, onProgress);
    
    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the image by the AI. The image may not contain readable text or handwriting.');
    }
    
    onProgress?.('Image extraction complete (via AI)');
    return text;
  } catch (error) {
    throw new Error(`Image extraction failed via AI service: ${error.message}`);
}
}; 