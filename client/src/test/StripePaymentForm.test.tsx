import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// Mock des dépendances principales
vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: vi.fn(),
  useElements: vi.fn(),
  PaymentElement: vi.fn(() => <div data-testid="payment-element">Mock Payment Element</div>),
  Elements: vi.fn(({ children }) => <div>{children}</div>),
}));

vi.mock('../services/stripeService', () => ({
  stripeService: {
    confirmPayment: vi.fn(),
  },
}));

vi.mock('../hooks/useUserRole', () => ({
  useUserRole: vi.fn(),
}));

vi.mock('../constants/stripe', () => ({
  STRIPE_CONFIG: {
    SUBSCRIPTION_AMOUNT: 99,
    CONFIRM_PARAMS: { return_url: 'https://example.com' },
  },
  STRIPE_ERRORS: {
    MISSING_ELEMENTS: 'Stripe Elements non initialisé',
    UNEXPECTED_ERROR: 'Une erreur inattendue s\'est produite',
  },
}));

import { useStripe, useElements } from '@stripe/react-stripe-js';
import { stripeService } from '../services/stripeService';
import { useUserRole } from '../hooks/useUserRole';
import StripePaymentForm from '../components/StripePaymentForm';

const mockUseStripe = useStripe as ReturnType<typeof vi.fn>;
const mockUseElements = useElements as ReturnType<typeof vi.fn>;
const mockUseUserRole = useUserRole as ReturnType<typeof vi.fn>;

describe('StripePaymentForm', () => {
  const defaultProps = {
    clientSecret: 'pi_test_client_secret',
    paymentIntentId: 'pi_test_payment_intent',
    onSuccess: vi.fn(),
    onError: vi.fn(),
  };

  const mockStripe = { confirmPayment: vi.fn() };
  const mockElements = { getElement: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseStripe.mockReturnValue(mockStripe);
    mockUseElements.mockReturnValue(mockElements);
    mockUseUserRole.mockReturnValue({ coachId: '123', isLoading: false });
  });

  it('renders payment form with payment element and button', () => {
    render(<StripePaymentForm {...defaultProps} />);
    
    expect(screen.getByTestId('payment-element')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /payer 99 €/i })).toBeInTheDocument();
  });

  it('disables button when stripe is not loaded', () => {
    mockUseStripe.mockReturnValue(null);
    
    render(<StripePaymentForm {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('handles successful payment flow', async () => {
    mockStripe.confirmPayment.mockResolvedValue({ error: null });
    (stripeService.confirmPayment as any).mockResolvedValue({ success: true });
    
    render(<StripePaymentForm {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('handles payment errors correctly', async () => {
    mockStripe.confirmPayment.mockResolvedValue({ 
      error: { message: 'Carte déclinée' } 
    });
    
    render(<StripePaymentForm {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith('Carte déclinée');
    });
  });
});