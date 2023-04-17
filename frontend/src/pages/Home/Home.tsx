import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import CurrencyInput from '../../components/CurrencyInput/CurrencyInput';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';
import './Home.css';
import Modal from '../../components/Modal/Modal';
import InputField from '../../components/InputField/InputField';

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

  // the state below is used to re-render
  const [crudAction, setCrudAction] = useState(false);

  // Dropdown options
  const [currenciesDropdownOptions, setCurrenciesDropdownOptions] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setCrudAction(false);
  }, [crudAction]);

  // Get one Currency Exchange
  useEffect(() => {
    axios.get(API_CURRENCY_URL + `/${selectedCurrencyFrom}/${selectedCurrencyTo}`).then((res) => {
      if (res.data !== null) {
        setSelectedExchangeRatio(res.data.ratio);
      } else {
        axios
          .get(API_CURRENCY_URL + `/${selectedCurrencyTo}/${selectedCurrencyFrom}`)
          .then((res) => {
            if (res.data !== null) {
              setSelectedExchangeRatio(1 / res.data.ratio);
            } else if (selectedCurrencyFrom === selectedCurrencyTo) {
              setSelectedExchangeRatio(1);
            } else {
              toast.warning('No such currency exchange exists! Please try another combination.');
            }
          });
      }
    });
  }, [selectedCurrencyFrom, selectedCurrencyTo]);

  // Recalculate
  useEffect(() => {
    if (selectedExchangeRatio && amountFrom) {
      setAmountTo(format(amountFrom * selectedExchangeRatio));
    } else {
      setAmountTo(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExchangeRatio]);

  // When Form is visible, scroll to buttons container
  useEffect(() => {
    if (isCurrencyFormVisible) {
      const element = document.getElementById('buttons-id');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  function resetAllFields() {
    setFrom('');
    setTo('');
    setRatio('');
  }

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
    if (localStorageData) {
      const localStorageDataJson = JSON.parse(localStorageData);
      axios
        .delete(API_CURRENCY_URL + `/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorageDataJson.token}`,
          },
        })
        .then(() => {
          setCrudAction(true);
          setIsModalOpen(false);
          toast.success('Currency exchange was deleted successfully.');
        });
    }
  }

  function addMoreClick() {
    setIsCurrencyFormVisible(true);
    setSelectedIdToEdit('');
    resetAllFields();
  }

  function format(num: any) {
    return num.toFixed(4);
  }

  // Set amount-from and recalculate amount-to
  function handleAmountFromChange(amount: number) {
    setAmountFrom(amount);
    if (selectedExchangeRatio) {
      setAmountTo(format(amount * selectedExchangeRatio));
    }
  }

  // Set amount-to and recalculate amount-from
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

  function isString(x: string) {
    return new RegExp('([\'"]?)[a-zA-Z]+\\1$').test(x);
  }

  // Submit currency for Add or Update
  function handleCurrencySubmit() {
    if (!from || !to || !ratio) {
      toast.error('Please fill all fields');
    } else if (isNaN(+ratio)) {
      toast.error('Ratio must be a number');
    } else if (!isString(from) || !isString(to)) {
      toast.error('"From" and "To" Currencies must not be numbers.');
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
              setCrudAction(true);
              setIsCurrencyFormVisible(false);
              resetAllFields();
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
              setCrudAction(true);
              resetAllFields();
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

      {/* CURRENCIES TABLE - Edit and delete actions are visible only if a user is logged in */}
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
                      {<FaEdit className='edit-icon' onClick={() => handleEditClick(item)} />}
                      {
                        <RiDeleteBin2Line
                          className='delete-icon'
                          onClick={() => setIsModalOpen(true)}
                        />
                      }

                      {isModalOpen && (
                        <Modal
                          title='Are you sure you want to delete this?'
                          confirmText='Yes'
                          cancellationText='No'
                          onConfirmClick={() => handleDeleteClick(item._id)}
                          onCancelClick={() => setIsModalOpen(false)}
                        />
                      )}
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
          * In order to add, update or delete a currency exchange ratio, you have to be logged in
        </p>
      )}

      {/* CURRENCY FORM */}
      {isCurrencyFormVisible && (
        <div className='add-currency-container'>
          <form onSubmit={handleCurrencySubmit}>
            <InputField label='From' value={from} setValue={setFrom} />
            <InputField label='To' value={to} setValue={setTo} />
            <InputField label='Ratio' value={ratio} setValue={setRatio} />
          </form>

          <div id='buttons-id' className='add-currency-button-container'>
            <button
              onClick={handleCurrencySubmit}
              className={selectedIdToEdit ? 'update-button' : 'add-button'}
            >
              {selectedIdToEdit ? 'Update' : 'Add'}
            </button>

            <button onClick={() => setIsCurrencyFormVisible(false)}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}
