export interface GiftCardData {
  id: string;
  fileName: string;
  serialNumber: string;
  password: string;
  imagePreviewUrl: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}
