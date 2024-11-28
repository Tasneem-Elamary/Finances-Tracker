import {
      BrowserRouter as Router,
      Route,
      Routes,
    
    } from 'react-router-dom';
import Dashboard from "./components/dashboard";
import './App.css'
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import BudgetExpense from "./components/budgetExpenses";
import AddTransactionForm from "./components/addTransacction";
import AddBudgetForm from "./components/addBudget";
import LoginForm from "./components/loginForm";

const App = () => {
      return (
        <Router>
          <div className="finance-app">
            {/* Render Sidebar and Navbar conditionally */}
            <Routes>
              <Route
                path="/login"
                element={<LoginForm />}
              />
              <Route
                path="/*"
                element={
                  <>
                    <Sidebar />
                    <div className="main-content">
                      <Navbar />
                      <MainRoutes />
                    </div>
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      );
    };
    
    // Define routes for the main application (Dashboard, Add Transaction, etc.)
    const MainRoutes = () => (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories-budget" element={<BudgetExpense />} />
        <Route path="/add-transaction" element={<AddTransactionForm />} />
        <Route path="/add-budget" element={<AddBudgetForm />} />
      </Routes>
    );
    
    export default App;