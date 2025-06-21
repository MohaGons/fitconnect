import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../components/form/input/InputField';

describe('InputField Component', () => {
  it('renders with default props', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with custom placeholder', () => {
    render(<Input placeholder="Entrez votre email" />);
    expect(screen.getByPlaceholderText('Entrez votre email')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('displays error state correctly', () => {
    render(<Input error={true} hint="Erreur de validation" />);
    const input = screen.getByRole('textbox');
    const hint = screen.getByText('Erreur de validation');
    
    expect(input).toHaveClass('border-error-500');
    expect(hint).toHaveClass('text-error-500');
  });

  it('displays success state correctly', () => {
    render(<Input success={true} hint="Validation réussie" />);
    const input = screen.getByRole('textbox');
    const hint = screen.getByText('Validation réussie');
    
    expect(input).toHaveClass('border-success-500');
    expect(hint).toHaveClass('text-success-500');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders with different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
  });
}); 