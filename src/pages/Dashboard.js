import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('lucro'); // Tipo de transação: lucro ou gasto

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      description,
      amount: parseFloat(amount),
      type,
    };
    setTransactions([...transactions, newTransaction]);
    setDescription('');
    setAmount('');
  };

  return (
    <div className="dashboard-container">
      <h1>Controle Financeiro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="lucro">Lucro</option>
          <option value="gasto">Gasto</option>
        </select>
        <button type="submit">Adicionar Transação</button>
      </form>

      <ul>
        {transactions.map((transaction, index) => (
          <li
            key={index}
            className={transaction.type === 'lucro' ? 'income' : 'expense'}
          >
            {transaction.description}: R$ {transaction.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;