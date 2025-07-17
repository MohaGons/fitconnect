import { describe, it, expect, vi, beforeEach } from 'vitest';
import { compressImage, convertToBase64, processFileToBase64 } from '../../services/fileUploadService';
import imageCompression from 'browser-image-compression';

// Mock browser-image-compression
vi.mock('browser-image-compression', () => ({
  default: vi.fn(),
}));

describe('fileUploadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('compressImage', () => {
    it('should compress image successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockCompressedFile = new File(['compressed'], 'compressed.jpg', { type: 'image/jpeg' });

      vi.mocked(imageCompression).mockResolvedValue(mockCompressedFile);

      const result = await compressImage(mockFile);

      expect(imageCompression).toHaveBeenCalledWith(mockFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      expect(result).toBe(mockCompressedFile);
    });

    it('should return original file when compression fails', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(imageCompression).mockRejectedValue(new Error('Compression failed'));

      const result = await compressImage(mockFile);

      expect(result).toBe(mockFile);
      expect(consoleSpy).toHaveBeenCalledWith('Erreur lors de la compression:', expect.any(Error));
    });
  });

  describe('convertToBase64', () => {
    it('should convert file to base64 successfully', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const expectedBase64 = 'data:text/plain;base64,dGVzdCBjb250ZW50';

      const result = await convertToBase64(mockFile);

      expect(result).toBe(expectedBase64);
    });
  });

  describe('processFileToBase64', () => {
    it('should process file to base64 successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockCompressedFile = new File(['compressed'], 'compressed.jpg', { type: 'image/jpeg' });
      const expectedBase64 = 'data:image/jpeg;base64,Y29tcHJlc3NlZA==';

      vi.mocked(imageCompression).mockResolvedValue(mockCompressedFile);

      const result = await processFileToBase64(mockFile);

      expect(imageCompression).toHaveBeenCalled();
      expect(result).toBe(expectedBase64);
    });
  });
}); 