
import React from 'react';
import { ColorRow } from '../types';

interface ColorPreviewTableProps {
  data: ColorRow[];
}

export const ColorPreviewTable: React.FC<ColorPreviewTableProps> = ({ data }) => {
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">实时预览 (D列填充结果)</h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">行号</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">B列 (色值)</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100 text-center">D列 (填充预览)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.slice(0, 100).map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">#{item.row}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-indigo-600 font-semibold">{item.hex}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(item.hex)}
                      className="text-slate-300 hover:text-indigo-400 transition-colors"
                      title="复制色码"
                    >
                      <i className="fas fa-copy text-xs"></i>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div 
                    className="h-8 w-full rounded-md shadow-inner border border-black/5 flex items-center justify-center text-[10px] font-bold tracking-tighter"
                    style={{ backgroundColor: item.preview, color: getContrastYIQ(item.preview) }}
                  >
                    PREVIEW
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 100 && (
        <div className="p-3 bg-indigo-50 text-center text-xs text-indigo-600 font-medium">
          仅显示前 100 条记录（共 {data.length} 条）
        </div>
      )}
    </div>
  );
};

function getContrastYIQ(hexcolor: string){
  hexcolor = hexcolor.replace("#", "");
  var r = parseInt(hexcolor.substr(0,2),16);
  var g = parseInt(hexcolor.substr(2,2),16);
  var b = parseInt(hexcolor.substr(4,2),16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? 'black' : 'white';
}
