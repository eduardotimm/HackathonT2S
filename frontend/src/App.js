


import logo from './logo.svg';
import './App.css';
import CentralForm from './CentralForm';
import profileIcon from './profile-icon.png'; // Adicione o ícone na pasta src

function App() {
  return (
    <div className="custom-app">
      <header className="custom-header">
        <div className="header-left">
          <img src={logo} className="custom-logo" alt="logo" />
        </div>
        <div className="header-right">
          <img
            src={profileIcon}
            alt="Perfil/Login"
            className="profile-icon"
            style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
          />
        </div>
      </header>
      <main className="custom-main">
        <CentralForm />
      </main>
    </div>
  );
}

export default App;
