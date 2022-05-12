import { useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { shortenText } from "../../helpers";
import logo from "../../static/logo.svg";
import "./style.scss";

const Header = () => {
  const wallet = useWallet();

  const walletNotConnected =
    wallet.status === WalletStatus.WALLET_NOT_CONNECTED;
  const walletConnected = wallet.status === WalletStatus.WALLET_CONNECTED;
  const walletConnecting = wallet.status === WalletStatus.INITIALIZING;
  const shortenedAddress = shortenText(wallet.wallets?.[0]?.terraAddress || "");

  const connectWallet = () => {
    if (wallet.availableConnectTypes?.[0]) {
      wallet.connect(wallet.availableConnectTypes?.[0]);
    } else if (wallet.availableInstallTypes?.[0]) {
      wallet.install(wallet.availableInstallTypes?.[0]);
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
                onClick={walletConnected ? wallet.disconnect : connectWallet}
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
