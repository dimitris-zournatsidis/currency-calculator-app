import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header/Header';
import CurrencyInput from './components/CurrencyInput/CurrencyInput';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';
interface IRates {
  _id: string;
  from: string;
  to: string;
  ratio: number;
}

const API_URL = 'http://localhost:5000/api/currency_exchange_rates';

export default function Home() {
  const localStorageData = localStorage.getItem('user');
  const [rates, setRates] = useState<IRates[]>();

  // Currency Input / Select
  const [amountFrom, setAmountFrom] = useState<number>();
  const [amountTo, setAmountTo] = useState<number>();
  const [selectedCurrencyFrom, setSelectedCurrencyFrom] = useState('');
  const [selectedCurrencyTo, setSelectedCurrencyTo] = useState('');
  const [selectedExchangeRatio, setSelectedExchangeRatio] = useState<IRates>();

  // Crud currency form
  const [isAddCurrencyFormVisible, setIsAddCurrencyFormVisible] =
    useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [ratio, setRatio] = useState('');
  const [selectedIdToEdit, setSelectedIdToEdit] = useState('');

  const [crudAction, setCrudAction] = useState('');

  // Dropdown options
  const [fromCurrenciesDropdownOptions, setFromCurrenciesDropdownOptions] =
    useState<string[]>([]);
  const [toCurrenciesDropdownOptions, setToCurrenciesDropdownOptions] =
    useState<string[]>([]);

  // Get all Currency Exchanges
  useEffect(() => {
    console.log('xanaetrexe!!!!!!!!');
    axios.get(API_URL).then((res) => {
      setRates(res.data);

      let from: string[] = [];
      let to: string[] = [];
      res.data.map((item: IRates, index: number) => {
        if (index === 0) {
          setSelectedCurrencyFrom(item.from);
          setSelectedCurrencyTo(item.to);
        }
        from.push(item.from);
        to.push(item.to);
        return true;
      });
      setFromCurrenciesDropdownOptions(from);
      setToCurrenciesDropdownOptions(to);
    });
  }, [crudAction]);

  // Get one Currency Exchange
  useEffect(() => {
    console.log('xanaetrexe to ena 11111');
    axios
      .get(API_URL + `/${selectedCurrencyFrom}/${selectedCurrencyTo}`)
      .then((res) => {
        // console.log('res data!!', res.data);
        setSelectedExchangeRatio(res.data);
        handleCurrencyFromChange(selectedCurrencyFrom);
        handleCurrencyToChange(selectedCurrencyTo);
      });
  }, [selectedCurrencyFrom, selectedCurrencyTo]);

  function handleLogout() {
    localStorage.removeItem('user');
    window.location.reload();
  }

  function handleEditClick(item: IRates) {
    setSelectedIdToEdit(item._id);
    setIsAddCurrencyFormVisible(true);
    setFrom(item.from);
    setTo(item.to);
    setRatio(item.ratio.toString());
  }

  function handleDeleteClick(id: string) {
    window.confirm('Are you sure you want to delete this currency exchange?');
    if (localStorageData) {
      const localStorageDataJson = JSON.parse(localStorageData);
      axios
        .delete(API_URL + `/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorageDataJson.token}`,
          },
        })
        .then(() => setCrudAction('Deleted'));
    }
  }

  function AddMoreClick() {
    setIsAddCurrencyFormVisible(true);
    setSelectedIdToEdit('');
    setFrom('');
    setTo('');
    setRatio('');
  }

  function format(num: any) {
    return num.toFixed(4);
  }

  // normal calculation for amount
  function handleAmountFromChange(amount: number) {
    setAmountFrom(amount);
    if (selectedExchangeRatio) {
      setAmountTo(format(amount * selectedExchangeRatio.ratio));
    }
  }

  // normal calculation when changing currency selection
  function handleCurrencyFromChange(selectedCurrency: string) {
    setSelectedCurrencyFrom(selectedCurrency);
    if (selectedExchangeRatio && amountFrom) {
      setAmountTo(format(amountFrom * selectedExchangeRatio.ratio));
      console.log('FROM CURR CHANGE', selectedExchangeRatio.ratio);
    }
  }

  // reverse calculation from amount
  function handleAmountToChange(amount: number) {
    setAmountTo(amount);
    if (selectedExchangeRatio) {
      setAmountFrom(format(amount / selectedExchangeRatio.ratio));
    }
  }

  // reverse calculation when changing currency selection
  function handleCurrencyToChange(selectedCurrency: string) {
    setSelectedCurrencyTo(selectedCurrency);
    if (selectedExchangeRatio && amountTo) {
      setAmountFrom(format(amountTo / selectedExchangeRatio.ratio));
      console.log('TO CURR CHANGE', selectedExchangeRatio.ratio);
    }
  }

  function handleCurrencySubmit() {
    if (!from || !to || !ratio) {
      toast.error('Please fill all fields');
    } else {
      const currencyData = {
        from: from,
        to: to,
        ratio: ratio,
      };

      if (localStorageData) {
        const localStorageDataJson = JSON.parse(localStorageData);
        if (selectedIdToEdit && selectedIdToEdit !== '') {
          axios
            .put(API_URL + `/${selectedIdToEdit}`, currencyData, {
              headers: {
                Authorization: `Bearer ${localStorageDataJson.token}`,
              },
            })
            .then(() => {
              setCrudAction('Updated');
              // toast.success('Currency added successfully');
              setFrom('');
              setTo('');
              setRatio('');
            });
        } else {
          axios
            .post(API_URL, currencyData, {
              headers: {
                Authorization: `Bearer ${localStorageDataJson.token}`,
              },
            })
            .then(() => {
              setCrudAction('Inserted');
              // toast.success('Currency added successfully');
              setFrom('');
              setTo('');
              setRatio('');
            });
        }
      }
    }
  }

  return (
    <section>
      <Header onLogout={handleLogout} />

      <h1>Currency Calculator</h1>

      {/* FROM */}
      <CurrencyInput
        onAmountChange={handleAmountFromChange}
        onCurrencyChange={handleCurrencyFromChange}
        currencies={fromCurrenciesDropdownOptions}
        amount={amountFrom}
        currency={selectedCurrencyFrom}
      />

      {/* TO */}
      <CurrencyInput
        onAmountChange={handleAmountToChange}
        onCurrencyChange={handleCurrencyToChange}
        currencies={toCurrenciesDropdownOptions}
        amount={amountTo}
        currency={selectedCurrencyTo}
      />

      {/* CURRENCIES TABLE */}
      {rates && rates.length > 0 && (
        <table className='content-table'>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Ratio</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rates.map((item) => {
              return (
                <tr key={item._id}>
                  <td>{item.from}</td>
                  <td>{item.to}</td>
                  <td>{format(item.ratio)}</td>
                  <td>
                    {
                      <FaEdit
                        className='edit-icon'
                        onClick={() => handleEditClick(item)}
                      />
                    }
                    {
                      <RiDeleteBin2Line
                        className='delete-icon'
                        onClick={() => handleDeleteClick(item._id)}
                      />
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div
        className={isAddCurrencyFormVisible ? 'add-more disabled' : 'add-more'}
        onClick={() => AddMoreClick()}
      >
        <IoMdAdd /> Add More
      </div>

      {/* ADD CURRENCY FORM */}
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
            {selectedIdToEdit ? (
              <button onClick={handleCurrencySubmit} className='update-button'>
                Update
              </button>
            ) : (
              <button onClick={handleCurrencySubmit} className='add-button'>
                Add
              </button>
            )}
            <button onClick={() => setIsAddCurrencyFormVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
