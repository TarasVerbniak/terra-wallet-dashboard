import Header from "../Header";
import Dashboard from "../Dashboard";
import { WalletContextProvider } from "../../context";

const App = () => (
  <WalletContextProvider>
    <Header />
    <Dashboard />
  </WalletContextProvider>
);

export default App;
