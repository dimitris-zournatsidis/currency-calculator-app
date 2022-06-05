import './CurrencyInput.css';

interface CurrencyInputProps {
  amount: number | undefined;
  currency: string;
  onAmountChange: (event: any) => void;
  onCurrencyChange: (event: any) => void;
  currencies: any[];
}

export default function CurrencyInput(props: CurrencyInputProps) {
  return (
    <div className='group'>
      <input
        type='number'
        value={props.amount || ''}
        onChange={(e) => props.onAmountChange(e.target.value)}
      />
      
      <select
        value={props.currency || ''}
        onChange={(e) => props.onCurrencyChange(e.target.value)}
      >
        {props.currencies.map((currency, index) => {
          return (
            <option key={index} value={currency}>
              {currency}
            </option>
          );
        })}
      </select>
    </div>
  );
}
