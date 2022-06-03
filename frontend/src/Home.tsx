import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header/Header';
import CurrencyInput from './components/CurrencyInput/CurrencyInput';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';

interface HomeProps {}

const API_KEY = '9df0a1629d6309d1ade5a70e0261a446';
const URL = `http://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`;

// const tableHead = ['ID', 'From', 'To', 'Ratio', 'Actions'];

const tableData = [
  { id: '1', from: 'CAD', to: 'USD', ratio: '1.123' },
  { id: '2', from: 'EUR', to: 'USD', ratio: '1.345' },
  { id: '3', from: 'Swiss Franc', to: 'USD', ratio: '1.678' },
  { id: '4', from: 'USD', to: 'EUR', ratio: '1.912' },
];

export default function Home(props: HomeProps) {
  // Currency Inputs
  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(1);
  const [currency1, setCurrency1] = useState('EUR');
  const [currency2, setCurrency2] = useState('USD');
  const [rates, setRates] = useState([]);
  // Add currency form
  const [isAddCurrencyFormVisible, setIsAddCurrencyFormVisible] =
    useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [ratio, setRatio] = useState('');

  useEffect(() => {
    axios.get(URL).then((response) => {
      // console.log('res!!!!', response.data.rates);
      setRates(response.data.rates);
    });
  }, []);

  function handleLogout() {
    console.log('logout clicked');
    // localStorage.removeItem('user');
  }

  function handleEditClick(index: number) {
    console.log('edit clicked on index:', index);
  }

  function handleDeleteClick(index: number) {
    console.log('delete clicked on index:', index);
    window.confirm(
      `Are you sure you want to delete currency on index ${index}`
    );
  }

  function format(num: any) {
    return num.toFixed(4);
  }

  function handleAmount1Change(amount1: number) {
    // before changing amount1, re-calculate amount2
    setAmount2(format(amount1 * rates[currency2]) / rates[currency1]);
    setAmount1(amount1);
  }

  function handleCurrency1Change(currency1: string) {
    setAmount2(format(amount1 * rates[currency2]) / rates[currency1]);
    setCurrency1(currency1);
  }

  function handleAmount2Change(amount2: number) {
    setAmount1(format(amount2 * rates[currency1]) / rates[currency2]);
    setAmount2(amount2);
  }

  function handleCurrency2Change(currency2: string) {
    setAmount1(format(amount2 * rates[currency1]) / rates[currency2]);
    setCurrency2(currency2);
  }

  function handleAddCurrency() {
    setIsAddCurrencyFormVisible(true);
    console.log('add currency clicked');
  }

  function handleCurrencySubmit() {
    if (!from || !to || !ratio) {
      toast.error('Please fill all fields');
    } else {
      toast.success('Currency added successfully');
      console.log(from, to, ratio);
      setFrom('');
      setTo('');
      setRatio('');
    }
  }

  return (
    <section>
      <Header onLogout={handleLogout} />

      <h1>Currency Calculator</h1>

      <CurrencyInput
        onAmountChange={handleAmount1Change}
        onCurrencyChange={handleCurrency1Change}
        currencies={Object.keys(rates)}
        amount={amount1}
        currency={currency1}
      />

      <CurrencyInput
        onAmountChange={handleAmount2Change}
        onCurrencyChange={handleCurrency2Change}
        currencies={Object.keys(rates)}
        amount={amount2}
        currency={currency2}
      />

      {/* TABLE !!!!!!!!!!!!!!!!!!!!!!! */}
      {/* {rates.length > 0 && ( */}
      <table className='content-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>From</th>
            <th>To</th>
            <th>Ratio</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((item, index) => {
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.from}</td>
                <td>{item.to}</td>
                <td>{item.ratio}</td>
                <td>
                  {
                    <FaEdit
                      className='edit-icon'
                      onClick={() => handleEditClick(index)}
                    />
                  }
                  {
                    <RiDeleteBin2Line
                      className='delete-icon'
                      onClick={() => handleDeleteClick(index)}
                    />
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* )} */}

      <div
        className={
          isAddCurrencyFormVisible
            ? 'add-currency-button disabled'
            : 'add-currency-button'
        }
        onClick={handleAddCurrency}
      >
        <IoMdAdd /> Add Currency
      </div>

      {/* ADD CURRENCY FORM !!!!!!!!!!!!!!!!!!!!! */}
      {isAddCurrencyFormVisible && (
        <div className='add-currency-container'>
          <form onSubmit={handleCurrencySubmit}>
            <input
              type='text'
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder='From'
            />
            <input
              type='text'
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder='To'
            />
            <input
              type='text'
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              placeholder='Ratio'
            />
          </form>

          <div className='add-currency-button-container'>
            <button onClick={handleCurrencySubmit}>Add</button>
            <button onClick={() => setIsAddCurrencyFormVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
