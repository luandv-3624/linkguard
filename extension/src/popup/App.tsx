import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import '../index.css';

const App: React.FC = () => {

  return (
    <AppProvider>
      <div className="app">
        <Header />
        <main className="app-content">
          <Dashboard />
        </main>
      </div>
    </AppProvider>
  );
};

export default App;
