import { useState, useEffect } from "react";
import { IpfsImage } from 'react-ipfs-image';
import { useParams } from 'react-router-dom';
import { Contract, providers, ethers } from 'ethers';
import FakeBaycABI from "../ABI/FakeBAYC.json";

function FakeBaycTokenInfo() {
  const [tokenId, setTokenId] = useState(0);
  const [attribute, setAttribute] = useState();
  const [image, setImage] = useState("");

  const currentTokenId = useParams();
  useEffect(() => {
    setTokenId(currentTokenId.tokenId);
  }, [])

  const contractAddress = "0x1dA89342716B14602664626CD3482b47D5C2005E";
  const provider = new providers.Web3Provider(window.ethereum);
  const contract = new Contract(contractAddress, FakeBaycABI.abi, provider);

  const handleChamp = (event) => {
    setTokenId(event.target.value)
  }

  async function GetTokenInfo() {
    const info = await contract.tokenURI(tokenId);
    const jsonURI = await fetch(info).then(res => res.json());

    setAttribute(JSON.stringify(jsonURI.attributes));
    setImage(jsonURI.image);
    console.log(jsonURI);
  }

  return (
    <div>
      <input type="text" value={tokenId} onChange={e => handleChamp(e)} />
      <br></br>
      <button className="connect" onClick={GetTokenInfo}> Get token info</button>
      <br></br>
      <br></br>
      {image &&
        <>
          <IpfsImage hash={image} />
          <div className="info">
            <h3>Information :</h3>
            <div>{attribute}</div>
            <br></br>
            <br></br>
          </div>
        </>
      }
    </div>
  )
}

export default FakeBaycTokenInfo;
