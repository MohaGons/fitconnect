import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../components/ui/badge/Badge';
// Mock d'icônes pour les tests
const MockStartIcon = () => <span data-testid="start-icon">→</span>;
const MockEndIcon = () => <span data-testid="end-icon">←</span>;

describe('Badge Component', () => {
  it('renders with required children prop', () => {
    render(<Badge>Test Badge</Badge>);
    
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default props when not specified', () => {
    const { container } = render(<Badge>Default Badge</Badge>);
    
    const badge = container.firstChild;
    // Vérifie les classes par défaut (light variant, primary color, md size)
    expect(badge).toHaveClass('text-sm'); // md size
    expect(badge).toHaveClass('bg-brand-50', 'text-brand-500'); // light primary
  });

  it('applies base styles correctly', () => {
    const { container } = render(<Badge>Base Styles</Badge>);
    
    const badge = container.firstChild;
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'px-2.5',
      'py-0.5',
      'justify-center',
      'gap-1',
      'rounded-full',
      'font-medium'
    );
  });

  describe('Size variants', () => {
    it('applies small size classes', () => {
      const { container } = render(<Badge size="sm">Small Badge</Badge>);
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('text-theme-xs');
    });

    it('applies medium size classes', () => {
      const { container } = render(<Badge size="md">Medium Badge</Badge>);
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('text-sm');
    });
  });

  describe('Light variant colors', () => {
    it('applies correct classes for light primary variant', () => {
      const { container } = render(
        <Badge variant="light" color="primary">
          Primary Badge
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-brand-50', 'text-brand-500');
    });

    it('applies correct classes for light success variant', () => {
      const { container } = render(
        <Badge variant="light" color="success">
          Success Badge
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-success-50', 'text-success-600');
    });

    it('applies correct classes for light error variant', () => {
      const { container } = render(
        <Badge variant="light" color="error">
          Error Badge
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-error-50', 'text-error-600');
    });

    it('applies correct classes for light warning variant', () => {
      const { container } = render(
        <Badge variant="light" color="warning">
          Warning Badge
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-warning-50', 'text-warning-600');
    });

    it('applies correct classes for light info variant', () => {
      const { container } = render(
        <Badge variant="light" color="info">
          Info Badge
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-blue-light-50', 'text-blue-light-500');
    });
  });

  describe('Solid variant colors', () => {
    it('applies correct classes for solid primary variant', () => {
      const { container } = render(
        <Badge variant="solid" color="primary">
          Primary Badge
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-brand-500', 'text-white');
    });

    it('applies correct classes for solid success variant', () => {
      const { container } = render(
        <Badge variant="solid" color="success">
          Success Badge
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-success-500', 'text-white');
    });

    it('applies correct classes for solid error variant', () => {
      const { container } = render(
        <Badge variant="solid" color="error">
          Error Badge
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-error-500', 'text-white');
    });
  });

  describe('Icons', () => {
    it('renders without icons when not provided', () => {
      render(<Badge>No Icons</Badge>);
      
      expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('end-icon')).not.toBeInTheDocument();
    });

    it('renders start icon when provided', () => {
      render(
        <Badge startIcon={<MockStartIcon />}>
          With Start Icon
        </Badge>
      );
      
      const icon = screen.getByTestId('start-icon');
      expect(icon).toBeInTheDocument();
      
      // Vérifie que l'icône a la bonne classe de marge
      const iconContainer = icon.parentElement;
      expect(iconContainer).toHaveClass('mr-1');
    });

    it('renders end icon when provided', () => {
      render(
        <Badge endIcon={<MockEndIcon />}>
          With End Icon
        </Badge>
      );
      
      const icon = screen.getByTestId('end-icon');
      expect(icon).toBeInTheDocument();
      
      // Vérifie que l'icône a la bonne classe de marge
      const iconContainer = icon.parentElement;
      expect(iconContainer).toHaveClass('ml-1');
    });

    it('renders both start and end icons', () => {
      render(
        <Badge 
          startIcon={<MockStartIcon />} 
          endIcon={<MockEndIcon />}
        >
          Both Icons
        </Badge>
      );
      
      const startIcon = screen.getByTestId('start-icon');
      const endIcon = screen.getByTestId('end-icon');
      
      expect(startIcon).toBeInTheDocument();
      expect(endIcon).toBeInTheDocument();
      
      // Vérifie les classes de marge
      expect(startIcon.parentElement).toHaveClass('mr-1');
      expect(endIcon.parentElement).toHaveClass('ml-1');
    });
  });

  describe('Complex combinations', () => {
    it('handles all props together correctly', () => {
      const { container } = render(
        <Badge
          variant="solid"
          color="success"
          size="sm"
          startIcon={<MockStartIcon />}
          endIcon={<MockEndIcon />}
        >
          Complete Badge
        </Badge>
      );
      
      const badge = container.firstChild;
      
      // Vérifie le variant et la couleur
      expect(badge).toHaveClass('bg-success-500', 'text-white');
      
      // Vérifie la taille
      expect(badge).toHaveClass('text-theme-xs');
      
      // Vérifie les icônes
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
      
      // Vérifie le texte
      expect(screen.getByText('Complete Badge')).toBeInTheDocument();
    });

    it('maintains proper spacing with gap class', () => {
      const { container } = render(
        <Badge startIcon={<MockStartIcon />} endIcon={<MockEndIcon />}>
          Spaced Content
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('gap-1');
    });
  });

  

  describe('Children content', () => {
    it('renders text children', () => {
      render(<Badge>Simple Text</Badge>);
      
      expect(screen.getByText('Simple Text')).toBeInTheDocument();
    });

    it('renders number children', () => {
      render(<Badge>{42}</Badge>);
      
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders complex ReactNode children', () => {
      render(
        <Badge>
          <span>Complex</span> Content
        </Badge>
      );
      
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Dark mode support', () => {
    it('includes dark mode classes for light variants', () => {
      const { container } = render(
        <Badge variant="light" color="primary">
          Dark Mode Test
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('dark:bg-brand-500/15', 'dark:text-brand-400');
    });

    it('includes dark mode classes for solid variants', () => {
      const { container } = render(
        <Badge variant="solid" color="primary">
          Dark Mode Test
        </Badge>
      );
      
      const badge = container.firstChild;
      expect(badge).toHaveClass('dark:text-white');
    });
  });
});