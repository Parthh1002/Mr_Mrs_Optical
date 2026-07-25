'use client';

import { useState, useEffect } from 'react';
import { Upload, Trash2, Plus, RefreshCw, Film, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  createReel, 
  deleteReel as deleteReelAction, 
  updateReel as updateReelAction, 
  createGalleryPhoto, 
  deleteGalleryPhoto 
} from '@/lib/api';

interface Reel {
  id: string;
  video_url: string;
  caption: string;
}

interface SiteImage {
  id: string;
  image_url: string;
  key: string; // e.g. gallery_1, gallery_2
}

export default function MediaAdmin() {
  const [activeTab, setActiveTab] = useState<'reels' | 'gallery'>('reels');
  const [reels, setReels] = useState<Reel[]>([]);
  const [gallery, setGallery] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, [activeTab]);

  async function fetchMedia() {
    setLoading(true);
    try {
      if (activeTab === 'reels') {
        const { data, error } = await supabase.from('reels').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setReels(data || []);
      } else {
        const { data, error } = await supabase.from('site_content').select('*').like('key', 'gallery_%').order('updated_at', { ascending: false });
        if (error) throw error;
        setGallery(data || []);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load ' + activeTab);
    } finally {
      setLoading(false);
    }
  }

  const handleUploadReel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'reels');
      formData.append('path', fileName);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to upload file');
      }
      const { publicUrl } = await res.json();

      await createReel(publicUrl, 'New Reel');

      toast.success('Reel uploaded successfully!');
      fetchMedia();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload reel');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'product-images');
      formData.append('path', fileName);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to upload file');
      }
      const { publicUrl } = await res.json();

      await createGalleryPhoto(publicUrl);

      toast.success('Photo added to gallery!');
      fetchMedia();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const deleteReel = async (id: string) => {
    if (!confirm('Are you sure you want to remove this reel?')) return;
    try {
      await deleteReelAction(id);
      toast.success('Reel removed');
      setReels(reels.filter(r => r.id !== id));
    } catch (error) {
      toast.error('Failed to remove reel');
    }
  };

  const deleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to remove this photo?')) return;
    try {
      await deleteGalleryPhoto(id);
      toast.success('Photo removed');
      setGallery(gallery.filter(g => g.id !== id));
    } catch (error) {
      toast.error('Failed to remove photo');
    }
  };

  const updateReelCaption = async (id: string, caption: string) => {
    try {
      await updateReelAction(id, caption);
      setReels(reels.map(r => r.id === id ? { ...r, caption } : r));
      toast.success('Caption updated');
    } catch (error) {
      toast.error('Failed to update caption');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Photos & Videos</h1>
        <p className="text-muted-foreground mt-1">Manage your Instagram-style reels and photo gallery</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-border">
        <button 
          onClick={() => setActiveTab('reels')}
          className={`pb-4 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'reels' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Film className="w-5 h-5" /> Reels
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={`pb-4 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'gallery' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <ImageIcon className="w-5 h-5" /> Photo Gallery
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground"><RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" /> Loading...</div>
      ) : activeTab === 'reels' ? (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Upload Button */}
            <label className="bg-muted/50 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors aspect-[9/16] relative overflow-hidden group">
              {uploading ? (
                <div className="text-center text-muted-foreground"><RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" /> Uploading...</div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
                  <span className="font-medium text-foreground">Upload New Reel</span>
                  <span className="text-xs text-muted-foreground mt-1">MP4 or WebM</span>
                </>
              )}
              <input type="file" accept="video/*" className="hidden" onChange={handleUploadReel} disabled={uploading} />
            </label>

            {/* Reel Cards */}
            {reels.map(reel => (
              <div key={reel.id} className="relative group bg-card rounded-2xl border border-border overflow-hidden flex flex-col aspect-[9/16]">
                <video src={reel.video_url} className="w-full h-full object-cover bg-black" muted loop onMouseEnter={e => e.currentTarget.play()} onMouseLeave={e => e.currentTarget.pause()} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <button onClick={() => deleteReel(reel.id)} className="self-end p-2 bg-destructive text-destructive-foreground rounded-full hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                  <Input 
                    value={reel.caption}
                    onChange={(e) => setReels(reels.map(r => r.id === reel.id ? { ...r, caption: e.target.value } : r))}
                    onBlur={(e) => updateReelCaption(reel.id, e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 backdrop-blur-sm focus-visible:ring-white"
                    placeholder="Caption..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Upload Button */}
            <label className="bg-muted/50 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors aspect-square relative overflow-hidden group">
              {uploading ? (
                <div className="text-center text-muted-foreground"><RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" /> Uploading...</div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
                  <span className="font-medium text-foreground">Upload Photo</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadGallery} disabled={uploading} />
            </label>

            {/* Gallery Cards */}
            {gallery.map(img => (
              <div key={img.id} className="relative group bg-card rounded-2xl border border-border overflow-hidden aspect-square">
                <img src={img.image_url} className="w-full h-full object-cover" alt="Gallery" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => deleteGallery(img.id)} className="p-3 bg-destructive text-destructive-foreground rounded-full hover:scale-110 transition-transform shadow-xl"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
