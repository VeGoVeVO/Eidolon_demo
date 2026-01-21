import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageUpload from '../components/ImageUpload';

describe('ImageUpload Component', () => {
  const mockOnImageUpload = vi.fn();

  beforeEach(() => {
    mockOnImageUpload.mockClear();
  });

  it('renders upload area', () => {
    render(
      <ImageUpload
        onImageUpload={mockOnImageUpload}
        isProcessing={false}
        uploadedImage={null}
      />
    );

    expect(screen.getByText(/upload your photo/i)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });

  it('displays upload tips', () => {
    render(
      <ImageUpload
        onImageUpload={mockOnImageUpload}
        isProcessing={false}
        uploadedImage={null}
      />
    );

    expect(screen.getByText(/tips for best results/i)).toBeInTheDocument();
    expect(screen.getByText(/use a full-body photo/i)).toBeInTheDocument();
  });

  it('shows processing state when isProcessing is true', () => {
    render(
      <ImageUpload
        onImageUpload={mockOnImageUpload}
        isProcessing={true}
        uploadedImage={null}
      />
    );

    expect(screen.getByText(/processing your image/i)).toBeInTheDocument();
  });

  it('accepts image files', () => {
    render(
      <ImageUpload
        onImageUpload={mockOnImageUpload}
        isProcessing={false}
        uploadedImage={null}
      />
    );

    const input = document.querySelector('input[type="file"]');
    expect(input).toHaveAttribute('accept', 'image/*');
  });

  it('rejects non-image files', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <ImageUpload
        onImageUpload={mockOnImageUpload}
        isProcessing={false}
        uploadedImage={null}
      />
    );

    const input = document.querySelector('input[type="file"]');
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(alertSpy).toHaveBeenCalledWith('Please upload an image file');
    alertSpy.mockRestore();
  });

  it('rejects files larger than 10MB', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <ImageUpload
        onImageUpload={mockOnImageUpload}
        isProcessing={false}
        uploadedImage={null}
      />
    );

    const input = document.querySelector('input[type="file"]');
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(alertSpy).toHaveBeenCalledWith('File size must be less than 10MB');
    alertSpy.mockRestore();
  });
});

