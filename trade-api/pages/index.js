import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const apiUrl = `https://api.fuse.io/api/v1/trade/quote?apiKey=YOUR_API_KEY&sellToken=FUSE&buyToken=0x34Ef2Cc892a88415e9f02b91BfA9c91fC0bE6bD4&sellAmount=1000000000000000000`;

  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  fetchData();

  const [inputs, setInputs] = useState({
    sellToken: "FUSE",
    buyToken: "",
    sellAmount: "1000000000000000000",
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { sellToken, buyToken, sellAmount } = inputs;

    const url = `https://api.fuse.io/api/v1/trade/quote`;
    const params = {
      apiKey: "YOUR_API_KEY",
      sellToken,
      buyToken,
      sellAmount,
    };

    try {
      const response = await axios.get(url, { params });
      const data = response.data;

      // Extracting the specific fields
      const extractedData = {
        price: data.price,
        guaranteedPrice: data.guaranteedPrice,
        estimatedPriceImpact: data.estimatedPriceImpact,
        to: data.to,
        value: data.value,
        buyTokenAddress: data.buyTokenAddress,
        sellTokenAddress: data.sellTokenAddress,
        buyAmount: data.buyAmount,
        sellAmount: data.sellAmount,
        sources: data.sources.map((source) => ({
          name: source.name,
          proportion: source.proportion,
        })),
        orders: data.orders.map((order) => ({
          source: order.source,
          makerToken: order.makerToken,
          takerToken: order.takerToken,
          makerAmount: order.makerAmount,
          takerAmount: order.takerAmount,
          fillData: {
            router: order.fillData.router,
            tokenAddressPath: order.fillData.tokenAddressPath.join(" -> "),
            uniswapPath: order.fillData.uniswapPath,
          },
          fill: {
            input: order.fill.input,
            output: order.fill.output,
            adjustedOutput: order.fill.adjustedOutput,
          },
        })),
      };

      setResult(extractedData);
    } catch (error) {
      console.error("Error fetching trade quote:", error);
      setResult({ error: error.message });
    }
  };

  return (
    <div className={`flex min-h-screen flex-col p-24 ${inter.className}`}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Sell Token:
            <input
              type="text"
              name="sellToken"
              value={inputs.sellToken}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Buy Token:
            <input
              type="text"
              name="buyToken"
              value={inputs.buyToken}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Sell Amount:
            <input
              type="text"
              name="sellAmount"
              value={inputs.sellAmount}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Get Quote
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-gray-100 rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-gray-700 text-lg">API Response:</h3>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Field</th>
                <th className="px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="border px-4 py-2">Price</td>
                <td className="border px-4 py-2">{result.price}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Guaranteed Price</td>
                <td className="border px-4 py-2">{result.guaranteedPrice}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Estimated Price Impact</td>
                <td className="border px-4 py-2">
                  {result.estimatedPriceImpact}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">To</td>
                <td className="border px-4 py-2">{result.to}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Value</td>
                <td className="border px-4 py-2">{result.value}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Buy Token Address</td>
                <td className="border px-4 py-2">{result.buyTokenAddress}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Buy Amount</td>
                <td className="border px-4 py-2">{result.buyAmount}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Sell Token Address</td>
                <td className="border px-4 py-2">{result.sellTokenAddress}</td>
              </tr>

              <tr>
                <td className="border px-4 py-2">Sell Amount</td>
                <td className="border px-4 py-2">{result.sellAmount}</td>
              </tr>
            </tbody>
          </table>

          <h4 className="text-gray-700 font-bold m-3">Sources</h4>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Source Name</th>
                <th className="px-4 py-2">Proportion</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {result.sources.map((source, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{source.name}</td>
                  <td className="border px-4 py-2">{source.proportion}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="text-gray-700 font-bold m-3">Orders</h4>
          {result.orders.map((order, index) => (
            <div key={index} className="mb-4">
              <table className="min-w-full table-auto bg-white rounded shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Field</th>
                    <th className="px-4 py-2">Value</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="border px-4 py-2">Source</td>
                    <td className="border px-4 py-2">{order.source}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Maker Token</td>
                    <td className="border px-4 py-2">{order.makerToken}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Taker Token</td>
                    <td className="border px-4 py-2">{order.takerToken}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Maker Amount</td>
                    <td className="border px-4 py-2">{order.makerAmount}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Taker Amount</td>
                    <td className="border px-4 py-2">{order.takerAmount}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Router</td>
                    <td className="border px-4 py-2">
                      {order.fillData.router}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Token Address Path</td>
                    <td className="border px-4 py-2">
                      {order.fillData.tokenAddressPath}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Uniswap Path</td>
                    <td className="border px-4 py-2">
                      {order.fillData.uniswapPath}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Input</td>
                    <td className="border px-4 py-2">{order.fill.input}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Output</td>
                    <td className="border px-4 py-2">{order.fill.output}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Adjusted Output</td>
                    <td className="border px-4 py-2">
                      {order.fill.adjustedOutput}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
