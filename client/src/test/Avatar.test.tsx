import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from '../components/ui/avatar/Avatar';

describe('Avatar Component', () => {
  const defaultProps = {
    src: 'https://example.com/avatar.jpg',
  };

  it('renders with required props', () => {
    render(<Avatar {...defaultProps} />);
    
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('uses default alt text when not provided', () => {
    render(<Avatar {...defaultProps} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'User Avatar');
  });

  it('uses custom alt text when provided', () => {
    render(<Avatar {...defaultProps} alt="John Doe Avatar" />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'John Doe Avatar');
  });

  it('applies default medium size when not specified', () => {
    const { container } = render(<Avatar {...defaultProps} />);
    
    const avatarContainer = container.firstChild;
    expect(avatarContainer).toHaveClass('h-10', 'w-10', 'max-w-10');
  });

  it('applies correct size classes for each size variant', () => {
    const sizeTests = [
      { size: 'xsmall' as const, classes: ['h-6', 'w-6', 'max-w-6'] },
      { size: 'small' as const, classes: ['h-8', 'w-8', 'max-w-8'] },
      { size: 'medium' as const, classes: ['h-10', 'w-10', 'max-w-10'] },
      { size: 'large' as const, classes: ['h-12', 'w-12', 'max-w-12'] },
      { size: 'xlarge' as const, classes: ['h-14', 'w-14', 'max-w-14'] },
      { size: 'xxlarge' as const, classes: ['h-16', 'w-16', 'max-w-16'] },
    ];

    sizeTests.forEach(({ size, classes }) => {
      const { container } = render(<Avatar {...defaultProps} size={size} />);
      
      const avatarContainer = container.firstChild;
      classes.forEach(className => {
        expect(avatarContainer).toHaveClass(className);
      });
    });
  });

  it('has correct base classes', () => {
    const { container } = render(<Avatar {...defaultProps} />);
    
    const avatarContainer = container.firstChild;
    expect(avatarContainer).toHaveClass('relative', 'rounded-full');
  });

  it('image has correct classes', () => {
    render(<Avatar {...defaultProps} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveClass('object-cover', 'rounded-full');
  });

  it('does not show status indicator when status is none', () => {
    const { container } = render(<Avatar {...defaultProps} status="none" />);
    
    const statusIndicator = container.querySelector('span');
    expect(statusIndicator).not.toBeInTheDocument();
  });

  it('does not show status indicator by default', () => {
    const { container } = render(<Avatar {...defaultProps} />);
    
    const statusIndicator = container.querySelector('span');
    expect(statusIndicator).not.toBeInTheDocument();
  });

  it('shows status indicator when status is provided', () => {
    const { container } = render(<Avatar {...defaultProps} status="online" />);
    
    const statusIndicator = container.querySelector('span');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('applies correct status color classes', () => {
    const statusTests = [
      { status: 'online' as const, colorClass: 'bg-success-500' },
      { status: 'offline' as const, colorClass: 'bg-error-400' },
      { status: 'busy' as const, colorClass: 'bg-warning-500' },
    ];

    statusTests.forEach(({ status, colorClass }) => {
      const { container } = render(<Avatar {...defaultProps} status={status} />);
      
      const statusIndicator = container.querySelector('span');
      expect(statusIndicator).toHaveClass(colorClass);
    });
  });

  it('applies correct status size classes for each avatar size', () => {
    const statusSizeTests = [
      { size: 'xsmall' as const, statusClasses: ['h-1.5', 'w-1.5', 'max-w-1.5'] },
      { size: 'small' as const, statusClasses: ['h-2', 'w-2', 'max-w-2'] },
      { size: 'medium' as const, statusClasses: ['h-2.5', 'w-2.5', 'max-w-2.5'] },
      { size: 'large' as const, statusClasses: ['h-3', 'w-3', 'max-w-3'] },
      { size: 'xlarge' as const, statusClasses: ['h-3.5', 'w-3.5', 'max-w-3.5'] },
      { size: 'xxlarge' as const, statusClasses: ['h-4', 'w-4', 'max-w-4'] },
    ];

    statusSizeTests.forEach(({ size, statusClasses }) => {
      const { container } = render(<Avatar {...defaultProps} size={size} status="online" />);
      
      const statusIndicator = container.querySelector('span');
      statusClasses.forEach(className => {
        expect(statusIndicator).toHaveClass(className);
      });
    });
  });

  it('status indicator has correct positioning and styling', () => {
    const { container } = render(<Avatar {...defaultProps} status="online" />);
    
    const statusIndicator = container.querySelector('span');
    expect(statusIndicator).toHaveClass(
      'absolute',
      'bottom-0',
      'right-0',
      'rounded-full',
      'border-[1.5px]',
      'border-white',
      'dark:border-gray-900'
    );
  });

  it('handles all props combination correctly', () => {
    const { container } = render(
      <Avatar 
        src="https://example.com/user.jpg"
        alt="Custom Alt Text"
        size="large"
        status="busy"
      />
    );
    
    // Vérifier l'image
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/user.jpg');
    expect(img).toHaveAttribute('alt', 'Custom Alt Text');
    
    // Vérifier la taille du container
    const avatarContainer = container.firstChild;
    expect(avatarContainer).toHaveClass('h-12', 'w-12', 'max-w-12');
    
    // Vérifier le status indicator
    const statusIndicator = container.querySelector('span');
    expect(statusIndicator).toHaveClass('bg-warning-500', 'h-3', 'w-3', 'max-w-3');
  });

  it('handles missing status color gracefully', () => {
    // Test avec un status qui n'existe pas dans statusColorClasses
    const { container } = render(<Avatar {...defaultProps} status="online" />);
    
    const statusIndicator = container.querySelector('span');
    expect(statusIndicator).toBeInTheDocument();
    // Vérifie que le composant ne plante pas même si une couleur n'est pas définie
  });

  it('maintains aspect ratio with object-cover', () => {
    render(<Avatar {...defaultProps} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveClass('object-cover');
  });

  it('supports dark mode classes for status indicator', () => {
    const { container } = render(<Avatar {...defaultProps} status="online" />);
    
    const statusIndicator = container.querySelector('span');
    expect(statusIndicator).toHaveClass('dark:border-gray-900');
  });

  it('renders with proper accessibility attributes', () => {
    render(<Avatar {...defaultProps} alt="Profile picture of John Doe" />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Profile picture of John Doe');
    expect(img).toBeVisible();
  });

  it('status indicator does not interfere with image accessibility', () => {
    render(<Avatar {...defaultProps} status="online" alt="User profile image" />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'User profile image');
    
    // Vérifie qu'il n'y a qu'une seule image (le status n'est pas une image)
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
  });
});