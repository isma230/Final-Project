// src/components/TransactionList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/stripe-transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Stripe Transaction List</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            Amount: {transaction.amount / 100} {transaction.currency}
            <br />
            Payment Method: {transaction.payment_method_types[0]}
            <br />
            Status: {transaction.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
