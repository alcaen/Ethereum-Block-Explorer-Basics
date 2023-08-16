import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [lastBlock, setLastBlock] = useState();
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    async function getBlockNumber() {
      const block = await alchemy.core.getBlockNumber();
      setLastBlock(block);
    }
    getBlockNumber();
  }, [refresh]);

  return (
    <div className='App'>
      <div>
        Last Block: {lastBlock}{' '}
        <button onClick={() => setRefresh(!refresh)}>Refresh</button>
      </div>
      <BlockSHowUp blockNumber={lastBlock} />
    </div>
  );
}

function BlockSHowUp({ blockNumber }) {
  const [block, setBlock] = useState();
  const [viewTransactions, setViewTransactions] = useState();
  async function getBlock() {
    setBlock(await alchemy.core.getBlock(blockNumber));
  }

  if (!block) return <button onClick={getBlock}>Get Block info</button>;
  const localDate = new Date(block.timestamp * 1000).toLocaleString();
  return (
    <div>
      {block ? (
        <>
          <div>Hash:{block.hash}</div>
          <div>Date:{localDate}</div>
          <button onClick={() => setViewTransactions(!viewTransactions)}>
            Transactions
          </button>
          {viewTransactions &&
            block.transactions.map((transaction) => (
              <Transaction
                transaction={transaction}
                key={transaction}
              />
            ))}
        </>
      ) : null}
    </div>
  );
}

const Transaction = ({ transaction }) => {
  const [transactionInfo, setTransactionInfo] = useState();
  async function getTransaction() {
    setTransactionInfo(await alchemy.core.getTransaction(transaction));
  }
  return (
    <>
      <div>
        {transaction} <button onClick={getTransaction}>See transaction</button>
      </div>
      {transactionInfo ? (
        <div>
          <div>
            FROM: {transactionInfo.from}{' '}
            <a
              href={`https://etherscan.io/address/${transactionInfo.from}`}
              target='_blank'
              rel='noreferrer'
            >
              See on Etherscan
            </a>
          </div>
          <div>
            TO: {transactionInfo.to}{' '}
            <a
              href={`https://etherscan.io/address/${transactionInfo.to}`}
              target='_blank'
              rel='noreferrer'
            >
              See on Etherscan
            </a>
          </div>
          <pre>{JSON.stringify(transactionInfo, null, 2)}</pre>
        </div>
      ) : null}
    </>
  );
};

export default App;
