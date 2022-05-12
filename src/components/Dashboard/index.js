import { useState, useEffect } from "react";
import {
  useWallet,
  useLCDClient,
  WalletStatus,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import { parseBalanceString, fetchTransactions } from "../../helpers";
import GridBlock from "../GridBlock";
import BalanceModal from "../BalanceModal";
import arrowSvg from "../../static/arrow.svg";
import "./style.scss";

const Dashboard = () => {
  const MAX_DISPLAYED_TRNS = 5;

  const [ustBalance, setUstBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const lcd = useLCDClient();
  const { status } = useWallet();
  const connectedWallet = useConnectedWallet();
  const walletConnected = status === WalletStatus.WALLET_CONNECTED;

  useEffect(() => {
    if (connectedWallet) {
      lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
        const ustBalanceString = coins?._coins?.uusd?.toData?.()?.amount;
        const parsedBalance = parseBalanceString(ustBalanceString);
        setUstBalance(parsedBalance);
      });

      fetchTransactions(connectedWallet.walletAddress, MAX_DISPLAYED_TRNS).then(
        (txns) => setTransactions(txns)
      );
    } else {
      setUstBalance(null);
      setTransactions([]);
    }
  }, [connectedWallet, lcd]);

  const onProceed = (amount, address) => {
    console.log("==> proceed", amount, address);
  };

  return (
    walletConnected && (
      <div className="dashboard">
        <div className="row justify-content-md-center">
          <div className="col-md-5 col-xl-4 mb-5">
            <GridBlock title="Balance" classes="balance">
              <div className="balance__amount">
                {ustBalance ? (
                  <>
                    <span>{ustBalance}</span>
                    <span>UST</span>
                  </>
                ) : (
                  <span>-- --</span>
                )}
              </div>
              <button onClick={() => setShowModal(true)}>Send</button>
            </GridBlock>
          </div>
          <div className="col-md-5 col-xl-4 offset-lg-1">
            <GridBlock title="Transactions" classes="transactions">
              <ul>
                {transactions.map((t, i) => (
                  <li key={i}>
                    <img
                      className={
                        t.type === "receive" ? "arrow-receive" : "arrow-spend"
                      }
                      src={arrowSvg}
                      alt="wallet arrow"
                    />
                    <span>{t.coin.toUpperCase()}</span>
                    <span>{t.amount}</span>
                    <div>
                      <div>{t.date.split(" ")[0]}</div>
                      <div>{t.date.split(" ")[1]}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </GridBlock>
          </div>
        </div>
        <BalanceModal
          show={showModal}
          balance={ustBalance}
          onHide={() => setShowModal(false)}
          onProceed={onProceed}
        />
      </div>
    )
  );
};

export default Dashboard;
