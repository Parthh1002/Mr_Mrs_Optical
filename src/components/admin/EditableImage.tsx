'use client';

import { useState, forwardRef, useRef } from 'react';
import { useEditMode } from './EditModeProvider';
import { Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveContentItem } from '@/lib/contentStore';

interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  table: string;
  idColumn: string;
  idValue: string;
  updateColumn: string;
  bucket?: string;
  fallbackSrc?: string;
}

export const EditableImage = forwardRef<HTMLImageElement, EditableImageProps>(({
  src,
  idValue,
  className,
  fallbackSrc,
  ...props
}, ref) => {
  const { isEditMode } = useEditMode();
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync src if changed externally
  if (src && src !== currentSrc && !isUploading) {
    setCurrentSrc(src);
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus('idle');
    try {
      // Create local object URL / base64 preview immediately
      const reader = new FileReader();
      reader.onload = async (event) => {
        const localDataUrl = event.target?.result as string;
        if (localDataUrl) {
          setCurrentSrc(localDataUrl);
          await saveContentItem(idValue, 'image', localDataUrl);
          setStatus('success');
          toast.success('Image updated live!');
          setTimeout(() => setStatus('idle'), 2000);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setStatus('error');
      toast.error('Failed to update image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const imageElement = (
    <img 
      ref={ref}
      src={currentSrc}
      className={className}
      {...props}
    />
  );

  if (!isEditMode) {
    return imageElement;
  }

  return (
    <div className="relative group/editimage w-full h-full block">
      {imageElement}
      
      {/* Edit Overlay */}
      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/editimage:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px] z-20">
        <div className="bg-white/90 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 text-black shadow-xl hover:scale-105 transition-transform">
          {isUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
          ) : status === 'success' ? (
            <><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Saved Live!</>
          ) : (
            <><Upload className="w-4 h-4" /> Change Image</>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*" 
          className="hidden" 
          onChange={handleUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
});

EditableImage.displayName = 'EditableImage';
