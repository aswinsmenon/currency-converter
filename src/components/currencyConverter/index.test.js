import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencyConverter } from './index';
import { useFetchCurrenciesAndRates } from '../../hooks/useFetchCurrenciesAndRates';

jest.mock('../../hooks/useFetchCurrenciesAndRates');

describe('CurrencyConverter Component', () => {
  beforeEach(() => {
    useFetchCurrenciesAndRates.mockReturnValue({
      error: null,
      currencies: {
        USD: 'United States Dollar',
        EUR: 'Euro',
        JPY: 'Japanese Yen',
      },
      rates: {
        USD: 1,
        EUR: 0.92,
        JPY: 150,
      },
    });
  });

  test('renders the component with initial UI', () => {
    render(<CurrencyConverter />);

    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Convert/i })
    ).toBeInTheDocument();
  });

  test('displays error message if there is an error', () => {
    useFetchCurrenciesAndRates.mockReturnValueOnce({
      error: 'Error',
      currencies: null,
      rates: null,
    });
    render(<CurrencyConverter />);

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  test('performs currency conversion correctly', () => {
    render(<CurrencyConverter />);

    fireEvent.change(screen.getByTestId('amount'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByTestId('from-currency'), {
      target: { value: 'USD' },
    });
    fireEvent.change(screen.getByTestId('to-currency'), {
      target: { value: 'EUR' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));

    expect(screen.getByText('100 USD = 92.00 EUR')).toBeInTheDocument();
  });

  test('displays same amount if currencies are the same', () => {
    render(<CurrencyConverter />);

    fireEvent.change(screen.getByTestId('amount'), {
      target: { value: '50' },
    });
    fireEvent.change(screen.getByTestId('from-currency'), {
      target: { value: 'USD' },
    });
    fireEvent.change(screen.getByTestId('to-currency'), {
      target: { value: 'USD' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));

    expect(screen.getByText('50 USD = 50 USD')).toBeInTheDocument();
  });

  test('handles invalid input gracefully', () => {
    render(<CurrencyConverter />);

    fireEvent.change(screen.getByTestId('amount'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByTestId('from-currency'), {
      target: { value: 'USD' },
    });
    fireEvent.change(screen.getByTestId('to-currency'), {
      target: { value: 'EUR' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Convert/i }));

    expect(screen.queryByText(/USD =/)).not.toBeInTheDocument();
  });
});
