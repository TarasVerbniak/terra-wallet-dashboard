import { useState, useContext } from "react";
import GridBlock from "../GridBlock";
import BalanceModal from "../BalanceModal";
import arrowSvg from "../../static/arrow.svg";
import { WalletContext } from "../../context";
import "./style.scss";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const wallet = useContext(WalletContext);

  return (
    wallet.connected && (
      <div className="dashboard">
        <div className="row justify-content-md-center">
          <div className="col-md-5 col-xl-4 mb-5">
            <GridBlock title="Balance" classes="balance">
              <div className="balance__amount">
                {wallet.ustBalance ? (
                  <>
                    <span>{wallet.ustBalance}</span>
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
                {wallet.transactions.map((t, i) => (
                  <li key={i}>
                    <a
                      href={`https://finder.terra.money/bombay-12/tx/${t.txhash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
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
                    </a>
                  </li>
                ))}
              </ul>
            </GridBlock>
          </div>
        </div>
        <BalanceModal
          show={showModal}
          balance={wallet.ustBalance}
          onHide={() => setShowModal(false)}
        />
      </div>
    )
  );
};

export default Dashboard;
