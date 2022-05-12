import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { shortenAddress } from "../../helpers";
import logo from "../../static/logo.svg";
import "./style.scss";

const Header = () => {
  const {
    status,
    wallets,
    connect,
    install,
    disconnect,
    availableConnectTypes,
    availableInstallTypes,
  } = useWallet();
  const walletNotConnected = status === WalletStatus.WALLET_NOT_CONNECTED;
  const walletConnected = status === WalletStatus.WALLET_CONNECTED;
  const walletConnecting = status === WalletStatus.INITIALIZING;
  const shortenedAddress = shortenAddress(wallets?.[0]?.terraAddress || "");

  const connectWallet = () => {
    if (availableConnectTypes?.[0]) {
      connect(availableConnectTypes?.[0]);
    } else if (availableInstallTypes?.[0]) {
      install(availableInstallTypes?.[0]);
    }
  };

  return (
    <>
      <header className="header">
        <img className="header__logo" src={logo} alt="logo" />
        <h1 className="header__title d-none d-lg-block">
          Terra wallet dashboard
        </h1>
        <div className="header__controls">
          {!walletConnecting && (
            <>
              {walletConnected && <span>{shortenedAddress}</span>}
              <button
                className={walletConnected ? "btn-disconnect" : "btn-connect"}
                onClick={walletConnected ? disconnect : connectWallet}
              >
                {walletConnected ? "Disonnect" : "Connect"}
              </button>
            </>
          )}
        </div>
        {walletNotConnected && (
          <div className="diconnected-popup">
            Wallet is not connected. Please press Connect button
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
