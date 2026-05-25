import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../components/ui/modal';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    // Reset du mock avant chaque test
    defaultProps.onClose.mockClear();
    // Reset du style du body
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Cleanup après chaque test
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<Modal {...defaultProps} />);
      
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('renders children content correctly', () => {
      render(
        <Modal {...defaultProps}>
          <h1>Custom Title</h1>
          <p>Custom paragraph</p>
        </Modal>
      );
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom paragraph')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <Modal {...defaultProps} className="custom-modal-class" />
      );
      
      const modalContent = container.querySelector('.custom-modal-class');
      expect(modalContent).toBeInTheDocument();
    });
  });

  describe('Close button', () => {
    it('renders close button by default', () => {
      render(<Modal {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });

    it('does not render close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });



    it('renders close button with correct styling', () => {
      render(<Modal {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass(
        'absolute',
        'right-3',
        'top-3',
        'z-999',
        'flex',
        'rounded-full',
        'bg-gray-100'
      );
    });
  });

  describe('Keyboard interactions', () => {
    it('calls onClose when Escape key is pressed', () => {
      render(<Modal {...defaultProps} />);
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when other keys are pressed', () => {
      render(<Modal {...defaultProps} />);
      
      fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space', code: 'Space' });
      fireEvent.keyDown(document, { key: 'Tab', code: 'Tab' });
      
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it('does not add keydown listener when modal is closed', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      
      render(<Modal {...defaultProps} isOpen={false} />);
      
      expect(addEventListenerSpy).not.toHaveBeenCalledWith('keydown', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });
  });


  describe('Body overflow management', () => {
    it('sets body overflow to hidden when modal opens', () => {
      render(<Modal {...defaultProps} isOpen={true} />);
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('resets body overflow when modal closes', () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);
      
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Modal {...defaultProps} isOpen={false} />);
      
      expect(document.body.style.overflow).toBe('unset');
    });

    it('resets body overflow on component unmount', () => {
      const { unmount } = render(<Modal {...defaultProps} isOpen={true} />);
      
      expect(document.body.style.overflow).toBe('hidden');
      
      unmount();
      
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Fullscreen mode', () => {
    it('applies fullscreen classes when isFullscreen is true', () => {
      const { container } = render(<Modal {...defaultProps} isFullscreen={true} />);
      
      const modalContent = container.querySelector('.w-full.h-full');
      expect(modalContent).toBeInTheDocument();
    });

    it('applies regular classes when isFullscreen is false', () => {
      const { container } = render(<Modal {...defaultProps} isFullscreen={false} />);
      
      const modalContent = container.querySelector('.relative.w-full.rounded-3xl');
      expect(modalContent).toBeInTheDocument();
    });

    it('does not render backdrop in fullscreen mode', () => {
      const { container } = render(<Modal {...defaultProps} isFullscreen={true} />);
      
      const backdrop = container.querySelector('.bg-gray-400\\/50');
      expect(backdrop).not.toBeInTheDocument();
    });

    it('renders backdrop in normal mode', () => {
      const { container } = render(<Modal {...defaultProps} isFullscreen={false} />);
      
      const backdrop = container.querySelector('.bg-gray-400\\/50');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper modal structure', () => {
      const { container } = render(<Modal {...defaultProps} />);
      
      const modalContainer = container.querySelector('.fixed.inset-0');
      expect(modalContainer).toBeInTheDocument();
      expect(modalContainer).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('has proper z-index for modal overlay', () => {
      const { container } = render(<Modal {...defaultProps} />);
      
      const modalContainer = container.querySelector('.z-99999');
      expect(modalContainer).toBeInTheDocument();
    });

    it('close button has proper z-index', () => {
      render(<Modal {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('z-999');
    });

   
  });

  describe('Close button icon', () => {
    it('renders close icon SVG', () => {
      const { container } = render(<Modal {...defaultProps} />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('close icon has correct fill attribute', () => {
      const { container } = render(<Modal {...defaultProps} />);
      
      const svg = container.querySelector('svg');
      const path = svg?.querySelector('path');
      expect(path).toHaveAttribute('fill', 'currentColor');
    });
  });

  describe('Event cleanup', () => {
    it('removes event listeners when component unmounts', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<Modal {...defaultProps} />);
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    it('removes event listeners when modal closes', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);
      
      rerender(<Modal {...defaultProps} isOpen={false} />);
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });
  });


  describe('Dark mode support', () => {
    it('includes dark mode classes', () => {
      const { container } = render(<Modal {...defaultProps} />);
      
      const modalContent = container.querySelector('.dark\\:bg-gray-900');
      expect(modalContent).toBeInTheDocument();
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('dark:bg-gray-800', 'dark:text-gray-400');
    });
  });
});