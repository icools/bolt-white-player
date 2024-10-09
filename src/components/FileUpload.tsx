import React from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  accept: string;
  label: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, accept, label }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
    </div>
  );
};

export default FileUpload;