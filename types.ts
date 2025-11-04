export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface Theme {
  name: string;
  description: string;
  prompt: string;
  imageUrl: string;
}

// This line is crucial to ensure the file is treated as a module in a buildless environment.
export {};
