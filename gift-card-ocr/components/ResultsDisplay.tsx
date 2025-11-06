import React, { useState, useCallback } from 'react';
import type { GiftCardData } from '../types';
import { Icon } from './icons';

interface ResultsDisplayProps {
  data: GiftCardData[];
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [textToCopy]);

    return (
        <button
            onClick={handleCopy}
            className={`p-1.5 rounded-md transition-colors ${
                copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
            aria-label="複製"
        >
            {copied ? <Icon icon="check" className="w-4 h-4" /> : <Icon icon="copy" className="w-4 h-4" />}
        </button>
    );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {

    const copyAllAsTSV = useCallback(() => {
        const header = "檔案名稱\t序號\t密碼\n";
        const rows = data.map(item => `${item.fileName}\t${item.serialNumber}\t${item.password}`).join('\n');
        navigator.clipboard.writeText(header + rows);
    }, [data]);


  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">提取結果</h2>
            <button onClick={copyAllAsTSV} className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
                <Icon icon="copy" className="w-4 h-4" />
                <span>複製全部 (TSV)</span>
            </button>
        </div>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                    <th scope="col" className="px-6 py-3 w-24">預覽</th>
                    <th scope="col" className="px-6 py-3">檔案名稱</th>
                    <th scope="col" className="px-6 py-3">序號</th>
                    <th scope="col" className="px-6 py-3">密碼</th>
                    <th scope="col" className="px-6 py-3">狀態</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                <tr key={item.id} className="bg-white border-b last:border-b-0 hover:bg-slate-50">
                    <td className="p-2">
                        <img src={item.imagePreviewUrl} alt={item.fileName} className="w-20 h-20 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{item.fileName}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded">{item.serialNumber}</span>
                            <CopyButton textToCopy={item.serialNumber} />
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded">{item.password}</span>
                            <CopyButton textToCopy={item.password} />
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        {item.status === 'success' && <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">成功</span>}
                        {item.status === 'pending' && <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">處理中...</span>}
                        {item.status === 'error' && <span title={item.errorMessage} className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full cursor-help">失敗</span>}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};