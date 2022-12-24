import { useState } from 'react'
import { ethers } from 'ethers'

function ChainInfo(){

const [account, setAccount] = useState(null);
const [chain, setChain] = useState(null); 
const [block, setBlock] = useState(null);
const [provider, setProvider] = useState(null);


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
  let provider ,wallet = await activate();
  let id =await checkNetwork();
  setProvider(provider);
  setChain(id);
}

async function checkAccount() {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.listAccounts();
  console.log("accounts : ",accounts[0]);
  setAccount(accounts[0]);
  return provider, accounts[0];
}

async function checkNetwork(){
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const chainID = await provider.getNetwork();
  if(chainID.chainId !== "0x0d"){
    console.log("Chain : ",chain)
    await switchNetwork(provider);
  }
  return chainID.chainId;
}


async function switchNetwork(provider) {
  try {
    await window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexlify(11155111) }],
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
                chainId: ethers.utils.hexlify(11155111),
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


async function checkBlock(){
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const block = await provider.getBlockNumber();
  console.log("Block : ",block);
  setBlock(block)
}

  
const info = async()=>  { 

  startup();
  checkBlock();
  checkAccount();
}

    return (
        <div>
          <button className="connect" onClick={info}>Click here to get info</button>
          <nav>
            <div>Account address : <b>{account} </b> </div>
              <br></br>
              <div>Chain ID : <b>{chain}</b></div>
              <br></br>
              <div>Latest block : <b>{block}</b></div>
            </nav>
        </div>
    ); 
}


export default ChainInfo; 


