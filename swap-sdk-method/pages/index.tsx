import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import { ethers } from "ethers";
import { FuseSDK, TradeRequest } from "@fuseio/fusebox-web-sdk";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [amount, setAmount] = useState<string>("");
  const [swapResult, setSwapResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const apiKey = "pk_API_KEY";
  const privateKey = "YOUR_PRIVATE_KEY";

  const nativeTokenAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const usdcTokenAddress = "0x28C3d1cD466Ba22f6cae51b1a4692a831696391A";

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const credentials = new ethers.Wallet(privateKey);
      const fuse = await FuseSDK.init(apiKey, credentials, {
        withPaymaster: true,
      });

      const smartContractAddress = fuse.wallet.getSender();
      console.log(`Sender Address is ${smartContractAddress}`);

      const tradeRequest = new TradeRequest(
        nativeTokenAddress,
        usdcTokenAddress,
        ethers.parseUnits(amount, 18),
        true
      );

      const resSwap = await fuse.swapTokens(tradeRequest);
      setSwapResult(resSwap);
    } catch (error) {
      console.error("Swap failed:", error);
      setSwapResult("Swap failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-24">
      <form onSubmit={handleSwap} className="flex max-w-md flex-col gap-4">
        <div className="mt-3">
          <label
            htmlFor="amount-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Amount to Swap
          </label>
          <input
            type="text"
            id="amount-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in ETH"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          disabled={loading}
        >
          {loading ? "Swapping..." : "Swap"}
        </button>
      </form>

      {swapResult && (
        <div className="mt-12 relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Swap Result
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  <pre className="text-gray-900 dark:text-white">
                    {JSON.stringify(swapResult, null, 2)}
                  </pre>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
