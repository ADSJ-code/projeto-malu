import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Lock, Mail, ArrowRight, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

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
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Status da resposta do Go:", response.status);

      // Tratamento defensivo de leitura do payload
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
        
        // Pequeno delay para garantir gravação estável no localStorage antes de mudar de rota
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
    <div className="min-h-screen flex items-center justify-center bg-[#fbfbfa] p-4 font-sans relative overflow-hidden">
      
      <div className="bg-white rounded-3xl shadow-xl flex w-full max-w-4xl overflow-hidden min-h-[500px] relative z-10 border border-[#d2dad6]">
        
        {/* Lado Esquerdo - Formulário */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 relative">
          <div className="max-w-sm mx-auto w-full space-y-6">
            
            <div className="text-left">
              <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#5a6561] hover:text-[#3a4d40] mb-6 uppercase tracking-wider transition-colors">
                <ArrowLeft size={14} /> Voltar ao Site
              </Link>
              
              <h1 className="text-3xl font-black text-[#2c3531] tracking-tight mb-2">
                {view === 'login' ? 'Acesso Restrito' : 'Recuperar Acesso'}
              </h1>
              <p className="text-[#5a6561] text-sm font-light">
                {view === 'login' 
                  ? 'Painel administrativo do Espaço Malu Celeghim.' 
                  : 'Instruções para redefinição de palavra-passe.'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {view === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5a6561] uppercase mb-1 ml-1">E-mail</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a6561]" size={20} />
                      <input 
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] focus:border-transparent outline-none transition-all font-medium text-[#2c3531]"
                        placeholder="malu@exemplo.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5a6561] uppercase mb-1 ml-1">Palavra-passe</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a6561]" size={20} />
                      <input 
                        type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none transition-all font-medium text-[#2c3531]"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button 
                    type="button" 
                    onClick={() => setView('forgot')}
                    className="text-sm font-bold text-[#5a6561] hover:text-[#8e7cc3] transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-base font-bold text-white bg-[#3a4d40] hover:bg-[#2d3c32] transition-all disabled:opacity-70 shadow-sm"
                >
                  {isLoading ? <><Loader2 className="animate-spin" size={18} /> Validando...</> : <>Entrar no Painel <ArrowRight size={18} /></>}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl text-center">
                  <h3 className="font-bold text-[#2c3531] mb-2">Ambiente Secure</h3>
                  <p className="text-sm text-[#5a6561] font-light leading-relaxed">
                    Para redefinir a sua palavra-passe, entre em contacto diretamente com o suporte técnico de desenvolvimento.
                  </p>
                </div>
                
                <button 
                  type="button" 
                  onClick={() => setView('login')}
                  className="w-full flex justify-center items-center gap-2 py-3 text-sm font-bold text-[#5a6561] hover:text-[#3a4d40] transition-colors"
                >
                  <ArrowLeft size={16} /> Voltar para Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito */}
        <div className="hidden md:flex w-1/2 bg-[#3a4d40] relative flex-col justify-center p-12 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#2d3c32] to-[#3a4d40] opacity-50 z-0"></div>
          <div className="relative z-10 max-w-sm mx-auto">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-sm">
               <LogIn className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tight leading-tight mb-4">Gestão de Conteúdo</h2>
            <p className="text-[#e8ebe9] text-lg font-light leading-relaxed mb-8">
              Publique novos artigos, atualize a sua vitrine de garagem e faça a gestão dos seus produtos com total autonomia e tranquilidade.
            </p>
            <div className="flex items-center gap-2 text-[#8e7cc3] text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#8e7cc3] animate-pulse"></span>
              CMS Malu v1.0.0
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}