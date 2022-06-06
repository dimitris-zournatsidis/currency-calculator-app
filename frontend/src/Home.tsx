import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header/Header';
import CurrencyInput from './components/CurrencyInput/CurrencyInput';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';
interface IRate {
  _id: string;
  from: string;
  to: string;
  ratio: number;
}

const API_CURRENCY_URL = 'http://localhost:5000/api/currency_exchange_rates';

export default function Home() {
  // the code below is used for crud operations & for checking if a user is logged in
  const localStorageData = localStorage.getItem('user');

  const [rates, setRates] = useState<IRate[]>();

  // Currency Input / Select
  const [amountFrom, setAmountFrom] = useState<number>(1);
  const [amountTo, setAmountTo] = useState<number>();
  const [selectedCurrencyFrom, setSelectedCurrencyFrom] = useState('');
  const [selectedCurrencyTo, setSelectedCurrencyTo] = useState('');
  const [selectedExchangeRatio, setSelectedExchangeRatio] = useState<number>();

  // CRUD currency form
  const [isCurrencyFormVisible, setIsCurrencyFormVisible] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [ratio, setRatio] = useState('');
  const [selectedIdToEdit, setSelectedIdToEdit] = useState('');

  // the line below is used to force re-render
  const [crudAction, setCrudAction] = useState('');

  // Dropdown options
  const [currenciesDropdownOptions, setCurrenciesDropdownOptions] = useState<
    string[]
  >([]);

  // Get all Currency Exchanges
  useEffect(() => {
    axios.get(API_CURRENCY_URL).then((res) => {
      setRates(res.data);

      let temp: string[] = [];
      // eslint-disable-next-line array-callback-return
      res.data.map((item: IRate, index: number) => {
        if (index === 0) {
          setSelectedCurrencyFrom(item.from);
          setSelectedCurrencyTo(item.to);
        }
        temp.push(item.from, item.to);
      });
      const uniqueArray = [...Array.from(new Set(temp))];
      setCurrenciesDropdownOptions(uniqueArray);
    });
  }, [crudAction]);

  // Get one Currency Exchange
  useEffect(() => {
    axios
      .get(API_CURRENCY_URL + `/${selectedCurrencyFrom}/${selectedCurrencyTo}`)
      .then((res) => {
        if (res.data !== null) {
          setSelectedExchangeRatio(res.data.ratio);
        } else {
          axios
            .get(
              API_CURRENCY_URL +
                `/${selectedCurrencyTo}/${selectedCurrencyFrom}`
            )
            .then((res) => {
              if (res.data !== null) {
                setSelectedExchangeRatio(1 / res.data.ratio);
              } else if (selectedCurrencyFrom === selectedCurrencyTo) {
                setSelectedExchangeRatio(1);
              } else {
                toast.warning(
                  'No such currency exchange exists! Please try another combination.'
                );
              }
            });
        }
      });
  }, [selectedCurrencyFrom, selectedCurrencyTo]);

  // Re-calculate
  useEffect(() => {
    if (selectedExchangeRatio && amountFrom) {
      setAmountTo(format(amountFrom * selectedExchangeRatio));
    } else {
      setAmountTo(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExchangeRatio]);

  // Edit Currency
  function handleEditClick(item: IRate) {
    setSelectedIdToEdit(item._id);
    setIsCurrencyFormVisible(true);

    setFrom(item.from);
    setTo(item.to);
    setRatio(item.ratio.toString());
  }

  // Delete Currency
  function handleDeleteClick(id: string) {
    if (
      window.confirm('Are you sure you want to delete this currency exchange?')
    ) {
      if (localStorageData) {
        const localStorageDataJson = JSON.parse(localStorageData);
        axios
          .delete(API_CURRENCY_URL + `/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorageDataJson.token}`,
            },
          })
          .then(() => setCrudAction('Deleted'));
      }
    }
  }

  function addMoreClick() {
    setIsCurrencyFormVisible(true);
    setSelectedIdToEdit('');

    setFrom('');
    setTo('');
    setRatio('');
  }

  function format(num: any) {
    return num.toFixed(4);
  }

  // Re-calculate amount-to when changing amount-from
  function handleAmountFromChange(amount: number) {
    setAmountFrom(amount);
    if (selectedExchangeRatio) {
      setAmountTo(format(amount * selectedExchangeRatio));
    }
  }

  // Re-calculate amount-from when changing amount-to
  function handleAmountToChange(amount: number) {
    setAmountTo(amount);
    if (selectedExchangeRatio) {
      setAmountFrom(format(amount / selectedExchangeRatio));
    }
  }

  // Calculation when changing currency-from
  function handleCurrencyFromChange(selectedCurrency: string) {
    setSelectedCurrencyFrom(selectedCurrency);
  }

  // Calculation when changing currency-to
  function handleCurrencyToChange(selectedCurrency: string) {
    setSelectedCurrencyTo(selectedCurrency);
  }

  // Submit currency for Add or Update
  function handleCurrencySubmit() {
    if (!from || !to || !ratio) {
      toast.error('Please fill all fields');
    } else {
      const currencyData = {
        from: from,
        to: to,
        ratio: ratio,
      };

      // check if there is a user logged in
      if (localStorageData) {
        const localStorageDataJson = JSON.parse(localStorageData);
        // edit selected currency exchange
        if (selectedIdToEdit && selectedIdToEdit !== '') {
          axios
            .put(API_CURRENCY_URL + `/${selectedIdToEdit}`, currencyData, {
              headers: {
                Authorization: `Bearer ${localStorageDataJson.token}`,
              },
            })
            .then(() => {
              // trigger a re-render
              setCrudAction('Updated');

              setFrom('');
              setTo('');
              setRatio('');
            });
        } else {
          // add form
          axios
            .post(API_CURRENCY_URL, currencyData, {
              headers: {
                Authorization: `Bearer ${localStorageDataJson.token}`,
              },
            })
            .then(() => {
              // trigger a re-render
              setCrudAction('Inserted');

              setFrom('');
              setTo('');
              setRatio('');
            });
        }
      }
    }
  }

  // Logout User
  function handleLogout() {
    localStorage.removeItem('user');
    window.location.reload();
  }

  return (
    <section>
      <Header onLogout={handleLogout} />

      <h1>Currency Calculator</h1>

      {/* FROM */}
      <CurrencyInput
        onAmountChange={handleAmountFromChange}
        onCurrencyChange={handleCurrencyFromChange}
        currencies={currenciesDropdownOptions}
        amount={amountFrom}
        currency={selectedCurrencyFrom}
      />

      {/* TO */}
      <CurrencyInput
        onAmountChange={handleAmountToChange}
        onCurrencyChange={handleCurrencyToChange}
        currencies={currenciesDropdownOptions}
        amount={amountTo}
        currency={selectedCurrencyTo}
      />

      {/* CURRENCIES TABLE - Edit and delete actions are visible only if user is logged in */}
      {rates && rates.length > 0 && (
        <table className='content-table'>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Ratio</th>
              {localStorageData && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {rates.map((item) => {
              return (
                <tr key={item._id}>
                  <td>{item.from}</td>
                  <td>{item.to}</td>
                  <td>{format(item.ratio)}</td>
                  {localStorageData && (
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
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ADD MORE BUTTON || information on when add, update, delete are available */}
      {localStorageData ? (
        <div
          className={isCurrencyFormVisible ? 'add-more disabled' : 'add-more'}
          onClick={() => addMoreClick()}
        >
          <IoMdAdd /> Add More
        </div>
      ) : (
        <p className='info-text'>
          * In order to add, update or delete a currency exchange ratio, you
          have to be logged in
        </p>
      )}

      {/* CURRENCY FORM */}
      {isCurrencyFormVisible && (
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
            <button
              onClick={handleCurrencySubmit}
              className={selectedIdToEdit ? 'update-button' : 'add-button'}
            >
              {selectedIdToEdit ? 'Update' : 'Add'}
            </button>

            <button onClick={() => setIsCurrencyFormVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
