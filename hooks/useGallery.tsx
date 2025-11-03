import { useState, useEffect, useCallback } from 'react';
import { GalleryItem, CartoonVersion } from '../types';
import { GALLERY_STORAGE_KEY } from '../constants';

export const useGallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (stored) {
        setGalleryItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load gallery from local storage", e);
    }
  }, []);

  const saveToLocalStorage = (items: GalleryItem[]) => {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save gallery to local storage", e);
    }
  };

  const addToGallery = useCallback((newItem: { originalImage: string; cartoonImage: string; prompt: string }) => {
    setGalleryItems((prev) => {
      const existingIdx = prev.findIndex(item => item.originalImage === newItem.originalImage);
      const newVersion: CartoonVersion = { id: new Date().toISOString(), cartoonImage: newItem.cartoonImage, prompt: newItem.prompt };
      
      let updatedItems: GalleryItem[];

      if (existingIdx > -1) {
        updatedItems = [...prev];
        const existingItem = updatedItems[existingIdx];
        existingItem.versions.unshift(newVersion);
      } else {
        const newGalleryItem: GalleryItem = { id: new Date().toISOString(), originalImage: newItem.originalImage, versions: [newVersion] };
        updatedItems = [newGalleryItem, ...prev];
      }
      
      saveToLocalStorage(updatedItems);
      return updatedItems;
    });
  }, []);

  const deleteGalleryItem = useCallback((itemId: string) => {
    setGalleryItems(prev => {
      const updated = prev.filter(item => item.id !== itemId);
      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  const deleteVersion = useCallback((itemId: string, versionId: string) => {
    setGalleryItems(prev => {
      const itemIdx = prev.findIndex(item => item.id === itemId);
      if (itemIdx === -1) return prev;
      
      const updated = [...prev];
      const item = { ...updated[itemIdx] };
      item.versions = item.versions.filter(v => v.id !== versionId);
      
      if (item.versions.length === 0) {
        updated.splice(itemIdx, 1);
      } else {
        updated[itemIdx] = item;
      }

      saveToLocalStorage(updated);
      return updated;
    });
  }, []);

  return { galleryItems, addToGallery, deleteGalleryItem, deleteVersion };
};
