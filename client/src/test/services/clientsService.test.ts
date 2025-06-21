import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientsService } from '../../services/clientsService';
import apiClient from '../../api/axios';

// Mock axios
vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('clientsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getClientIdByUserId', () => {
    it('should return client_id when API call is successful', async () => {
      const mockResponse = {
        data: {
          client_id: 123,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await clientsService.getClientIdByUserId('user-uuid-123');

      expect(apiClient.get).toHaveBeenCalledWith('/clients/by-user-id/user-uuid-123');
      expect(result).toEqual({ client_id: 123 });
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(clientsService.getClientIdByUserId('user-uuid-123')).rejects.toThrow('API Error');
    });

    it('should handle empty response', async () => {
      const mockResponse = {
        data: null,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await clientsService.getClientIdByUserId('user-uuid-123');

      expect(result).toBeNull();
    });
  });
}); 