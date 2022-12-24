import React,{Component} from "react";
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { styled } from "@mui/material/styles";
import MuiInput from "@mui/material/Input";
import FakeBaycABI from "./ABI/FakeBAYC.json";

const Input = styled(MuiInput)`
  width: 25%;
  margin: 0 auto;
  color: #fff;
  border: #fff;
  margin-left: 2rem;
`;

function Navbar(){
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [currentAccount, setCurrentAccount] = useState();
  const [fakeBAYCbalance, setFakeBAYCbalance] = useState(null);
  const [chain, setChain] = useState(null); 

  const contractAddress = "0x7e10DeD0434da7B2889A33A794B2e0E06f831Bb2";
  const contractABI = FakeBaycABI;

  const baseFunction = () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const Contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      return Contract;
    }
  };
  async function activate() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        checkAccount()
      } catch (err) {
        console.log('user did not add account...', err)
      }
    }
  }
  
  async function checkAccount() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const accounts = await provider.listAccounts();
    setAccount(accounts[0])
  }

  const connectWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts[0]);
  };

  useEffect(() => {
    activate();
  }, [])

  return (
    <div className="App">
      <header>
    { account && <>
      <nav>
              
                <NavLink to="/" exact>Home</NavLink>
              
                <NavLink to="/Chain-Info">Chain Info</NavLink>
              
                <NavLink to="/fakeBayc">Fake Bayc</NavLink>
              
        
                <NavLink to="/fakeBayc/0">Fake Bayc Info</NavLink>
              
                <NavLink to="/fakeNefturians">Fake Nefturian</NavLink>
              
                <NavLink to={`/fakeNefturians/${account}`}>Fake Nefturian user wallet</NavLink>
              
                <NavLink to="/fakeMeebits">Fake Meebits</NavLink>
              
          </nav>
          <button
          className="connect"
          onClick={connectWallet}
          disabled={currentAccount}
        >
          {currentAccount
            ? `${currentAccount.substring(0, 6)}...${currentAccount.substring(
                currentAccount.length - 5
              )}`
            : "Connect wallet"}
        </button>
          </>
    }</header>
    </div>
  );
}

export default Navbar;
