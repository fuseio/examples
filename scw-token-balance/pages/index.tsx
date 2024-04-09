import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { FuseSDK } from '@fuseio/fusebox-web-sdk'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'

interface Token {
  name: string
  address: string
}

export default function Home() {
  const [smartAccount, setSmartAccount] = useState<string>('')
  const [tokenNames, setTokenNames] = useState<Token[]>([])
  const [balances, setBalances] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<boolean>(true)

  const smartWalletBalance = async () => {
    setLoading(true)
    try {
      const apiKey = 'API_KEY'
      const credentials = new ethers.Wallet(
        `0xPrivateKey`
      )
      const fuseSDK = await FuseSDK.init(apiKey, credentials, {
        withPaymaster: true,
      })
      const sender = fuseSDK.wallet.getSender()
      console.log('Sender Address:', sender)
      if (!sender) {
        console.error('No sender address available')
        setLoading(false)
        return
      }
      setSmartAccount(sender)

      const tokenListResponse = await fuseSDK.explorerModule.getTokenList(
        sender
      )
      console.log('Token List Response:', tokenListResponse)
      if (!Array.isArray(tokenListResponse)) {
        console.error(
          'Token list fetch returned a non-array response:',
          tokenListResponse
        )
        setLoading(false)
        return
      }
      setTokenNames(tokenListResponse)

      const fetchedBalances = {}
      for (const token of tokenListResponse) {
        const balance = await fuseSDK.explorerModule.getTokenBalance(
          token.address,
          sender
        )
        fetchedBalances[token.address] = balance
      }
      setBalances(fetchedBalances)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    smartWalletBalance()
  }, [])

  return (
    <main className={`flex flex-col items-center p-24`}>
      <h1>Hello, World!</h1>
      <p>Smart account address: {smartAccount}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={`relative overflow-x-auto shadow-md sm:rounded-lg mt-12 ${inter.className}`}>
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase dark:text-gray-400'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 bg-gray-50 dark:bg-gray-800'
                >
                  Token Name
                </th>
                <th scope='col' className='px-6 py-3'>
                  Token Address
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 bg-gray-50 dark:bg-gray-800'
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {tokenNames.map((token) => (
                <tr key={token.address}>
                  <td>{token.name}</td>
                  <td>{token.address}</td>
                  <td>
                    {balances[token.address]
                      ? Number(balances[token.address]).toString()
                      : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}