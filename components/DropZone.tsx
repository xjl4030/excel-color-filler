
import React, { useRef, useState } from 'react';

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelected, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <div
      onClick={disabled ? undefined : handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 cursor-pointer text-center
        ${isDragging ? 'border-indigo-600 bg-indigo-50 scale-[1.02]' : 'border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-white'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xml,.xlsx,.xls"
      />
      <div className="flex flex-col items-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-colors ${isDragging ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-500'}`}>
          <i className="fas fa-file-arrow-up text-xl"></i>
        </div>
        <p className="text-slate-700 font-bold mb-1">
          {isDragging ? '松开以解析文件' : '点击或拖拽 Excel 文件'}
        </p>
        <p className="text-slate-400 text-xs font-medium">支持 XLSX, XLS 或 XML</p>
      </div>
    </div>
  );
};
