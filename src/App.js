import React, { useState } from 'react';
// Changed imports to default imports (no curly braces) to fix module resolution errors
import FileUploader from './components/FileUploader.jsx'; // <- Changed
import FileInfo from './components/FileInfo.jsx'; // <- Changed
import ProgressIndicator from './components/ProgressIndicator.jsx'; // <- Changed
import ErrorDisplay from './components/ErrorDisplay.jsx'; // <- Changed
import ContentDisplay from './components/ContentDisplay.jsx'; // <- Changed
import { extractContent } from './services/extractionService.js';
import { sendToAPI, prepareAPIPayload } from './services/apiService.js';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedContent, setExtractedContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setExtractedContent('');
    setError('');
    setIsProcessing(true);
    
    try {
      const content = await extractContent(file, setProgressMessage);
      setExtractedContent(content);
      
      // Log the extracted content (ready for next module)
      console.log('Content extracted successfully:', {
        filename: file.name,
        contentLength: content.length,
        content: content
      });
    } catch (err) {
      console.error('Extraction error details:', err);
      
      // Provide user-friendly error messages
      let errorMessage = err.message;
      
      if (errorMessage.includes('Script error')) {
        errorMessage = 'Failed to load a required library. Please check your internet connection and try again.';
      } else if (errorMessage.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
      setProgressMessage('');
    }
  };
  
  const handleSendToAPI = async () => {
    if (!selectedFile || !extractedContent) return;
    
    try {
      setProgressMessage('Preparing data for API...');
      const payload = prepareAPIPayload(selectedFile, extractedContent);
      
      setProgressMessage('Sending to API...');
      const result = await sendToAPI(payload);
      
      console.log('API Response:', result);
      // Use a custom notification/modal instead of alert()
      setError('Content sent successfully! Check console for details.'); 
    } catch (err) {
      setError(err.message);
    } finally {
      setProgressMessage('');
    }
  };
  
  const handleClear = () => {
    setSelectedFile(null);
    setExtractedContent('');
    setError('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Hybrid Content Extractor
          </h1>
          <p className="text-gray-600">
            Extracts text from PDF, DOCX, TXT (Local) and Images (Gemini AI)
          </p>
        </div>
        
        <div className="space-y-6">
          {!selectedFile && (
            <FileUploader 
              onFileSelect={handleFileSelect} 
              isProcessing={isProcessing}
            />
          )}
          
          {selectedFile && (
            <FileInfo file={selectedFile} onClear={handleClear} />
          )}
          
          {isProcessing && progressMessage && (
            <ProgressIndicator message={progressMessage} />
          )}
          
          {error && (
            <ErrorDisplay error={error} onDismiss={() => setError('')} />
          )}
          
          {extractedContent && (
            <ContentDisplay 
              content={extractedContent} 
              onSendToAPI={handleSendToAPI}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;