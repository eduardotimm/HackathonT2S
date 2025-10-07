
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="custom-app">
      <header className="custom-header">
        <div className="header-left">
          <img src={logo} className="custom-logo" alt="logo" />
        </div>
        <div className="header-right">
          <button className="custom-nav-btn" onClick={() => { /* Navegação futura */ }}>
            Ir para outra página
          </button>
        </div>
      </header>
      <main className="custom-main">
        <button className="custom-center-btn" onClick={() => { /* Navegação ou anexo futuro */ }}>
          Anexar arquivo / Ir para outra página
        </button>
      </main>
    </div>
  );
}

export default App;
