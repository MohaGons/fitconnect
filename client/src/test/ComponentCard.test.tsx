import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComponentCard from '../components/common/ComponentCard';

describe('ComponentCard Component', () => {
  it('renders with title and children', () => {
    render(
      <ComponentCard title="Test Card">
        <div>Contenu de test</div>
      </ComponentCard>
    );
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Contenu de test')).toBeInTheDocument();
  });

  it('renders with description when provided', () => {
    render(
      <ComponentCard title="Test Card" desc="Description de test">
        <div>Contenu</div>
      </ComponentCard>
    );
    
    expect(screen.getByText('Description de test')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ComponentCard title="Test" className="custom-class">
        <div>Contenu</div>
      </ComponentCard>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders without description when not provided', () => {
    render(
      <ComponentCard title="Test Card">
        <div>Contenu</div>
      </ComponentCard>
    );
    
    const card = screen.getByText('Test Card').closest('div');
    expect(card).toBeInTheDocument();
  });
}); 