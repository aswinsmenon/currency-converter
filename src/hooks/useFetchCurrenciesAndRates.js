import { useState, useEffect } from 'react';

export const useFetchCurrenciesAndRates = () => {
  const [error, setError] = useState(false);
  const [currencies, setCurrencies] = useState(null);
  const [rates, setRates] = useState(null);

  useEffect(() => {
    const getCurrencies = async () => {
      fetch(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
      )
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            setCurrencies(data);
          }
        })
        .catch((error) => {
          setError(true);
        });
    };

    const getRates = async () => {
      fetch(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
      )
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            if (data?.usd) {
              setRates(data?.usd);
            } else {
              setError(true);
            }
          }
        })
        .catch((error) => {
          setError(true);
        });
    };

    getCurrencies();
    getRates();
  }, []);

  return {
    error,
    currencies,
    rates,
  };
};
