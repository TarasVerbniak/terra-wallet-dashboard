import errorImg from "../../static/error.png";
import successImg from "../../static/success.png";
import spinnerImg from "../../static/spinner.svg";
import { shortenText } from "../../helpers";

const Transaction = ({ txHash, txError, loading }) => (
  <div className="transaction">
    {loading ? (
      <div className="transaction__loader">
        <img src={spinnerImg} alt="spinner" />
        <p>Processing...</p>
      </div>
    ) : (
      <>
        {txHash && (
          <div className="transaction__success">
            <img src={successImg} alt="success icon" />
            <a
              href={`https://finder.terra.money/bombay-12/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {shortenText(txHash, 10)}
            </a>
          </div>
        )}
        {txError && (
          <div className="transaction__error">
            <img src={errorImg} alt="error icon" />
            <p>{txError}</p>
          </div>
        )}
      </>
    )}
  </div>
);

export default Transaction;
