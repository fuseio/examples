import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function NFTDisplay() {
  const [address, setAddress] = useState("");
  const [nftData, setNftData] = useState([]);

  const apiUrl = `https://api.fuse.io/api/v0/balances/nft-assets/${address}?apiKey={API_KEY}`;
  //Get an API KEY - https://console.fuse.io/build

  const handleReturnNFTs = async (e) => {
    e.preventDefault();
    fetchNFTData();
  };

  async function fetchNFTData() {
  try {
    console.log("Fetching NFTs for address:", address);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("NFT Data:", data);
    if (data && data.data && data.data.account && data.data.account.collectibles) {
      setNftData(data.data.account.collectibles);
    } else {
      setNftData([]);
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    setNftData([]);
  }
}


useEffect(() => {
  if (nftData.length > 0) {
    console.log("Sample NFT data:", nftData[0]);
  }
}, [nftData]);


  return (
    <main className={`flex min-h-screen flex-col p-24 ${inter.className}`}>
      <form
        onSubmit={handleReturnNFTs}
        className="flex max-w-md flex-col gap-4"
      >
        <div className="mt-3">
          <label
            htmlFor="address-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Enter Address
          </label>
          <input
            type="text"
            id="address-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Address"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Fetch NFTs
        </button>
      </form>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {nftData.map((nft, index) => (
          <div key={index} className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
            {nft.imageURL && <img src={nft.imageURL} alt={nft.name || 'NFT Image'} className="w-full h-auto"/>}
            <div className="p-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{nft.name || 'Unnamed NFT'}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{nft.description || 'No description'}</p>
              <a href={nft.descriptorUri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-800">View Metadata</a>
            </div>
          </div>
      ))}
      </div>
    </main>
  );
}
