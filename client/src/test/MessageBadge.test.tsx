import { describe, it, expect } from 'vitest';
import { render, screen,  } from '@testing-library/react';
import MessageBadge from '../components/ui/MessageBadge';

describe('MessageBadge Component', () => {
  const defaultProps = {
    count: 5,
  };

  describe('Rendering', () => {
    it('renders with MessageSquare icon', () => {
      const { container } = render(<MessageBadge {...defaultProps} />);
      
      // Vérifie la présence de l'icône MessageSquare de Lucide
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-5', 'w-5');
    });

    it('renders with count badge when count > 0', () => {
      render(<MessageBadge count={3} />);
      
      const badge = screen.getByText('3');
      expect(badge).toBeInTheDocument();
    });

    it('does not render count badge when count is 0', () => {
      render(<MessageBadge count={0} />);
      
      const badge = screen.queryByText('0');
      expect(badge).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<MessageBadge count={1} className="custom-class" />);
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Count display logic', () => {
    it('displays exact count when count <= 99', () => {
      const testCounts = [1, 25, 50, 99];
      
      testCounts.forEach(count => {
        const { rerender } = render(<MessageBadge count={count} />);
        expect(screen.getByText(count.toString())).toBeInTheDocument();
        rerender(<div />); // Clear for next iteration
      });
    });

    it('displays "99+" when count > 99', () => {
      const testCounts = [100, 150, 999, 1000];
      
      testCounts.forEach(count => {
        const { rerender } = render(<MessageBadge count={count} />);
        expect(screen.getByText('99+')).toBeInTheDocument();
        rerender(<div />); // Clear for next iteration
      });
    });

    it('handles edge case of exactly 99', () => {
      render(<MessageBadge count={99} />);
      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.queryByText('99+')).not.toBeInTheDocument();
    });

    it('handles edge case of exactly 100', () => {
      render(<MessageBadge count={100} />);
      expect(screen.getByText('99+')).toBeInTheDocument();
      expect(screen.queryByText('100')).not.toBeInTheDocument();
    });
  });

  describe('Styling and CSS classes', () => {
    it('applies base classes for zero count', () => {
      const { container } = render(<MessageBadge count={0} />);
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass(
        'relative',
        'p-2',
        'text-gray-500',
        'hover:text-gray-700',
        'transition-colors'
      );
    });

    it('applies base classes for non-zero count', () => {
      const { container } = render(<MessageBadge count={5} />);
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass(
        'relative',
        'p-2',
        'text-gray-500',
        'hover:text-gray-700',
        'transition-colors',
        'cursor-pointer'
      );
    });

    it('applies correct badge styling', () => {
      render(<MessageBadge count={1} />);
      
      const badge = screen.getByText('1');
      expect(badge).toHaveClass(
        'absolute',
        '-top-1',
        '-right-1',
        'bg-red-500',
        'text-white',
        'text-xs',
        'rounded-full',
        'h-5',
        'w-5',
        'flex',
        'items-center',
        'justify-center',
        'min-w-[20px]',
        'font-medium',
        'animate-pulse'
      );
    });

    it('does not have cursor-pointer class when count is 0', () => {
      const { container } = render(<MessageBadge count={0} />);
      
      const wrapper = container.firstChild;
      expect(wrapper).not.toHaveClass('cursor-pointer');
    });

    it('has cursor-pointer class when count > 0', () => {
      const { container } = render(<MessageBadge count={1} />);
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('cursor-pointer');
    });
  });

 

  describe('Badge positioning and visibility', () => {
    it('positions badge correctly relative to icon', () => {
      render(<MessageBadge count={1} />);
      
      const badge = screen.getByText('1');
      expect(badge).toHaveClass('absolute', '-top-1', '-right-1');
    });

    it('badge is visible when count > 0', () => {
      render(<MessageBadge count={10} />);
      
      const badge = screen.getByText('10');
      expect(badge).toBeVisible();
    });

    it('badge is not present when count is 0', () => {
      const { container } = render(<MessageBadge count={0} />);
      
      const badge = container.querySelector('.bg-red-500');
      expect(badge).not.toBeInTheDocument();
    });
  });

  describe('Icon properties', () => {
    it('renders MessageSquare icon with correct size', () => {
      const { container } = render(<MessageBadge count={1} />);
      
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-5', 'w-5');
    });

    it('icon is present regardless of count', () => {
      const { container: container1 } = render(<MessageBadge count={0} />);
      const { container: container2 } = render(<MessageBadge count={5} />);
      
      const icon1 = container1.querySelector('svg');
      const icon2 = container2.querySelector('svg');
      
      expect(icon1).toBeInTheDocument();
      expect(icon2).toBeInTheDocument();
    });
  });


  describe('Edge cases and error handling', () => {
    it('handles negative count gracefully', () => {
      render(<MessageBadge count={-1} />);
      
      // Should render like count > 0 case
      const badge = screen.getByText('-1');
      expect(badge).toBeInTheDocument();
    });

    it('handles very large numbers', () => {
      render(<MessageBadge count={999999} />);
      
      const badge = screen.getByText('99+');
      expect(badge).toBeInTheDocument();
    });

    it('handles decimal numbers by displaying them as-is if <= 99', () => {
      render(<MessageBadge count={5.5} />);
      
      const badge = screen.getByText('5.5');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('badge has pulse animation when count > 0', () => {
      render(<MessageBadge count={1} />);
      
      const badge = screen.getByText('1');
      expect(badge).toHaveClass('animate-pulse');
    });

    it('no animation applied to main wrapper', () => {
      const { container } = render(<MessageBadge count={5} />);
      
      const wrapper = container.firstChild;
      expect(wrapper).not.toHaveClass('animate-pulse');
    });
  });



  describe('Visual states', () => {
    it('applies hover styles correctly', () => {
      const { container } = render(<MessageBadge count={3} />);
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('hover:text-gray-700');
    });

    it('applies transition effects', () => {
      const { container } = render(<MessageBadge count={1} />);
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('transition-colors');
    });
  });
});