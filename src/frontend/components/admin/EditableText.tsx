'use client';

import { useState, useRef, useEffect } from 'react';
import { useEditMode } from './EditModeProvider';
import { CheckCircle2, X, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveContentItem } from '@/lib/contentStore';

interface EditableTextProps {
  value: string;
  table: string;
  idColumn: string;
  idValue: string;
  updateColumn: string;
  className?: string;
  multiline?: boolean;
}

export function EditableText({
  value: initialValue,
  idValue,
  className,
}: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [mounted, setMounted] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync if initialValue changes externally
  useEffect(() => {
    if (!isEditing) setValue(initialValue || '');
  }, [initialValue, isEditing]);

  const handleSave = async () => {
    const textToSave = spanRef.current ? spanRef.current.innerText : value;
    setStatus('saving');

    try {
      await saveContentItem(idValue, 'text', textToSave);

      setValue(textToSave);
      setStatus('saved');

      setTimeout(() => {
        setStatus('idle');
        setIsEditing(false);
      }, 1200);
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const handleCancel = () => {
    setValue(initialValue || '');
    if (spanRef.current) spanRef.current.innerText = initialValue || '';
    setIsEditing(false);
    setStatus('idle');
  };

  // Prevent hydration mismatch between SSR server text and client localStorage text
  const displayValue = mounted ? value : (initialValue || '');

  if (!isEditMode) {
    return <span className={className} suppressHydrationWarning>{displayValue}</span>;
  }

  return (
    <span className="relative inline-block group/editable">
      <span
        ref={spanRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        suppressHydrationWarning
        onInput={(e) => setValue(e.currentTarget.innerText)}
        onClick={() => {
          if (!isEditing) setIsEditing(true);
        }}
        className={cn(
          "transition-all duration-200 outline-none cursor-text",
          className,
          !isEditing && "group-hover/editable:bg-emerald-500/20 group-hover/editable:ring-2 group-hover/editable:ring-emerald-500/40 rounded-sm px-1",
          isEditing && "bg-white/90 dark:bg-black/90 text-foreground ring-2 ring-emerald-500 rounded-sm px-1.5 shadow-lg"
        )}
      >
        {displayValue}
      </span>

      {/* Floating Save Toolbar */}
      {isEditing && (
        <span 
          contentEditable={false}
          className="absolute -top-12 left-0 z-50 flex items-center gap-1.5 p-1.5 bg-white dark:bg-zinc-900 border border-emerald-500/30 rounded-xl shadow-2xl"
        >
          {status === 'saving' && (
            <span className="px-2 text-xs font-medium animate-pulse text-muted-foreground">Saving...</span>
          )}
          {status === 'saved' && (
            <span className="flex items-center gap-1 px-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved Live!
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1 px-2 text-xs font-medium text-destructive">
              <AlertCircle className="w-3.5 h-3.5" /> Error
              <button onClick={handleSave} className="ml-2 underline">Retry</button>
            </span>
          )}
          
          {status === 'idle' && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                title="Save changes"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                className="p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </span>
      )}
    </span>
  );
}
