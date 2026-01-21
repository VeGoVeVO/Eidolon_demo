import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
  });

  it('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows login page when not authenticated', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/get started/i)).toBeInTheDocument();
    });
  });

  it('shows main app when authenticated', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/pic.jpg',
    };

    localStorage.getItem.mockImplementation((key) => {
      if (key === 'virtual_tryon_user') {
        return JSON.stringify(mockUser);
      }
      if (key === 'virtual_tryon_token') {
        return 'mock-token';
      }
      return null;
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/virtual try-on/i)).toBeInTheDocument();
    });
  });

  it('handles authentication errors gracefully', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'virtual_tryon_user') {
        return 'invalid-json{';
      }
      return null;
    });

    render(<App />);

    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('virtual_tryon_user');
    });
  });
});

