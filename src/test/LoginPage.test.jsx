import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';

describe('LoginPage Component', () => {
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    mockOnLoginSuccess.mockClear();
    global.fetch = vi.fn();
  });

  it('renders login page with title', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    expect(screen.getByText(/virtual try-on/i)).toBeInTheDocument();
    expect(screen.getByText(/experience the future of fashion/i)).toBeInTheDocument();
  });

  it('renders Google sign-in button container', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    const buttonContainer = document.getElementById('google-signin-button');
    expect(buttonContainer).toBeInTheDocument();
  });

  it('displays privacy text', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    expect(screen.getByText(/terms of service and privacy policy/i)).toBeInTheDocument();
  });

  it('shows tips for uploading photos', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    expect(screen.getByText(/sign in with your google account/i)).toBeInTheDocument();
  });

  it('initializes Google Auth on mount', async () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);
    
    await waitFor(() => {
      expect(google.accounts.id.initialize).toHaveBeenCalled();
    });
  });
});

