// src/pages/Goals.js
import React, { useState } from 'react';
import './Goals.css';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [monthsToGoal, setMonthsToGoal] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const months = parseFloat(targetAmount) / parseFloat(monthlyInvestment);
    setGoals([...goals, { name: goalName, months: months.toFixed(1) }]);
    setGoalName('');
    setTargetAmount('');
    setMonthlyInvestment('');
    setMonthsToGoal(months.toFixed(1));
  };

  return (
    <div className="goals-container">
      <h1>Metas Financeiras</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Calcular Meta</button>
      </form>

      {monthsToGoal && (
        <p>Você atingirá sua meta em {monthsToGoal} meses.</p>
      )}

      <h2>Suas Metas</h2>
      <ul>
        {goals.map((goal, index) => (
          <li key={index}>
            {goal.name}: {goal.months} meses
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Goals;