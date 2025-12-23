
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4">
        <i className="fas fa-palette text-white text-3xl"></i>
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Excel Color Filler</h1>
      <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
        将配置表中的十六进制色码转换为直观的颜色填充预览
      </p>
    </header>
  );
};
