import React, { useState, useEffect } from 'react';
import { addDoc, collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Goals = ({ user }) => {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [goals, setGoals] = useState([]);
  const [editing, setEditing] = useState(false); // Estado para editar metas
  const [currentId, setCurrentId] = useState(null); // ID da meta a ser editada

  // Função para adicionar ou editar meta
  const handleSubmitOrUpdateGoal = async (e) => {
    e.preventDefault();
    const months = parseFloat(targetAmount) / parseFloat(monthlyInvestment);
    
    if (editing) {
      // Atualiza meta existente
      const goalRef = doc(db, 'goals', currentId);
      await updateDoc(goalRef, {
        goalName,
        targetAmount: parseFloat(targetAmount),
        monthlyInvestment: parseFloat(monthlyInvestment),
        monthsToGoal: months.toFixed(1),
      });
      setEditing(false);
      setCurrentId(null);
    } else {
      // Adiciona nova meta
      await addDoc(collection(db, 'goals'), {
        userId: user.uid,
        goalName,
        targetAmount: parseFloat(targetAmount),
        monthlyInvestment: parseFloat(monthlyInvestment),
        monthsToGoal: months.toFixed(1),
        createdAt: new Date(),
      });
    }
    
    setGoalName('');
    setTargetAmount('');
    setMonthlyInvestment('');
  };

  // Função para remover meta
  const handleDeleteGoal = async (id) => {
    const goalRef = doc(db, 'goals', id);
    await deleteDoc(goalRef);
  };

  // Função para editar meta (carrega os dados da meta no formulário)
  const handleEditGoal = (goal) => {
    setGoalName(goal.goalName);
    setTargetAmount(goal.targetAmount);
    setMonthlyInvestment(goal.monthlyInvestment);
    setEditing(true);
    setCurrentId(goal.id);
  };

  // Função para buscar as metas no Firestore
  useEffect(() => {
    const q = query(collection(db, 'goals'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const goalsData = [];
      querySnapshot.forEach((doc) => {
        goalsData.push({ ...doc.data(), id: doc.id });
      });
      setGoals(goalsData);
    });

    return () => unsubscribe();
  }, [user.uid]);

  return (
    <div className="goals-container">
      <h1>Metas Financeiras</h1>
      <form onSubmit={handleSubmitOrUpdateGoal}>
        <input
          type="text"
          placeholder="Nome da Meta"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor Total da Meta"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Investimento Mensal"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(e.target.value)}
        />
        <button type="submit">{editing ? 'Atualizar Meta' : 'Adicionar Meta'}</button>
      </form>

      <h2>Suas Metas</h2>
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            {goal.goalName}: {goal.monthsToGoal} meses
            <button onClick={() => handleEditGoal(goal)}>Editar</button>
            <button onClick={() => handleDeleteGoal(goal.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Goals;