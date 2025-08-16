import React, {
  forwardRef,
  useState,
  useRef,
  useCallback,
  HTMLAttributes,
} from 'react';
import {
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/cn';

// --- Types ---
export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error' | 'pending';
  error?: string;
  preview?: string;
}

// Fix: Remove 'onError' from Omit, and add it after, so it doesn't conflict with HTMLAttributes
type DivProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onError'
>;

export interface UploadProps extends DivProps {
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  dragAndDrop?: boolean;
  showPreview?: boolean;
  showProgress?: boolean;
  showFileList?: boolean;
  onFileSelect?: (files: File[]) => void;
  onFileUpload?: (files: UploadFile[]) => Promise<void>;
  onChange?: (files: UploadFile[]) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

const Upload = forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      className,
      multiple = false,
      accept,
      maxSize,
      maxFiles = 10,
      disabled = false,
      dragAndDrop = true,
      showPreview = true,
      showProgress = true,
      showFileList = true,
      onFileSelect,
      onFileUpload,
      onChange,
      onError,
      placeholder = 'Drop files here or click to browse',
      helperText,
      error,
      variant = 'default',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Utility functions ---
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
      if (fileType.startsWith('image/')) {
        return <PhotoIcon className="h-8 w-8 text-blue-500" />;
      } else if (fileType.startsWith('video/')) {
        return <FilmIcon className="h-8 w-8 text-purple-500" />;
      } else if (fileType.startsWith('audio/')) {
        return <MusicalNoteIcon className="h-8 w-8 text-green-500" />;
      } else {
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
      }
    };

    const getVariantClasses = () => {
      const baseClasses =
        'border-2 border-dashed rounded-lg transition-colors duration-200';

      const variantClasses: Record<string, string> = {
        default:
          'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800',
        outlined: 'border-gray-300 bg-transparent dark:border-gray-600',
        filled:
          'border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700',
      };

      const stateClasses = {
        default:
          'hover:border-gray-400 hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-700',
        dragOver:
          'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20',
        error:
          'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20',
        disabled: 'opacity-50 cursor-not-allowed',
      };

      return cn(
        baseClasses,
        variantClasses[variant],
        error
          ? stateClasses.error
          : isDragOver
          ? stateClasses.dragOver
          : stateClasses.default,
        disabled && stateClasses.disabled
      );
    };

    const getSizeClasses = () => {
      const sizeClasses: Record<string, string> = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      };
      return sizeClasses[size];
    };

    // --- File validation ---
    const validateFile = (file: File): string | undefined => {
      if (maxSize && file.size > maxSize) {
        return `File size exceeds ${formatFileSize(maxSize)}`;
      }
      if (accept) {
        const acceptedTypes = accept.split(',').map((type) => type.trim());
        const fileType = file.type;
        const fileName = file.name;

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith('.')) {
            return fileName.toLowerCase().endsWith(type.toLowerCase());
          } else if (type.includes('*')) {
            // Fix: Use RegExp escape for pattern
            const pattern = type.replace(/\*/g, '.*');
            return new RegExp(pattern).test(fileType);
          } else {
            return fileType === type;
          }
        });

        if (!isAccepted) {
          return `File type not supported. Accepted types: ${accept}`;
        }
      }
      return undefined;
    };

    // --- File creation ---
    const createUploadFile = (file: File): UploadFile => {
      const error = validateFile(file);
      const preview =
        file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: error ? 'error' : 'pending',
        error,
        preview,
      };
    };

    // --- File selection handler ---
    const handleFileSelect = useCallback(
      (selectedFiles: FileList | File[]) => {
        const fileArray = Array.from(selectedFiles);

        if (fileArray.length + files.length > maxFiles) {
          onError?.(`Maximum ${maxFiles} files allowed`);
          return;
        }

        const newFiles = fileArray.map(createUploadFile);
        const updatedFiles = [...files, ...newFiles];

        setFiles(updatedFiles);
        onFileSelect?.(fileArray);
        onChange?.(updatedFiles);
      },
      [files, maxFiles, onFileSelect, onChange, onError]
    );

    // --- Input change handler ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles) {
        handleFileSelect(selectedFiles);
        e.target.value = '';
      }
    };

    // --- Drag and drop handlers ---
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (dragAndDrop && !disabled) {
        setIsDragOver(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (dragAndDrop && !disabled) {
        const droppedFiles = e.dataTransfer.files;
        handleFileSelect(droppedFiles);
      }
    };

    // --- Click handler ---
    const handleClick = () => {
      if (!disabled) {
        fileInputRef.current?.click();
      }
    };

    // --- Remove file handler ---
    const removeFile = (fileId: string) => {
      const updatedFiles = files.filter((f) => f.id !== fileId);
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    };

    // --- Upload files handler ---
    const uploadFiles = async () => {
      if (!onFileUpload || isUploading) return;

      setIsUploading(true);
      const pendingFiles = files.filter((f) => f.status === 'pending');

      try {
        await onFileUpload(pendingFiles);
      } catch (err: any) {
        onError?.(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    };

    // --- Render ---
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {/* Upload Area */}
        <div
          className={cn(
            getVariantClasses(),
            getSizeClasses(),
            'text-center cursor-pointer'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />

          <CloudArrowUpIcon
            className={cn(
              'mx-auto text-gray-400',
              size === 'sm'
                ? 'h-8 w-8'
                : size === 'md'
                ? 'h-12 w-12'
                : 'h-16 w-16'
            )}
          />

          <p
            className={cn(
              'mt-2 text-sm font-medium text-gray-900 dark:text-gray-100',
              size === 'sm' ? 'text-sm' : 'text-base'
            )}
          >
            {placeholder}
          </p>

          {helperText && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}

          {error && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {accept && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Accepted formats: {accept}
            </p>
          )}

          {maxSize && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Max file size: {formatFileSize(maxSize)}
            </p>
          )}
        </div>

        {/* File List */}
        {showFileList && files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={cn(
                  'flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg',
                  file.status === 'error' &&
                    'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                )}
              >
                {/* File Icon */}
                <div className="flex-shrink-0 mr-3">{getFileIcon(file.type)}</div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>

                  {file.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {file.error}
                    </p>
                  )}

                  {/* Progress Bar */}
                  {showProgress && file.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {file.progress}% uploaded
                      </p>
                    </div>
                  )}
                </div>

                {/* File Preview */}
                {showPreview && file.preview && (
                  <div className="flex-shrink-0 ml-3">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="ml-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {onFileUpload && files.some((f) => f.status === 'pending') && (
          <div className="mt-4">
            <button
              type="button"
              onClick={uploadFiles}
              disabled={isUploading || disabled}
              className={cn(
                'w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium',
                'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'dark:focus:ring-offset-gray-900',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors duration-200'
              )}
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        )}
      </div>
    );
  }
);

Upload.displayName = 'Upload';

export default Upload;
