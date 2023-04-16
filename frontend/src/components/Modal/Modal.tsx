import './Modal.css';

interface ModalProps {
  title: string;
  confirmText: string;
  cancellationText: string;
  onConfirmClick: () => void;
  onCancelClick: () => void;
}

export default function Modal(props: ModalProps) {
  return (
    <div className='modal'>
      <div className='modal-content'>
        <div className='modal-title'>{props.title}</div>
        <div className='modal-buttons-container'>
          <div className='modal-button confirm' onClick={props.onConfirmClick}>
            {props.confirmText}
          </div>
          <div className='modal-button cancel' onClick={props.onCancelClick}>
            {props.cancellationText}
          </div>
        </div>
      </div>
    </div>
  );
}
