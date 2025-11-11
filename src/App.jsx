import React, { useEffect, useState } from 'react'

function App() {
  const [name, setName] = useState('')
  const [datetime, setDatetime] = useState('')
  const [description, setDescription] = useState('')
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getTransactions().then(setTransactions)
  }, [])

  async function getTransactions() {
    const url = import.meta.env.VITE_API_URL + "/transaction"
    const response = await fetch(url)
    return await response.json()
  }

  function addNewTransaction(ev) {
    ev.preventDefault()

    const url = import.meta.env.VITE_API_URL + '/transaction'
    const price = name.split(' ')[0]

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime
      }),
    })
      .then(response => response.json())
      .then(json => {
        setName('')
        setDescription('')
        setDatetime('')
        console.log('✅ Transaction added:', json)
        getTransactions().then(setTransactions)
      })
      .catch(err => console.error('❌ Error:', err))
  }

  let balance = 0
  for (const transaction of transactions) {
    balance += transaction.price
  }
  balance = balance.toFixed(2)

  return (
    <main>
      <h1>${balance}</h1>

      <form onSubmit={addNewTransaction}>
        <div className='basic-info'>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='+200 new samsung tv'
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
          />
        </div>
        <div className='description'>
          <input
            type="text"
            placeholder='description'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type='submit'>Add new transaction</button>
      </form>

      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div key={index} className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  {transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  )
}

export default App
