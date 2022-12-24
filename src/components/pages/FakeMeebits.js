import { useState, useEffect } from "react";
import * as ethers from "ethers";
import FakeMeebitsABI from "../ABI/FakeMeebits.json";
import FakeMeebitsClaimerABI from "../ABI/FakeMeebitsClaimer.json";
import Signatures from "../ABI/output-sig.json";

function FakeMeebits() {
  const [userAccount, setUserAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [tokenId, setTokenId] = useState(null);

  const [provider, setProvider] = useState(new ethers.providers.Web3Provider(window.ethereum));
  const [fakeMeebitsContract, setFakeMeebitsContract] = useState(new ethers.Contract(
    "0xD1d148Be044AEB4948B48A03BeA2874871a26003",
    FakeMeebitsABI.abi,
    provider
  ));
  const [fakeMeebitsClaimerContract, setFakeMeebitsClaimerContract] = useState(new ethers.Contract(
    "0x5341e225Ab4D29B838a813E380c28b0eFD6FBa55",
    FakeMeebitsClaimerABI.abi,
    provider
  ));

  useEffect(() => {
    startup();
  }, []);

  async function startup() {
    let wallet = await activate();
    let id = await checkNetwork();
    setUserAccount(wallet);
    setChainId(id);
  }

  async function activate() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        let wallet = checkAccount();
        setUserAccount(wallet);
        return wallet;
      } catch (err) {
        console.log('Account not added', err)
      }
    }
  }
  


    async function checkAccount() {
      let wallet = provider.getSigner();
      return wallet.getAddress();
    }

    async function checkNetwork(){
      let provider = new ethers.providers.Web3Provider(window.ethereum)
    const chainID = await provider.getNetwork().then(network => network.chainId);
    if(chainID!="11155111"){
        console.log("Chain : ",chainID)
        await switchNetwork();
      }
      return chainID;
    }


    async function switchNetwork() {
      try {
        await window.ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexValue(11155111) }],
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
                    chainId: ethers.utils.hexValue(11155111),
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


    async function Mint() {
      if (await fakeMeebitsClaimerContract.tokensThatWereClaimed(tokenId) === true) {
        alert("Already  minted"); 
        throw Error("already minted");
      } else {
        const claims = await fakeMeebitsClaimerContract.getMyClaims();
        if (claims.includes(tokenId)) { 
          
          let signature = Signatures[tokenId];
          let value = await fakeMeebitsClaimerContract.getMyClaim(tokenId);
          value = new ethers.BigNumber(value);
          let tx = await fakeMeebitsContract.mintWithSignature(
            value,
            signature.v,
            signature.r,
            signature.s,
            {
              value: value,
            }
          );
          let receipt = await tx.wait();
          console.log(receipt);
          return receipt;
        }
      }
    }

    return (
      <div>
        <button className="connect" onClick={Mint}>Mint</button>
      </div>
    );
  }



export default FakeMeebits;