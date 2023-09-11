import * as React from 'react';
import './App.css';
import Layout, { Top, Middle, Bottom } from './components/layout/layout';
import { Display } from './components/display/display';
import { Form } from './components/form/Form';
import { TransactionList } from './components/transaction-list/transaction-list';
import Label from './components/label/label';
import { sum } from './utils';

const initialTransactions = [
  { id: '1', type: 'income', description: 'Salary', value: 1500 },
  { id: '2', type: 'income', description: 'Lottery', value: 1000 },
  { id: '3', type: 'expense', description: 'Party', value: 550 },
  { id: '4', type: 'expense', description: 'Cyberpunk', value: 500 },
];

const App = () => {
  const [transactions, setTransactions] = React.useState(
    initialTransactions
  );
  console.log(initialTransactions)

  const addTransaction = (newTransaction) => {
    setTransactions(transactions.concat(newTransaction));
  };
  const removeTransaction = (transactionId) => {
    setTransactions(transactions.filter((t) => t.id !== transactionId));
  };

  const incomeList = transactions.filter((t) => t.type === 'income');
  
  console.log(incomeList)

  const expensesList = transactions.filter((t) => t.type === 'expense');



  const income = sum(incomeList)
  const expenses = sum(expensesList);


  return (
    <div>
      <h1 className='head'>Expenses Tracker</h1>
    <Layout>
      <Top>
        <Display income={income} expenses={expenses} />
      </Top>

      <Middle>
        <Form onSubmit={addTransaction} />
      </Middle>

      <Bottom>
        <div className="income">
          <Label>Income</Label>
          <TransactionList
            list={incomeList}
            onDeleteClick={removeTransaction}
          />
        </div>
        <div className="expenses">
          <Label>Expenses</Label>
          <TransactionList
            list={expensesList}
            onDeleteClick={removeTransaction}
          />
        </div>
      </Bottom>
    </Layout>
    </div>
  );
}

export default App;