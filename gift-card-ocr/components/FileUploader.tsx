import * as React from 'https://aistudiocdn.com/react@^19.2.0';
import { Icon } from './icons';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  clearFiles: () => void;
  selectedFiles: File[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected, clearFiles, selectedFiles }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // FIX: Explicitly type `file` as `File` to resolve TypeScript error.
      const newFiles = Array.from(e.dataTransfer.files).filter((file: File) => file.type.startsWith('image/'));
      onFilesSelected(newFiles);
      e.dataTransfer.clearData();
    }
  }, [onFilesSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // FIX: Explicitly type `file` as `File` to resolve TypeScript error.
      const newFiles = Array.from(e.target.files).filter((file: File) => file.type.startsWith('image/'));
      onFilesSelected(newFiles);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ease-in-out ${
          isDragging ? 'border-sky-500 bg-sky-50' : 'border-slate-300 hover:border-sky-400 hover:bg-slate-100'
        }`}
      >
        <input ref={inputRef} type="file" multiple accept="image/*" onChange={handleChange} className="hidden" />
        <div className="flex flex-col items-center justify-center text-slate-500">
            <Icon icon="upload" className="w-12 h-12 mb-4 text-slate-400" />
            <p className="font-semibold">點擊或拖曳圖片到此處</p>
            <p className="text-sm mt-1">支援多張圖片上傳</p>
        </div>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">已選取 {selectedFiles.length} 張圖片</h3>
            <button
              onClick={clearFiles}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Icon icon="trash" className="w-4 h-4" />
              <span>全部清除</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative aspect-square border rounded-lg overflow-hidden shadow-sm">
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">{file.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
