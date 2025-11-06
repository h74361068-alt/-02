import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FileUploader } from './components/FileUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { extractGiftCardInfo } from './services/geminiService';
import type { GiftCardData } from './types';
import { Icon } from './components/icons';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<GiftCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('gemini-api-key', newKey);
  };

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    setError(null);
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setResults([]);
    setError(null);
  }, []);

  const processImages = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    if (!apiKey) {
      setError("請先輸入您的 Gemini API 金鑰。");
      return;
    }

    setIsLoading(true);
    setError(null);

    const initialData: GiftCardData[] = selectedFiles.map(file => ({
        id: `${file.name}-${file.lastModified}`,
        fileName: file.name,
        serialNumber: '...',
        password: '...',
        imagePreviewUrl: URL.createObjectURL(file),
        status: 'pending',
    }));
    setResults(initialData);

    for (const file of selectedFiles) {
        try {
            const extracted = await extractGiftCardInfo(file, apiKey);
            setResults(prev => prev.map(item => 
                item.id === `${file.name}-${file.lastModified}` 
                ? { ...item, ...extracted, status: 'success' } 
                : item
            ));
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : '未知錯誤';
            setError(errorMessage); // Show specific error to user
            setResults(prev => prev.map(item => 
                item.id === `${file.name}-${file.lastModified}` 
                ? { ...item, status: 'error', serialNumber: '錯誤', password: '錯誤', errorMessage } 
                : item
            ));
        }
    }

    setIsLoading(false);
  }, [selectedFiles, apiKey]);

  const progress = useMemo(() => {
    if (results.length === 0) return 0;
    const completed = results.filter(r => r.status === 'success' || r.status === 'error').length;
    return Math.round((completed / results.length) * 100);
  }, [results]);

  const isProcessButtonDisabled = isLoading || selectedFiles.length === 0 || !apiKey;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <Icon icon="card" className="w-8 h-8 text-sky-600" />
          <h1 className="text-2xl font-bold text-slate-800">點數卡序號密碼提取器</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">上傳點數卡圖片</h2>
                <p className="mt-4 text-lg text-slate-600">
                    使用 AI 技術，快速從圖片中讀取序號與密碼，告別手動輸入的繁瑣。
                </p>
            </div>
            
            <div className="w-full bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <label htmlFor="api-key" className="block text-sm font-medium text-slate-700">Gemini API 金鑰</label>
              <input
                type="password"
                id="api-key"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="在此貼上您的 API 金鑰"
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                您的金鑰將只會儲存在您的瀏覽器中，不會上傳到任何伺服器。
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline ml-1">
                  點此獲取金鑰
                </a>
              </p>
            </div>
          
            <FileUploader onFilesSelected={handleFilesSelected} clearFiles={clearFiles} selectedFiles={selectedFiles} />

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative w-full" role="alert">
                <strong className="font-bold">發生錯誤：</strong>
                <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            {selectedFiles.length > 0 && (
                <button
                    onClick={processImages}
                    disabled={isProcessButtonDisabled}
                    className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-sky-600 rounded-xl shadow-lg hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 ease-in-out"
                    title={!apiKey ? '請先輸入 API 金鑰' : ''}
                >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>處理中... ({progress}%)</span>
                    </>
                ) : (
                    <>
                        <Icon icon="bolt" className="w-6 h-6"/>
                        <span>開始提取 ({selectedFiles.length} 張)</span>
                    </>
                )}
                </button>
            )}

            {results.length > 0 && <ResultsDisplay data={results} />}
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Gift Card OCR. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
