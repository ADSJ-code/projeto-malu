import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Vitrine from './pages/Vitrine';
import Terapias from './pages/Terapias';
import ProdutosAdicionais from './pages/ProdutosAdicionais';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terapias" element={<Terapias />} />
        <Route path="/vitrine" element={<Vitrine />} />
        <Route path="/produtos-adicionais" element={<ProdutosAdicionais />} />
        
        {/* Rotas Administrativas */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;