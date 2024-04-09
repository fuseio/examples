import Image from "next/image";
import { Inter } from "next/font/google";
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import { ethers } from "ethers";
const inter = Inter({ subsets: ["latin"] });

import { useState, useEffect } from 'react'
import React from 'react';


export default function Home() {
  const [smartAccount, setSmartAccount] = useState<string>("")
  const [tokenNames, setTokenNames] = useState([])
  const [balances, setBalances] = useState({});

  const smartWallet = async() => {
    const apiKey = "API_KEY";
    const credentials = new ethers.Wallet(`0xPrivateKey`);
    const fuseSDK = await FuseSDK.init(apiKey, credentials, {
      withPaymaster: true,
    });
    setSmartAccount(fuseSDK.wallet.getSender());
    console.log(
        `Smart account address: https://explorer.fuse.io/address/${fuseSDK.wallet.getSender()}`
    );

    const tokenList = await fuseSDK.explorerModule.getTokenList(smartAccount);
    console.log(tokenList);

    const res = tokenList.map((x) => {return x.address})
    setTokenNames(tokenList)

    const tokenAddresses = res;

    const fetchedBalances = {};

    for (const tokenAddress of tokenAddresses) {
        const balance = await fuseSDK.explorerModule.getTokenBalance(tokenAddress, smartAccount);
        fetchedBalances[tokenAddress] = balance;
    }

    console.log(fetchedBalances);
    await setBalances(fetchedBalances)
 
 }


 useEffect(()=> {
  smartWallet()
}, [])

  return (
    <main className={`flex flex-col items-center p-24 ${inter.className}`}>
      Hello, World!       {smartAccount}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-12">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Token Name</th>
              <th scope="col" className="px-6 py-3">Token Address</th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Amount</th>
            </tr>
          </thead>
          <tbody>
            {tokenNames.map((token, index) => (
            <tr key={index}>
              <td>{token.name}</td>
              <td>{Object.keys(balances)[index]}</td>
              <td>{Object.values(balances)[index].toString()}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
