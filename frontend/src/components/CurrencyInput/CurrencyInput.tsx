import './CurrencyInput.css';

interface CurrencyInputProps {
  amount: number | undefined;
  onAmountChange: (event: any) => void;
  onCurrencyChange: (event: any) => void;
  currency: string;
  currencies: any[];
}

export default function CurrencyInput(props: CurrencyInputProps) {
  return (
    <div className='group'>
      <input
        type='text'
        value={props.amount}
        onChange={(e) => props.onAmountChange(e.target.value)}
      />
      <select
        value={props.currency}
        onChange={(e) => props.onCurrencyChange(e.target.value)}
      >
        {props.currencies.map((currency) => {
          return (
            <option key={currency} value={currency}>
              {currency}
            </option>
          );
        })}
      </select>
    </div>
  );
}
