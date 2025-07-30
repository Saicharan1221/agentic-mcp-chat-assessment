import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFilesUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const SUPPORTED_TYPES = [
  '.pdf', '.docx', '.csv', '.pptx', '.txt', '.md'
];

const FILE_TYPE_ICONS = {
  pdf: '📄',
  docx: '📝', 
  csv: '📊',
  pptx: '📊',
  txt: '📄',
  md: '📝'
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesUpload,
  maxFiles = 10,
  acceptedTypes = SUPPORTED_TYPES
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return acceptedTypes.includes(extension);
    });

    if (validFiles.length > 0) {
      onFilesUpload(validFiles);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-4 card-gradient border-dashed border-2 border-border hover:border-primary/50 transition-smooth">
      <div className="space-y-3">
        <div className="text-center">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-semibold text-sm">Upload Documents</h3>
          <p className="text-xs text-muted-foreground">
            Support for PDF, DOCX, CSV, PPTX, TXT, MD
          </p>
        </div>

        <Button 
          onClick={triggerFileSelect}
          variant="outline" 
          className="w-full"
          size="sm"
        >
          <FileText className="w-4 h-4 mr-2" />
          Choose Files
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-wrap gap-1">
          {SUPPORTED_TYPES.map(type => (
            <Badge key={type} variant="secondary" className="text-xs">
              {type.replace('.', '').toUpperCase()}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};