import { useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import { useLCDClient } from "@terra-money/wallet-provider";
import { sendTransaction } from "../../helpers";
import { WalletContext } from "../../context";
import Transaction from "./Transaction";
import ModalForm from "./ModalForm";
import "./style.scss";

const BalanceModal = ({ show, onHide, balance }) => {
  const [step, setStep] = useState(1);
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState(null);
  const [loading, setLoading] = useState(false);

  const lsd = useLCDClient();
  const wallet = useContext(WalletContext);

  const hideHandler = () => {
    onHide();
    setTxHash(null);
    setTxError(null);
    setLoading(false);
    setTimeout(() => setStep(1), 500);
  };

  const proceedFormHandler = (amount, address) => {
    if (wallet.connectedWallet) {
      setStep(2);
      setLoading(true);

      sendTransaction(wallet, lsd, address, amount).then((result) => {
        setLoading(false);

        if (result.success) {
          setTxHash(result.hash);
        } else {
          setTxError(result.error);
        }
      });
    }
  };

  return (
    <Modal onHide={hideHandler} show={show} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Send</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 && (
          <ModalForm onProceed={proceedFormHandler} balance={balance} />
        )}
        {step === 2 && (
          <Transaction txHash={txHash} txError={txError} loading={loading} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BalanceModal;
