import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { styled } from "@mui/material/styles";
import MuiInput from "@mui/material/Input";
import FakeBaycABI from "../ABI/FakeBAYC.json";
import FakeNefturiansUserInfo from "./FakeNefturiansUserInfo";
import "../../App.css";

const Input = styled(MuiInput)`
  width: 25%;
  margin: 0 auto;
  color: #fff;
  border: #fff;
  margin-left: 2rem;
`;

function Main() {
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


  return (
    <div className="App">
      
      <div className="main-container">
        <div className="sign-transaction-container">
          <p>NFT Collection</p>
          <label className="menu-button-wrapper" htmlFor="">
            <input type="checkbox" className="menu-button"/>
            <div className="icon-wrapper">
              <label className="hamburger">
                <input className="hamburger-input" type="checkbox"/>
                <span className="hamburger-line first"></span>
                <span className="hamburger-line second"></span>
                <span className="hamburger-line third"></span>
              </label>
            </div>
            <div href="#" className="item-list">
              <li><a href="#bayc">Fake BAYC</a></li>
              <li><a href="#nefturians">Fake Nefturians</a></li>
              <li><a href="#meebits">Fake Meebits</a></li>
            </div>
          </label>
          <button
            onClick={FakeNefturiansUserInfo} 
            className="container-pourcentage register">
            <span>Get Info</span>
          </button>
        </div>
        <div className="sign-transaction-container">
          <p>Your wallet</p>
          <button
            onClick={FakeNefturiansUserInfo}
            className="container-pourcentage register lastButton"
          >
            <span>Get Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;
