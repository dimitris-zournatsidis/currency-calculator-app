import { useState, useEffect } from 'react';
import CurrencyInput from './CurrencyInput';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_KEY = '9df0a1629d6309d1ade5a70e0261a446';
const URL = `http://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`;

export default function App() {
  // const [amount1, setAmount1] = useState(1);
  // const [amount2, setAmount2] = useState(1);
  // const [currency1, setCurrency1] = useState('EUR');
  // const [currency2, setCurrency2] = useState('USD');
  // const [rates, setRates] = useState([]);

  // // console.log('rates!!', rates);

  // useEffect(() => {
  //   axios.get(URL).then((response) => {
  //     // console.log('res!!!!', response.data.rates);
  //     setRates(response.data.rates);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (!!rates) {
  //     handleAmount1Change(1);
  //   }
  // });

  // function format(num: any) {
  //   return num.toFixed(4);
  // }

  // function handleAmount1Change(amount1: number) {
  //   // before changing amount1, re-calculate amount2
  //   setAmount2(format(amount1 * rates[currency2]) / rates[currency1]);
  //   setAmount1(amount1);
  // }

  // function handleCurrency1Change(currency1: string) {
  //   setAmount2(format(amount1 * rates[currency2]) / rates[currency1]);
  //   setCurrency1(currency1);
  // }

  // function handleAmount2Change(amount2: number) {
  //   setAmount1(format(amount2 * rates[currency1]) / rates[currency2]);
  //   setAmount2(amount2);
  // }

  // function handleCurrency2Change(currency2: string) {
  //   setAmount1(format(amount2 * rates[currency1]) / rates[currency2]);
  //   setCurrency2(currency2);
  // }

  return (
    // <div>
    //   <h1>Currency Calculator</h1>

    //   <CurrencyInput
    //     onAmountChange={handleAmount1Change}
    //     onCurrencyChange={handleCurrency1Change}
    //     currencies={Object.keys(rates)}
    //     amount={amount1}
    //     currency={currency1}
    //   />

    //   <CurrencyInput
    //     onAmountChange={handleAmount2Change}
    //     onCurrencyChange={handleCurrency2Change}
    //     currencies={Object.keys(rates)}
    //     amount={amount2}
    //     currency={currency2}
    //   />
    // </div>
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </Router>
      <ToastContainer position='bottom-center' autoClose={3000} />
    </>
  );
}
