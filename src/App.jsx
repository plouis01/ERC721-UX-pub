import './App.css';
import {BrowserRouter} from "react-router-dom"; 
import AppRoutes from "./components/Routes.js"; 
import Navbar from './components/Navbar';
import { ethers } from 'ethers';


function App() {

  let selectedAccount;

async function Connect() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    selectedAccount = (await provider.listAccounts())[0];
    console.log(`Selected account is ${selectedAccount}`);

    provider.on('accountsChanged', (accounts) => {
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  } catch (err) {
    console.log(err);
  }
}

  return (
    <div className="App">
        <BrowserRouter>
          <Navbar/>
          <AppRoutes />
        </BrowserRouter>  
    </div>
  );
}

export default App;
