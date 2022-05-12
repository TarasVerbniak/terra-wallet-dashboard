import { useState, useRef } from "react";
import { FormControl, FloatingLabel, Button } from "react-bootstrap";
import { checkIfAddressIsValid } from "../../helpers";

const ModalForm = ({ balance, onProceed }) => {
  const [isAddressInvalid, setIsAddressInvalid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [address, setAddress] = useState(null);

  const [isAmountInvalid, setIsAmountInvalid] = useState(false);
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [amountError, setAmountError] = useState(null);
  const [amount, setAmount] = useState(null);
  const inputRef = useRef();

  // address handlers
  const addAddressError = () => {
    setIsAddressValid(false);
    setIsAddressInvalid(true);
    setAddressError("Please enter correct address");
  };

  const changeAddress = (adrs) => {
    setAddress(adrs);
    if (checkIfAddressIsValid(adrs)) {
      setIsAddressValid(true);
      setIsAddressInvalid(false);
    } else if (isAddressValid) {
      addAddressError();
    }
  };

  // amount handlers
  const addError = (notEnoughMoney) => {
    const errTxt = notEnoughMoney
      ? "Not enough UST"
      : "Please enter correct amount";
    setAmountError(errTxt);
    setIsAmountValid(false);
    setIsAmountInvalid(true);
  };

  const changeAmount = (numberStr) => {
    const parsedBalance = parseFloat(numberStr);
    const notEnoughMoney = parsedBalance > balance;

    if (isNaN(parsedBalance) || parsedBalance <= 0 || notEnoughMoney) {
      addError(notEnoughMoney);
    } else {
      setAmount(parsedBalance);
      setAmountError(null);
      setIsAmountValid(true);
      setIsAmountInvalid(false);
    }
  };

  const proceedHandler = () => {
    let hasErrors = false;

    // address check
    if (!checkIfAddressIsValid(address)) {
      addAddressError();
      hasErrors = true;
    }

    // amount check
    if (!amount) {
      addError();
      hasErrors = true;
    }

    if (!hasErrors) onProceed(amount, address);
  };

  const setMaxAmount = () => {
    changeAmount(balance);
    inputRef.current.value = balance;
  };

  return (
    <>
      <div className="col-12 col-md-10 address-block">
        <FloatingLabel label="Address" className="w-100">
          <FormControl
            type="text"
            placeholder="Address"
            isValid={isAddressValid}
            isInvalid={isAddressInvalid}
            onChange={(e) => changeAddress(e.target.value)}
          />
          <FormControl.Feedback type="invalid">
            {addressError}
          </FormControl.Feedback>
        </FloatingLabel>
      </div>
      <div className="col-12 col-md-10 amount-block">
        <FloatingLabel label="Amount" className="w-100">
          <FormControl
            ref={inputRef}
            type="number"
            placeholder="Amount"
            isValid={isAmountValid}
            isInvalid={isAmountInvalid}
            onChange={(e) => changeAmount(e.target.value)}
          />
          <FormControl.Feedback type="invalid">
            {amountError}
          </FormControl.Feedback>
        </FloatingLabel>
        <div className="use-max-amount">
          <span>Max: </span>
          <button onClick={setMaxAmount}>
            <span>{balance}</span>
            <span> UST</span>
          </button>
        </div>
      </div>
      <div className="col-12 col-md-10 button-block">
        <Button
          variant="dark"
          className="w-100"
          disabled={isAmountInvalid || isAddressInvalid}
          onClick={proceedHandler}
        >
          Proceed
        </Button>
      </div>
    </>
  );
};

export default ModalForm;
