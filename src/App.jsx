import './App.css';

import { CurrencyConverter } from './components/currencyConverter';

export const App = () => {
  return (
    <div className='App'>
      <h1>Currency Converter</h1>
      <CurrencyConverter />
    </div>
  );
};
