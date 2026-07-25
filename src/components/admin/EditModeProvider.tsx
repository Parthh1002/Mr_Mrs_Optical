'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Pencil, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  toggleEditMode: () => {},
});

export function useEditMode() {
  return useContext(EditModeContext);
}

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(true);

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode: () => setIsEditMode(!isEditMode) }}>
      {children}
      
      {/* Floating Toggle Badge */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl backdrop-blur-xl transition-all duration-300 font-semibold text-sm border",
            isEditMode 
              ? "bg-emerald-600/90 text-white border-emerald-500 hover:bg-emerald-600 shadow-emerald-900/20"
              : "bg-black/80 text-white border-white/20 hover:bg-black shadow-black/20"
          )}
        >
          {isEditMode ? (
            <>
              <Pencil className="w-4 h-4" /> Editing Website
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" /> Live Preview
            </>
          )}
        </button>
      </div>
    </EditModeContext.Provider>
  );
}
