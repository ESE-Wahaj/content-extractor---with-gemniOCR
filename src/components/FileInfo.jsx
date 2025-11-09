import React from 'react';
import { FileText, X } from 'lucide-react';
import { formatFileSize, getFileType } from '../utils/fileHelpers.js';

const FileInfo = ({ file, onClear }) => {
  const fileType = getFileType(file);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FileText className="text-blue-600" size={32} />
        <div>
          <h4 className="font-semibold text-gray-800">{file.name}</h4>
          <p className="text-sm text-gray-500">
            {fileType.toUpperCase()} • {formatFileSize(file.size)}
          </p>
          {/* Indicate when the extractor is using the new AI capability */}
          {fileType === 'image' && (
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full mt-1 inline-block">
              AI OCR Enabled
            </span>
          )}
        </div>
        </div>
      <button
        onClick={onClear}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X size={20} className="text-gray-500" />
      </button>
    </div>
  );
};

export default FileInfo;