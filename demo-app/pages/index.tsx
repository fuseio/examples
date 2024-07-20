import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [smartAccount, setSmartAccount] = useState<string>("");
  const [toValue, setToValue] = useState<string>("");
  const [amountValue, setAmountValue] = useState<string>("");
  const [usdcBal, setUsdcBal] = useState<string>("");

  const initFuseSDK = async () => {
    const apiKey = "API_KEY";
    const credentials = new ethers.Wallet(`0xPrivateKey`);
    const fuseSDK = await FuseSDK.init(apiKey, credentials, {
      withPaymaster: true,
    });

    const smartAccount = fuseSDK.wallet.getSender();
    setSmartAccount(smartAccount);
    console.log(
      `Smart account address: https://explorer.fuse.io/address/${smartAccount}`
    );

    return fuseSDK;
  };

  const getTokenBalance = async (fuseSDK, tokenAddress, smartAccount) => {
    const tokenBalance = await fuseSDK.explorerModule.getTokenBalance(
      tokenAddress,
      smartAccount
    );

    if (tokenBalance !== null) {
      const decimals = 6;
      const formattedBalance = Number(tokenBalance) / Math.pow(10, decimals);
      console.log(`Token: ${tokenAddress}, balance: ${formattedBalance}`);
      setUsdcBal(formattedBalance.toString());
    } else {
      console.error("Token balance could not be retrieved.");
    }
  };

  const scw = async () => {
    try {
      const fuseSDK = await initFuseSDK();
      const tokenAddress = "0x28C3d1cD466Ba22f6cae51b1a4692a831696391A";
      await getTokenBalance(fuseSDK, tokenAddress, smartAccount);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleTo = (e) => {
    setToValue(e.target.value);
  };

  const handleAmount = (e) => {
    setAmountValue(e.target.value);
  };

  const transfer = async () => {
    console.log(amountValue, toValue);
    const fuseSDK = await initFuseSDK();
    const tokenAddress = "0x28C3d1cD466Ba22f6cae51b1a4692a831696391A";
    const amount = ethers.parseUnits(amountValue, 6);
    const res = await fuseSDK.transferToken(tokenAddress, toValue, amount);
    console.log(`UserOpHash: ${res?.userOpHash}`);
    toast("Waiting for transaction...");
    console.log("Waiting for transaction...");

    const receipt = await res?.wait();
    console.log(
      `User operation hash: https://explorer.fuse.io/tx/${receipt?.transactionHash}`
    );
    toast(
      `User operation hash: https://explorer.fuse.io/tx/${receipt?.transactionHash}`,
      {
        autoClose: 5000,
        pauseOnHover: true,
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Input value:", toValue, amountValue);
    transfer();
  };

  useEffect(() => {
    scw();
  }, []);

  return (
    <main className={`flex min-h-screen flex-col p-24 ${inter.className}`}>
      Hello, World!
      {scw ? (
        <>
          <p className="mt-8">
            {smartAccount}, USDC Balance: {usdcBal}
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex max-w-md flex-col gap-4"
          >
            <div className="mt-3">
              <label
                htmlFor="base-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              />
              <input
                type="text"
                id="base-input"
                value={toValue}
                onChange={handleTo}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />

              <label
                htmlFor="base-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              />
              <input
                type="text"
                id="base-input"
                value={amountValue}
                onChange={handleAmount}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className=" focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Send
            </button>
          </form>
          <ToastContainer />
        </>
      ) : (
        <div>Add PrivateKey to create an Account</div>
      )}
    </main>
  );
}
