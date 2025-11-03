export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface CartoonVersion {
  id: string;
  cartoonImage: string;
  prompt: string;
}

export interface GalleryItem {
  id: string;
  originalImage: string;
  versions: CartoonVersion[];
}
