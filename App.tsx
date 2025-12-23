
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { ProcessStatus } from './components/ProcessStatus';
import { ColorPreviewTable } from './components/ColorPreviewTable';
import { processExcelXml } from './services/xmlProcessor';
import { ProcessResult } from './types';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const processingResult = await processExcelXml(file);
      setResult(processingResult);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "文件解析失败，请确保表格符合规范（B列为十六进制色码）。"
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const downloadFile = () => {
    if (result?.blob && result.fileName) {
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="h-2 w-full animate-gradient"></div>
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Header />
        
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload and Instructions */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <i className="fas fa-file-excel text-9xl"></i>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-slate-800 flex items-center mb-4">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-sm">
                    <i className="fas fa-magic"></i>
                  </span>
                  转换配置
                </h2>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  上传您的 Excel 文件，我们将读取 <strong className="text-indigo-600">B 列</strong> 的色值，
                  并自动在 <strong className="text-emerald-600">D 列</strong> 生成带背景色的预览单元格。
                </p>

                <DropZone onFileSelected={handleFileUpload} disabled={isProcessing} />

                {isProcessing && (
                  <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-indigo-600 font-medium text-sm">解析中，请稍候...</p>
                  </div>
                )}

                {result && <ProcessStatus result={result} onDownload={downloadFile} />}
              </div>
            </section>

            <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="font-bold mb-4 flex items-center">
                <i className="fas fa-info-circle mr-2 text-indigo-400"></i>
                使用技巧
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start">
                  <i className="fas fa-check text-indigo-400 mt-1 mr-3"></i>
                  <span>支持 <strong>.xlsx</strong>, <strong>.xls</strong>, <strong>.xml</strong> 格式</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-indigo-400 mt-1 mr-3"></i>
                  <span>色码支持格式：#FFFFFF 或 0xFFFFFF</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-indigo-400 mt-1 mr-3"></i>
                  <span>导出的 XML 2003 文件可直接用 Excel 预览填充色</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column: Visual Preview */}
          <div className="lg:col-span-7">
            {result?.previewData ? (
              <ColorPreviewTable data={result.previewData} />
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 text-center bg-white/50">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-table text-3xl"></i>
                </div>
                <h3 className="font-bold text-slate-600">等待数据上传</h3>
                <p className="text-sm max-w-xs mt-2">上传文件后，此处将实时展示网页版的颜色预览列表</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
