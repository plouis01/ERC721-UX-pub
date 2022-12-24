import FakeBaycABI from "../ABI/FakeBAYC.json"
import { useState, useEffect } from 'react'
import { providers, Contract, Wallet } from 'ethers';

function FakeBayc(){

const [account, setAccount] = useState(null);
const [chain, setChain] = useState(null); 
const [provider, setProvider] = useState(null);
const [fakeBAYCbalance, setFakeBAYCbalance] = useState(null);



useEffect(() => {
    startup();
}, [])


async function activate() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return checkAccount();
    } catch (err) {
      console.log('account not added', err)
    }
  }
}

async function startup(){
  let {provider ,wallet}= await activate();
  console.log(provider,"provider")
  let id =await checkNetwork();
  setProvider(provider);
  setAccount(wallet.address);
  setChain(id);
  console.log(provider,"provider")
}

async function checkAccount() {
  let provider = new providers.Web3Provider(window.ethereum)
  const accounts = await provider.listAccounts()
  return {provider,wallet: new Wallet(accounts[0], provider)};
}

async function checkNetwork(){
  let provider = new providers.Web3Provider(window.ethereum)
  const chainID = await provider.getNetwork().then(network => network.chainId);
  if(chainID!="11155111"){
    console.log("Chain : ",chain)
    await switchNetwork(provider);
  }
  return chainID;
}


async function switchNetwork(provider) {
  try {
    await window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: provider.utils.toHex(11155111) }],
      })
    }
    catch (err) {
      if (err.code === 4902) {
        await window.ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Sepolia Testnet",
                chainId: provider.utils.toHex(11155111),
                nativeCurrency: {
                  name: "ETH",
                  decimals: 18,
                  symbol: "ETH",
                },
                rpcUrls: ["https://rpc.sepolia.dev/"],
              },
            ],
          })
      } 
    }
}


async function getFakeBAYCinfo(){
  const fakeBaycData = FakeBaycABI.networks[chain]

  if(fakeBaycData){
      const fakeBaycContract = new Contract(fakeBaycData.address, FakeBaycABI.abi, provider);
      let fakeBAYCbalance = await fakeBaycContract.tokenCounter();
      setFakeBAYCbalance(fakeBAYCbalance.toString());
      console.log(fakeBAYCbalance)
  } else{
      window.alert('Error: FakeBAYC contract not deployed')
  }
}

async function claim(){
  const fakeBaycData = FakeBaycABI.networks[chain]

  if(fakeBaycData){
      const signer = provider.getSigner();
      const fakeBaycContract = new Contract(fakeBaycData.address, FakeBaycABI.abi, signer);
      await fakeBaycContract.connect(account).claimAToken({from: account});
      console.log("minted")
  } else{
      window.alert('Error: FakeBAYC contract not deployed')
  }
}

  return (
      <div>
          <button className="connect" onClick={getFakeBAYCinfo}>Get FakeBAYC info</button>
          <button className="connect" onClick={claim}>Claim FakeBAYC</button>
          <nav>
          <p>FakeBAYC balance: {fakeBAYCbalance}</p>
          </nav>
      </div>
  )
}


export default FakeBayc; 