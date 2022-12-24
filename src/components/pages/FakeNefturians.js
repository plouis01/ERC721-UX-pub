import { useState, useEffect } from "react";
import { providers, ethers } from "ethers";
import FakeNefturianABI from "../ABI/FakeNefturian.json";

function FakeNefturians() {
  const [price, setPrice] = useState();
  const [pricefees, setPriceFees] = useState();
  const [account, setAccount] = useState(null);
  const [chain, setChain] = useState(null);

  async function activate() {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      return accounts[0];
    } catch (err) {
      console.log("account not added", err);
    }
  }

  async function startup() {
    const walletAddress = await activate();
    const chainId = await checkNetwork();
    setAccount(walletAddress);
    setChain(chainId);
  }

  async function checkNetwork() {
    let provider = new providers.Web3Provider(window.ethereum)
    const chainId = await provider.getNetwork().then(network => network.chainId);
    if (chainId !== "11155111") {
      console.log("Chain : ", chain);
      await switchNetwork();
    }
    return chainId;
  }

  async function switchNetwork() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(11155111) }],
      });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: "Sepolia Testnet",
              chainId: ethers.utils.hexValue(11155111),
              nativeCurrency: {
                name: "ETH",
                decimals: 18,
                symbol: "ETH",
              },
              rpcUrls: ["https://rpc.sepolia.dev/"],
            },
          ],
        });
      }
    }
  }

  useEffect(() => {
    startup();
    GetTokenPrice();
  }, []);

  const contractAddress = "0x9bAADf70BD9369F54901CF3Ee1b3c63b60F4F0ED";
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let contract = new ethers.Contract(contractAddress, FakeNefturianABI.abi, provider);

  async function GetTokenPrice() {
    let prix = await contract.tokenPrice(); 
    setPriceFees(String(prix * 1.001)); 
    setPrice(prix);
  }

  async function BuyToken() {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(contractAddress, FakeNefturianABI.abi, signer);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    await contract.buyAToken({ value: pricefees }).send({
      from: accounts[0],
    }).then(console.log);
  }

  return (
    <div>
      <nav><b>FakeNefturian</b></nav>
      {price &&
        <>
          <nav>FakeNefturian Price :</nav>
          <div><nav><b>{ethers.utils.formatEther(price)} ETH</b></nav></div>
          <nav>Price with fees :</nav>
          <div><nav><b>{ethers.utils.formatEther(pricefees)} ETH</b></nav></div>
          <div><button className="connect" onClick={BuyToken}>Buy a FakeNefturian</button></div>
        </>
      }
    </div>
  );
}

export default FakeNefturians;