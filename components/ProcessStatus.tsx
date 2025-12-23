
import React from 'react';
import { ProcessResult } from '../types';

interface ProcessStatusProps {
  result: ProcessResult;
  onDownload: () => void;
}

export const ProcessStatus: React.FC<ProcessStatusProps> = ({ result, onDownload }) => {
  if (!result.success) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
        <i className="fas fa-exclamation-circle text-red-500 mt-1"></i>
        <div className="text-red-700">
          <p className="font-bold">转换过程中出现错误</p>
          <p className="text-sm mt-1">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start space-x-3">
        <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
        <div className="text-emerald-700 flex-grow">
          <p className="font-bold">文件处理成功！</p>
          <p className="text-sm mt-1">
            成功处理了 <span className="font-mono font-bold">{result.rowCount}</span> 个颜色项。已为您动态生成了对应的 XML 样式定义并注入到预览列。
          </p>
        </div>
      </div>

      <button
        onClick={onDownload}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-3"
      >
        <i className="fas fa-download"></i>
        <span>下载已填充的电子表格</span>
      </button>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">文件信息</h4>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 truncate mr-4">{result.fileName}</span>
          <span className="text-indigo-600 font-mono">Ready for use</span>
        </div>
      </div>
    </div>
  );
};
