import React, { useState } from 'react';
import { useFetchCurrenciesAndRates } from '../../hooks/useFetchCurrenciesAndRates';

import './index.css';

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [result, setResult] = useState(0);
  const { error, currencies, rates } = useFetchCurrenciesAndRates();

  const handleAmountChange = (e) => {
    setResult(0);
    setAmount(parseFloat(e.target.value) || 0);
  };

  const handleFromCurrencyChange = (e) => {
    setResult(0);
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setResult(0);
    setToCurrency(e.target.value);
  };

  const convertCurrency = (e) => {
    e.preventDefault();
    if (fromCurrency === toCurrency) {
      setResult(amount);
      return;
    }
    if (rates[fromCurrency] && rates[toCurrency]) {
      const usdAmount = amount / rates[fromCurrency]; // Convert to USD
      const convertedAmount = usdAmount * rates[toCurrency]; // USD to target currency
      setResult(convertedAmount.toFixed(2));
    }
  };

  if (error) {
    return <div className='converter-container'>Something went wrong...</div>;
  }

  if (currencies) {
    return (
      <form className='converter-form'>
        <div className='form-container'>
          <div className='form-group'>
            <label htmlFor='amount'>Amount</label>
            <input
              data-testid='amount'
              name='amount'
              type='number'
              value={amount}
              onChange={handleAmountChange}
              placeholder='Enter amount'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='fromCurrency'>From</label>
            <select
              data-testid='from-currency'
              name='fromCurrency'
              value={fromCurrency}
              onChange={handleFromCurrencyChange}
            >
              {Object.keys(currencies).map((code) => (
                <option key={code} value={code}>
                  {currencies[code]} ({code})
                </option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='toCurrency'>To</label>
            <select
              data-testid='to-currency'
              name='toCurrency'
              value={toCurrency}
              onChange={handleToCurrencyChange}
            >
              {Object.keys(currencies).map((code) => (
                <option key={code} value={code}>
                  {currencies[code]} ({code})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={convertCurrency}>Convert</button>
        {result > 0 && (
          <div className='result'>
            {amount} {fromCurrency} = {result} {toCurrency}
          </div>
        )}
      </form>
    );
  }

  return <div className='converter-container'>Loading...</div>;
};
