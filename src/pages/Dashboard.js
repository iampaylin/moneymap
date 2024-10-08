import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { collection, doc, getDocs, addDoc, deleteDoc, setDoc } from 'firebase/firestore'; // Correção aqui
import { db, auth } from '../firebaseConfig';
import Delete from '../assets/trash.png';
// import Edit from '../assets/edit.png';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({ type: 'gain', amount: '', description: '' });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadTransactions = async () => {
      const user = auth.currentUser;
      if (user) {
        const transactionsRef = collection(db, 'transactions', user.uid, 'userTransactions');
        const snapshot = await getDocs(transactionsRef);
        const loadedTransactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(loadedTransactions);
        calculateBalance(loadedTransactions);
      }
    };

    loadTransactions();
  }, []);

  const calculateBalance = (transactions) => {
    let total = 0;
    transactions.forEach(transaction => {
      if (transaction.type === 'gain') {
        total += parseFloat(transaction.amount);
      } else {
        total -= parseFloat(transaction.amount);
      }
    });
    setBalance(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const transactionData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
    };

    // Atualiza o estado otimisticamente para ter resposta imediata na UI
    const tempId = new Date().getTime(); // Gera um ID temporário para a transação
    const newTransaction = { id: tempId.toString(), ...transactionData };
    
    if (editingTransaction) {
      // Atualizar localmente
      const updatedTransactions = transactions.map(transaction =>
        transaction.id === editingTransaction.id ? { ...transaction, ...transactionData } : transaction
      );
      setTransactions(updatedTransactions);
      setFormData({ type: 'gain', amount: '', description: '' });
      calculateBalance(updatedTransactions);

      try {
        // Atualiza a transação no Firestore em segundo plano
        const transactionDoc = doc(db, 'transactions', user.uid, 'userTransactions', editingTransaction.id);
        await setDoc(transactionDoc, transactionData);
        setEditingTransaction(null);
      } catch (error) {
        console.error("Erro ao atualizar a transação: ", error);
        // Reverter a atualização em caso de erro
        setTransactions(transactions);
        calculateBalance(transactions);
      }
    } else {
      // Adicionar localmente a nova transação para resposta rápida
      setTransactions([...transactions, newTransaction]);
      calculateBalance([...transactions, newTransaction]);

      try {
        // Adiciona a nova transação ao Firestore em segundo plano
        const newTransactionRef = await addDoc(collection(db, 'transactions', user.uid, 'userTransactions'), transactionData);
        // Atualiza o estado com o ID real da transação depois do sucesso no Firestore
        const finalTransaction = { id: newTransactionRef.id, ...transactionData };
        setTransactions(prevTransactions =>
          prevTransactions.map(transaction =>
            transaction.id === tempId.toString() ? finalTransaction : transaction
          )
        );
      } catch (error) {
        console.error("Erro ao adicionar a transação: ", error);
        // Reverter a transação adicionada localmente em caso de erro
        setTransactions(transactions);
        calculateBalance(transactions);
      }
    }
  };

  /* const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({ type: transaction.type, amount: transaction.amount, description: transaction.description });
  }; */

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    // Atualizar otimisticamente removendo localmente
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    calculateBalance(updatedTransactions);

    try {
      // Executar exclusão no Firestore em segundo plano
      const transactionDoc = doc(db, 'transactions', user.uid, 'userTransactions', id);
      await deleteDoc(transactionDoc);
    } catch (error) {
      console.error("Erro ao deletar a transação: ", error);
      // Reverter a exclusão local em caso de erro
      setTransactions(transactions);
      calculateBalance(transactions);
    }
  };
  return (
    <div className="dashboard-container">
      <h2>Saldo: R$ {balance.toFixed(2)}</h2>

      <form onSubmit={handleSubmit} className="transaction-form">
        <input
          className="dashboard-input"
          type="number"
          name="amount"
          placeholder="Valor"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
        <input
          className="dashboard-input"
          type="text"
          name="description"
          placeholder="Descrição"
          value={formData.description}
          onChange={handleInputChange}
        />
        <select name="type" value={formData.type} onChange={handleInputChange} required className="dashboard-select">
          <option value="gain" className="dashboard-option lucro">Lucro</option>
          <option value="expense" className="dashboard-option gasto">Gasto</option>
        </select>
        <button type="submit" className="dashboard-button">
          {editingTransaction ? 'Salvar Alterações' : 'Adicionar Transação'}
        </button>
      </form>

      <ul className="transaction-list dashboard-ul">
        {transactions.map(transaction => (
          <li key={transaction.id} className="transaction-item" style={{ backgroundColor: transaction.type === 'gain' ? '#3ca84a' : 'crimson' }}>
            <span style={{ Color: transaction.type === 'gain' ? 'green' : 'red' }}>
              {transaction.type === 'gain' ? 'Lucro' : 'Gasto'}: R$ {transaction.amount} - {transaction.description}
            </span>
            <div className="transaction-actions">
              {/* <button onClick={() => handleEdit(transaction)} className='edit'><img src={Edit} alt="Editar" width={20} height={20}/></button> */}
              <button onClick={() => handleDelete(transaction.id)} className='delete'><img src={Delete} alt="Deletar" width={20} height={20}/></button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Dashboard;