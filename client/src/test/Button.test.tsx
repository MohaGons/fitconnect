// src/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/ui/button/Button';

describe('Button Component', () => {
  it('renders with the correct label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled={true}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});