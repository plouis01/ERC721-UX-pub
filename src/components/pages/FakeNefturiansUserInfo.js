import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Contract, providers, ethers, BigNumber } from 'ethers';
import FakeNefturianABI from "../ABI/FakeNefturian.json";

function FakeNefturiansUserInfo() {
  const [balance, setBalance] = useState();
  const [list, setList] = useState([]);
  const [userWallet, setUserWallet] = useState();

  const userAddress = useParams();

  useEffect(() => {
    setUserWallet(userAddress.userAddress);
    getBalance();
    getBalanceAndToken();
  }, [userWallet]);

  const contractAddress = "0x9bAADf70BD9369F54901CF3Ee1b3c63b60F4F0ED";
  const provider = new providers.Web3Provider(window.ethereum);
  const contract = new Contract(contractAddress, FakeNefturianABI.abi, provider);

  async function getBalance() {
    let balance = await contract.balanceOf(userWallet);
    balance = ethers.utils.formatEther(balance);
    console.log(balance);
    setBalance(balance);
    
  }

  async function getBalanceAndToken() {
    let listing = [];
    let totalSupply = await contract.totalSupply();
    totalSupply = ethers.utils.formatEther(totalSupply);
    console.log(totalSupply);

    for (let i = 0; i < totalSupply; i++) {
      let tempOwner = await contract.ownerOf(i);
      if (tempOwner == userWallet) {
        let URI = await contract.tokenURI(i);
        let fetchUri = await fetch(URI).then(res => res.json());
        listing.push(fetchUri);
      }
    }
    setList(listing);
  }

  async function Refresh() {
    await getBalance();
    await getBalanceAndToken();
  }

  const elements = list.map(item => {
    return (
      <div className="fake">
        <ul key={item.name}>
          <liste>{item.name}</liste>
          <liste>{item.description}</liste>
          <img src={item.image} alt="image" />
        </ul>
      </div>
    );
  });

  return (
    <div>
      <nav>
      {userWallet && <>
        <h1>Wallet address : {userAddress.userAddress}</h1>
        <br></br>
      </>
      }
      </nav>
        <button className="connect" onClick={Refresh}>Refresh info</button>
        <div>
          <nav>
          {balance && elements && <>
            <div>Balance : {balance}</div>
            <div>{elements}</div>
        </>}
        </nav>
        </div>

        </div>                    
    )
    
}

export default FakeNefturiansUserInfo;