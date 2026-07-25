'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Upload, Image as ImageIcon, LayoutTemplate, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getSiteContent, setSiteContent } from '@/lib/api';
import { uploadImageLocally } from '@/lib/upload';

export default function LiveThemeEditor() {
  const [activeTab, setActiveTab] = useState('home');
  const [content, setContent] = useState<Record<string, { text: string | null, image: string | null }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  async function fetchContent() {
    setIsLoading(true);
    const data = await getSiteContent(activeTab);
    setContent(data);
    setIsLoading(false);
  }

  async function reloadPreview() {
    if (iframeRef.current) {
      // Force iframe to reload
      iframeRef.current.src = iframeRef.current.src;
    }
  }

  async function handleSaveText(sectionKey: string, textValue: string) {
    setIsSaving(sectionKey);
    await setSiteContent(activeTab, sectionKey, textValue, content[sectionKey]?.image || null);
    setIsSaving(null);
    fetchContent();
    reloadPreview();
  }

  async function handleUploadImage(sectionKey: string, file: File) {
    setIsSaving(sectionKey);
    const formData = new FormData();
    formData.append('file', file);
    const imageUrl = await uploadImageLocally(formData);
    
    if (imageUrl) {
      await setSiteContent(activeTab, sectionKey, content[sectionKey]?.text || null, imageUrl);
      fetchContent();
      reloadPreview();
    }
    setIsSaving(null);
  }

  const PageFields = {
    home: [
      { key: 'home_hero_title', label: 'Main Hero Title', type: 'textarea' },
      { key: 'home_hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
      { key: 'home_hero_image', label: 'Hero Background Image', type: 'image' },
      { key: 'home_why_title', label: 'Why Choose Us Title', type: 'text' },
      { key: 'home_why_desc', label: 'Why Choose Us Desc', type: 'textarea' },
      { key: 'home_video_title', label: 'Video Section Title', type: 'text' },
      { key: 'home_video_url', label: 'Video MP4 URL', type: 'text' },
    ],
    about: [
      { key: 'about_hero_title', label: 'About Page Title', type: 'text' },
      { key: 'about_hero_image', label: 'About Top Banner', type: 'image' },
      { key: 'about_story_text', label: 'Our Story Paragraph', type: 'textarea' },
    ],
    contact: [
      { key: 'contact_title', label: 'Contact Us Title', type: 'text' },
      { key: 'contact_desc', label: 'Contact Description', type: 'textarea' },
    ]
  };

  const currentFields = PageFields[activeTab as keyof typeof PageFields];
  const iframeSrc = activeTab === 'home' ? 'http://localhost:3000' : `http://localhost:3000/${activeTab}`;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col lg:flex-row bg-background overflow-hidden">
      
      {/* LEFT SIDE: Editor Panel */}
      <div className="w-full lg:w-[450px] shrink-0 border-r border-border flex flex-col h-full bg-card shadow-2xl z-10">
        <div className="p-4 border-b border-border bg-muted/20 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <LayoutTemplate className="w-5 h-5 text-primary" />
              Theme Editor
            </h2>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/admin'}>
              Exit
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {Object.keys(PageFields).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium capitalize rounded-md whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin mb-4 text-primary" />
              <p className="text-sm">Loading fields...</p>
            </div>
          ) : (
            currentFields.map((field) => {
              const currentData = content[field.key] || { text: '', image: null };
              
              return (
                <div key={field.key} className="space-y-3 bg-background border border-border p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2">
                    <label className="text-sm font-semibold text-foreground">{field.label}</label>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{field.key}</span>
                  </div>
                  
                  {field.type === 'text' && (
                    <div className="flex gap-2">
                      <Input 
                        defaultValue={currentData.text || ''} 
                        id={`input-${field.key}`}
                        placeholder="..." 
                        className="h-8 text-sm"
                      />
                      <Button 
                        size="sm"
                        onClick={() => {
                          const val = (document.getElementById(`input-${field.key}`) as HTMLInputElement).value;
                          handleSaveText(field.key, val);
                        }}
                        disabled={isSaving === field.key}
                      >
                        {isSaving === field.key ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Save'}
                      </Button>
                    </div>
                  )}

                  {field.type === 'textarea' && (
                    <div className="flex gap-3 flex-col">
                      <Textarea 
                        defaultValue={currentData.text || ''} 
                        id={`input-${field.key}`}
                        rows={4}
                        className="text-sm resize-y min-h-[100px] bg-muted/20 focus:bg-background transition-colors"
                        placeholder="Type your content here..." 
                      />
                      <Button 
                        size="sm"
                        onClick={() => {
                          const val = (document.getElementById(`input-${field.key}`) as HTMLTextAreaElement).value;
                          handleSaveText(field.key, val);
                        }}
                        disabled={isSaving === field.key}
                        className="w-full sm:w-auto self-end gap-2"
                      >
                        {isSaving === field.key ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving === field.key ? 'Saving...' : 'Save Text'}
                      </Button>
                    </div>
                  )}

                  {field.type === 'image' && (
                    <div className="space-y-3 pt-2">
                      {currentData.image ? (
                        <div className="relative h-32 bg-muted rounded-md overflow-hidden border border-border">
                          <img src={currentData.image} alt={field.label} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-20 bg-muted/50 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-6 h-6 opacity-50" />
                        </div>
                      )}
                      
                      <div>
                        <input 
                          type="file" 
                          id={`file-${field.key}`} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleUploadImage(field.key, e.target.files[0]);
                          }}
                        />
                        <label 
                          htmlFor={`file-${field.key}`}
                          className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer text-xs font-medium transition-colors"
                        >
                          {isSaving === field.key ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          {currentData.image ? 'Replace Image' : 'Upload Image'}
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Live Preview */}
      <div className="flex-1 bg-muted/20 flex flex-col h-full relative overflow-hidden">
        <div className="h-12 border-b border-border flex items-center px-4 bg-card/80 backdrop-blur-sm shrink-0 gap-3 text-sm text-muted-foreground z-10">
          <MonitorSmartphone className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">Live Preview</span>
          <div className="h-4 w-px bg-border mx-2"></div>
          <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground/80 hidden sm:inline-block">
            {iframeSrc}
          </span>
          <Button variant="outline" size="sm" className="ml-auto gap-2 text-xs h-8" onClick={reloadPreview}>
            <RefreshCw className="w-3 h-3" />
            Reload
          </Button>
        </div>
        <div className="flex-1 p-0 md:p-4 overflow-hidden bg-muted/10">
          <div className="w-full h-full rounded-none md:rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-border bg-white relative">
            <iframe 
              ref={iframeRef}
              src={iframeSrc} 
              className="w-full h-full border-none bg-white"
              title="Live Preview"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
