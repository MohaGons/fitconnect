import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import Alert from '../components/ui/alert/Alert';

// Wrapper pour React Router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Alert Component', () => {
  const defaultProps = {
    variant: 'info' as const,
    title: 'Test Alert',
    message: 'This is a test message',
  };

  it('renders with required props', () => {
    render(
      <RouterWrapper>
        <Alert {...defaultProps} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });

  it('renders success variant with correct classes', () => {
    const { container } = render(
      <RouterWrapper>
        <Alert variant="success" title="Success" message="Operation successful" />
      </RouterWrapper>
    );
    
    const alertContainer = container.querySelector('.border-success-500');
    expect(alertContainer).toBeInTheDocument();
    expect(alertContainer).toHaveClass('bg-success-50');
  });

  it('renders error variant with correct classes', () => {
    const { container } = render(
      <RouterWrapper>
        <Alert variant="error" title="Error" message="Something went wrong" />
      </RouterWrapper>
    );
    
    const alertContainer = container.querySelector('.border-error-500');
    expect(alertContainer).toBeInTheDocument();
    expect(alertContainer).toHaveClass('bg-error-50');
  });

  it('renders warning variant with correct classes', () => {
    const { container } = render(
      <RouterWrapper>
        <Alert variant="warning" title="Warning" message="Be careful" />
      </RouterWrapper>
    );
    
    const alertContainer = container.querySelector('.border-warning-500');
    expect(alertContainer).toBeInTheDocument();
    expect(alertContainer).toHaveClass('bg-warning-50');
  });

  it('renders info variant with correct classes', () => {
    const { container } = render(
      <RouterWrapper>
        <Alert variant="info" title="Info" message="For your information" />
      </RouterWrapper>
    );
    
    const alertContainer = container.querySelector('.border-blue-light-500');
    expect(alertContainer).toBeInTheDocument();
    expect(alertContainer).toHaveClass('bg-blue-light-50');
  });

  it('displays correct icon for each variant', () => {
    const variants = ['success', 'error', 'warning', 'info'] as const;
    
    variants.forEach((variant) => {
      const { container } = render(
        <RouterWrapper>
          <Alert variant={variant} title={`${variant} alert`} message="Test message" />
        </RouterWrapper>
      );
      
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('fill-current');
    });
  });

  it('does not show link when showLink is false', () => {
    render(
      <RouterWrapper>
        <Alert {...defaultProps} showLink={false} />
      </RouterWrapper>
    );
    
    const link = screen.queryByRole('link');
    expect(link).not.toBeInTheDocument();
  });

  it('shows link when showLink is true', () => {
    render(
      <RouterWrapper>
        <Alert {...defaultProps} showLink={true} />
      </RouterWrapper>
    );
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Learn more');
  });

  it('uses custom link text when provided', () => {
    render(
      <RouterWrapper>
        <Alert 
          {...defaultProps} 
          showLink={true} 
          linkText="En savoir plus"
        />
      </RouterWrapper>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('En savoir plus');
  });

  it('uses custom link href when provided', () => {
    render(
      <RouterWrapper>
        <Alert 
          {...defaultProps} 
          showLink={true} 
          linkHref="/custom-link"
        />
      </RouterWrapper>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/custom-link');
  });

  it('uses default link href when not provided', () => {
    render(
      <RouterWrapper>
        <Alert {...defaultProps} showLink={true} />
      </RouterWrapper>
    );
    
    const link = screen.getByRole('link');
    // React Router transforme '#' en '/' par défaut
    expect(link).toHaveAttribute('href', '/');
  });

  it('applies dark mode classes correctly', () => {
    const { container } = render(
      <RouterWrapper>
        <Alert variant="success" title="Success" message="Success message" />
      </RouterWrapper>
    );
    
    const alertContainer = container.querySelector('.dark\\:border-success-500\\/30');
    expect(alertContainer).toBeInTheDocument();
    expect(alertContainer).toHaveClass('dark:bg-success-500/15');
  });

  it('renders title with correct styling', () => {
    render(
      <RouterWrapper>
        <Alert {...defaultProps} />
      </RouterWrapper>
    );
    
    const title = screen.getByText('Test Alert');
    expect(title).toHaveClass('mb-1', 'text-sm', 'font-semibold', 'text-gray-800', 'dark:text-white/90');
  });

  it('renders message with correct styling', () => {
    render(
      <RouterWrapper>
        <Alert {...defaultProps} />
      </RouterWrapper>
    );
    
    const message = screen.getByText('This is a test message');
    expect(message).toHaveClass('text-sm', 'text-gray-500', 'dark:text-gray-400');
  });

  it('renders with proper structure and layout', () => {
    const { container } = render(
      <RouterWrapper>
        <Alert {...defaultProps} />
      </RouterWrapper>
    );
    
    // Vérifie la structure générale
    const alertDiv = container.firstChild;
    expect(alertDiv).toHaveClass('rounded-xl', 'border', 'p-4');
    
    // Vérifie la disposition flex
    const flexContainer = container.querySelector('.flex.items-start.gap-3');
    expect(flexContainer).toBeInTheDocument();
  });

  it('handles all props combinations correctly', () => {
    render(
      <RouterWrapper>
        <Alert 
          variant="warning"
          title="Complete Alert"
          message="This alert has all props"
          showLink={true}
          linkHref="/documentation"
          linkText="Voir la documentation"
        />
      </RouterWrapper>
    );
    
    expect(screen.getByText('Complete Alert')).toBeInTheDocument();
    expect(screen.getByText('This alert has all props')).toBeInTheDocument();
    
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Voir la documentation');
    expect(link).toHaveAttribute('href', '/documentation');
  });

  it('icon has correct color class for each variant', () => {
    const variantTests = [
      { variant: 'success' as const, expectedClass: 'text-success-500' },
      { variant: 'error' as const, expectedClass: 'text-error-500' },
      { variant: 'warning' as const, expectedClass: 'text-warning-500' },
      { variant: 'info' as const, expectedClass: 'text-blue-light-500' },
    ];

    variantTests.forEach(({ variant, expectedClass }) => {
      const { container } = render(
        <RouterWrapper>
          <Alert variant={variant} title="Test" message="Test message" />
        </RouterWrapper>
      );
      
      const iconContainer = container.querySelector(`.${expectedClass}`);
      expect(iconContainer).toBeInTheDocument();
    });
  });
});