import { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // Example Address: 0x07dc9cb1d2f8e7acf92c856cf43467936203f26a
  const [address, setAddress] = useState("");
  const [tokenData, setTokenData] = useState([]);

  const apiUrl = `https://api.fuse.io/api/v0/balances/assets/${address}?apiKey={API_KEY}`;
  //[Get an API KEY](https://console.fuse.io/build).

  const handleReturnBalances = async (e) => {
    e.preventDefault();
    fetchData();
  };

  async function fetchData() {
    try {
      console.log(address);
      const response = await fetch(apiUrl);
      console.log(address);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setTokenData(data.result);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  return (
    <main className={`flex min-h-screen flex-col p-24 ${inter.className}`}>
      <form
        onSubmit={handleReturnBalances}
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
          Send
        </button>
      </form>
      <div className="mt-8 relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="mb-4">Address: {address}</div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                Token Symbol
              </th>
              <th scope="col" className="px-6 py-3">
                Contract Address
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {tokenData.map((token, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "border-b border-gray-200 dark:border-gray-700"
                    : ""
                }`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                >
                  {token.symbol}
                </th>
                <td className="px-6 py-4">{token.contractAddress}</td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  {token.balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
