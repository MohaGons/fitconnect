import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Radio from '../components/form/input/Radio';

describe('Radio Component', () => {
  it('renders with label', () => {
    const handleChange = vi.fn();
    render(
      <Radio
        id="test-radio"
        name="test-group"
        value="test-value"
        checked={false}
        label="Test Radio"
        onChange={handleChange}
      />
    );
    
    expect(screen.getByText('Test Radio')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(
      <Radio
        id="test-radio"
        name="test-group"
        value="test-value"
        checked={false}
        label="Test Radio"
        onChange={handleChange}
      />
    );
    
    const radio = screen.getByRole('radio');
    fireEvent.click(radio);
    
    expect(handleChange).toHaveBeenCalledWith('test-value');
  });

  it('is checked when checked prop is true', () => {
    const handleChange = vi.fn();
    render(
      <Radio
        id="test-radio"
        name="test-group"
        value="test-value"
        checked={true}
        label="Test Radio"
        onChange={handleChange}
      />
    );
    
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('is disabled when disabled prop is true', () => {
    const handleChange = vi.fn();
    render(
      <Radio
        id="test-radio"
        name="test-group"
        value="test-value"
        checked={false}
        label="Test Radio"
        onChange={handleChange}
        disabled={true}
      />
    );
    
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
    
    fireEvent.click(radio);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Radio
        id="test-radio"
        name="test-group"
        value="test-value"
        checked={false}
        label="Test Radio"
        onChange={handleChange}
        className="custom-class"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
}); 