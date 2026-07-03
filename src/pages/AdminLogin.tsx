import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft, Leaf } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log("Tentando login para:", email);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://projeto-malu.onrender.com";
      
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Status da resposta do Go:", response.status);

      let data: any = {};
      const responseText = await response.text();
      
      try {
        data = JSON.parse(responseText);
      } catch (pErr) {
        console.log("A resposta não era um JSON válido. Lendo como texto puro.");
        data = { message: responseText };
      }

      if (response.ok) {
        console.log("Login autorizado! Guardando token JWT...");
        localStorage.setItem('token', data.token);
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 100);
      } else {
        console.log("Login rejeitado pelo servidor:", data.message);
        setError(data.message || 'E-mail ou palavra-passe incorretos.');
      }
    } catch (err) {
      console.error("Erro crítico na requisição HTTP:", err);
      setError('Erro de conexão. Verifique se o servidor Back-end está ativo na porta 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-malu-bg p-6 font-sans relative overflow-hidden">
      
      {/* Decoração de Fundo Botânica */}
      <div className="absolute opacity-[0.03] pointer-events-none -right-32 top-0 text-malu-green-dark">
        <Leaf size={600} strokeWidth={0.5} />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Cabeçalho do Login */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-malu-text-muted hover:text-malu-green-dark transition-colors mb-6 uppercase tracking-widest">
            <ArrowLeft size={16} /> Voltar ao Site
          </Link>
          <h1 className="text-4xl font-serif text-malu-green-dark tracking-tight italic">
            Mover a Vida
          </h1>
          <p className="text-malu-text-muted mt-2 text-sm uppercase tracking-widest">
            {view === 'login' ? 'Acesso Restrito' : 'Recuperar Acesso'}
          </p>
        </div>

        {/* Formulário Minimalista */}
        <div className="bg-malu-card border border-malu-green-light rounded-sm p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-sm border border-red-100 flex items-center justify-center gap-2 font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-malu-text-muted uppercase tracking-widest mb-2">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-malu-green-light" size={18} />
                    <input 
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none font-light transition-all"
                      placeholder="admin@moveravida.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-malu-text-muted uppercase tracking-widest mb-2">Palavra-passe</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-malu-green-light" size={18} />
                    <input 
                      type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none font-light transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button 
                  type="button" 
                  onClick={() => setView('forgot')}
                  className="text-[10px] font-bold uppercase tracking-widest text-malu-text-muted hover:text-malu-lilac transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <button 
                type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center py-4 bg-malu-green text-white rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-malu-green-dark transition-colors shadow-sm disabled:opacity-70 mt-4"
              >
                {isLoading ? <><Loader2 className="animate-spin mr-2" size={16} /> Entrando...</> : 'Entrar no Painel'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-malu-bg border border-malu-green-light rounded-sm text-center">
                <h3 className="font-serif text-xl text-malu-green-dark mb-2">Ambiente Seguro</h3>
                <p className="text-sm text-malu-text-muted font-light leading-relaxed">
                  Para redefinir a sua palavra-passe, entre em contacto diretamente com o suporte técnico.
                </p>
              </div>
              
              <button 
                type="button" 
                onClick={() => setView('login')}
                className="w-full flex justify-center items-center gap-2 py-3 text-xs uppercase tracking-widest font-bold text-malu-text-muted hover:text-malu-green-dark transition-colors"
              >
                <ArrowLeft size={14} /> Voltar para Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}