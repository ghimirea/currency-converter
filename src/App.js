import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CurrencyRow from './components/CurrencyRow';

const BASE_URL = 'https://api.exchangeratesapi.io/latest';

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [exchangeRate, setExchangeRate] = useState();

  let toAmount, fromAmount;

  const getExchangeRate = async () => {
    const result = await axios.get(BASE_URL);
    const firstCurrency = Object.keys(result.data.rates)[0];
    setCurrencyOptions([result.data.base, ...Object.keys(result.data.rates)]);
    setFromCurrency(result.data.base);
    setToCurrency(firstCurrency);
    setExchangeRate(result.data.rates[firstCurrency]);
  };

  const changeCurrency = async () => {
    const result = await axios.get(
      `${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`
    );
    setExchangeRate(result.data.rates[toCurrency])
  };

  useEffect(() => {
    getExchangeRate();
  }, []);
  useEffect(() => {
    changeCurrency();
  }, [fromCurrency, toCurrency]);

  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
    //console.log(fromAmount, toAmount);
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
    console.log(fromAmount, toAmount);
  }

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value);
    //setAmountInFromCurrency(true);
  };
  const handleToAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  };
  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className='equals'>=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
