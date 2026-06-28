import { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Store, LogOut, PlusCircle, Settings, ArrowLeft, Loader2, CheckCircle, DollarSign, ExternalLink, UploadCloud, Eye, Image as ImageIcon, Tag, Calendar, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';export default function Dashboard() {
  const navigate = useNavigate();
  
  // Controlo de navegação interna do painel
  const [vistaAtual, setVistaAtual] = useState<'visao-geral' | 'novo-artigo' | 'novo-produto' | 'configuracoes'>('visao-geral');

  // Estados comuns
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // Estados para o formulário do Novo Artigo
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  // Estados para o formulário do Novo Produto
  const [nomeProduto, setNomeProduto] = useState('');
  const [descProduto, setDescProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');
  const [imgProduto, setImgProduto] = useState('');
  const [catProduto, setCatProduto] = useState('garagem');

  // Estados para as Configurações
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  // Estado para controlo de Upload de Imagem
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  // ☁️ FUNÇÃO: Upload de Imagem para o ImgBB
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrlCallback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Usando a sua chave API do ImgBB
      const response = await fetch('https://api.imgbb.com/1/upload?key=26d7dc95cc43c4d4dbea2a8100c967c2', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUrlCallback(data.data.url); // Preenche o link mágico invisivelmente!
      } else {
        setMensagem({ tipo: 'erro', texto: 'Erro ao hospedar a imagem no ImgBB.' });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Falha na comunicação com o servidor de imagens.' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 📝 FUNÇÃO: Criar Artigo
  const handleCriarArtigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensagem({ tipo: '', texto: '' });
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: titulo,
          category: categoria,
          summary: resumo,
          content: conteudo,
          image_url: imagemUrl,
          slug: titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          status: 'published'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Artigo criado com sucesso!' });
        setTitulo(''); setCategoria(''); setResumo(''); setConteudo(''); setImagemUrl('');
        setTimeout(() => setVistaAtual('visao-geral'), 2000);
      } else {
        setMensagem({ tipo: 'erro', texto: data.message || 'Erro ao publicar artigo.' });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro de ligação ao servidor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📦 FUNÇÃO: Criar Produto
  const handleCriarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensagem({ tipo: '', texto: '' });
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nomeProduto,
          description: descProduto,
          price: parseFloat(precoProduto),
          image_url: imgProduto,
          category: catProduto,
          status: 'disponivel'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Produto adicionado com sucesso!' });
        setNomeProduto(''); setDescProduto(''); setPrecoProduto(''); setImgProduto(''); setCatProduto('garagem');
        setTimeout(() => setVistaAtual('visao-geral'), 2000);
      } else {
        setMensagem({ tipo: 'erro', texto: data.message || 'Erro ao adicionar produto.' });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro de ligação ao servidor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⚙️ FUNÇÃO: Atualizar Configurações
  const handleAtualizarConfiguracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensagem({ tipo: '', texto: '' });
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/api/settings/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: novoEmail,
          new_password: novaSenha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Credenciais atualizadas! Use-as no próximo login.' });
        setNovoEmail(''); setNovaSenha('');
      } else {
        setMensagem({ tipo: 'erro', texto: data.message || 'Erro ao atualizar dados.' });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro de ligação ao servidor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] flex font-sans">
      
      {/* Menu Lateral */}
      <aside className="w-64 bg-[#3a4d40] text-white flex flex-col shadow-xl z-20 transition-all">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-black tracking-tight text-[#e8ebe9]">CMS Malu</h2>
          <p className="text-[#8e7cc3] text-xs font-bold tracking-widest uppercase mt-1">Painel Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Link para o Site Público (Abre noutra aba) */}
          <Link 
            to="/" 
            target="_blank"
            className="w-full flex items-center gap-3 px-4 py-3 mb-4 bg-white/10 text-white hover:bg-white/20 rounded-xl font-bold transition-colors border border-white/20"
          >
            <ExternalLink size={18} /> Acessar o Site
          </Link>

          <button 
            onClick={() => setVistaAtual('visao-geral')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${vistaAtual === 'visao-geral' ? 'bg-[#8e7cc3]/20 text-white' : 'text-[#e8ebe9] hover:bg-white/5'}`}
          >
            <LayoutDashboard size={18} /> Visão Geral
          </button>
          
          <button 
            onClick={() => setVistaAtual('novo-artigo')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${vistaAtual === 'novo-artigo' ? 'bg-[#8e7cc3]/20 text-white' : 'text-[#e8ebe9] hover:bg-white/5'}`}
          >
            <FileText size={18} /> Novo Artigo
          </button>
          
          <button 
            onClick={() => setVistaAtual('novo-produto')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${vistaAtual === 'novo-produto' ? 'bg-[#8e7cc3]/20 text-white' : 'text-[#e8ebe9] hover:bg-white/5'}`}
          >
            <Store size={18} /> Novo Item (Vitrine)
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button 
            onClick={() => setVistaAtual('configuracoes')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${vistaAtual === 'configuracoes' ? 'bg-white/10 text-white' : 'text-[#e8ebe9] hover:bg-white/5'}`}
          >
            <Settings size={18} /> Configurações
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-400/10 hover:text-red-200 rounded-xl font-medium transition-colors"
          >
            <LogOut size={18} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Área Principal Dinâmica */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        <div className="zen-blob w-[400px] h-[400px] top-0 right-0 opacity-40"></div>

        {/* === VISTA 1: VISÃO GERAL === */}
        {vistaAtual === 'visao-geral' && (
          <div className="relative z-10 animate-fade-in">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-[#2c3531] tracking-tight">Olá, Malu! ✨</h1>
                <p className="text-[#5a6561] font-light mt-1">O que gostaria de gerir no seu espaço hoje?</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#d2dad6] shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="w-12 h-12 bg-[#e8ebe9] rounded-xl flex items-center justify-center mb-4 text-[#3a4d40]">
                  <FileText size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#2c3531] mb-2">Artigos do Blog</h3>
                <p className="text-[#5a6561] text-sm mb-6 flex-1 font-light leading-relaxed">
                  Escreva novos textos ou edite as reflexões já publicadas no seu blog de terapias.
                </p>
                <button 
                  onClick={() => setVistaAtual('novo-artigo')}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#3a4d40] text-white rounded-xl font-medium hover:bg-[#2d3c32] transition-colors"
                >
                  <PlusCircle size={18} /> Novo Artigo
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#d2dad6] shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="w-12 h-12 bg-[#e8ebe9] rounded-xl flex items-center justify-center mb-4 text-[#3a4d40]">
                  <Store size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#2c3531] mb-2">Venda de Garagem</h3>
                <p className="text-[#5a6561] text-sm mb-6 flex-1 font-light leading-relaxed">
                  Adicione novos achados à sua vitrine, atualize preços, fotos ou marque itens como vendidos.
                </p>
                <button 
                  onClick={() => setVistaAtual('novo-produto')}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#3a4d40] text-white rounded-xl font-medium hover:bg-[#2d3c32] transition-colors"
                >
                  <PlusCircle size={18} /> Novo Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === VISTA 2: FORMULÁRIO DE NOVO ARTIGO === */}
        {vistaAtual === 'novo-artigo' && (
          <div className="relative z-10 animate-fade-in max-w-6xl w-full">
            <button onClick={() => setVistaAtual('visao-geral')} className="flex items-center gap-2 text-sm font-bold text-[#5a6561] hover:text-[#3a4d40] mb-6 transition-colors">
              <ArrowLeft size={16} /> Voltar
            </button>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Formulário (Lado Esquerdo) */}
              <div className="w-full lg:w-3/5">
                <h1 className="text-3xl font-black text-[#2c3531] tracking-tight mb-8">Criar Novo Artigo</h1>
                
                {mensagem.texto && (
                  <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 font-medium ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                    <CheckCircle size={20} /> {mensagem.texto}
                  </div>
                )}

                <form onSubmit={handleCriarArtigo} className="bg-white p-8 rounded-2xl border border-[#d2dad6] shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Título do Artigo</label>
                        <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Categoria</label>
                        <input type="text" required value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ex: Saúde Mental" className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none" />
                    </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Imagem de Capa</label>
                      <label className={`flex justify-center items-center gap-2 px-4 py-3 border-2 border-dashed border-[#d2dad6] rounded-xl cursor-pointer hover:bg-[#fbfbfa] transition-colors ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                        {isUploadingImage ? <Loader2 className="animate-spin text-[#5a6561]" size={20} /> : <UploadCloud className="text-[#5a6561]" size={20} />}
                        <span className="text-sm font-bold text-[#5a6561]">
                          {isUploadingImage ? 'A enviar imagem...' : 'Escolher foto do computador'}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setImagemUrl)} />
                      </label>
                      {imagemUrl && <p className="text-xs font-medium text-green-600 mt-2 flex items-center gap-1"><CheckCircle size={12}/> Imagem carregada com sucesso!</p>}
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Resumo</label>
                      <textarea required value={resumo} onChange={(e) => setResumo(e.target.value)} rows={2} className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none resize-none"></textarea>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Conteúdo Completo</label>
                      <textarea required value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows={8} className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none"></textarea>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting || isUploadingImage} className="px-8 py-3 bg-[#3a4d40] text-white rounded-xl font-bold hover:bg-[#2d3c32] shadow-sm flex items-center gap-2 disabled:opacity-70">
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Publicar Artigo'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Pré-visualização (Lado Direito) */}
              <div className="w-full lg:w-2/5 sticky top-8">
                <div className="flex items-center gap-2 text-sm font-bold text-[#5a6561] uppercase tracking-wider mb-4">
                  <Eye size={16} /> Pré-visualização ao vivo
                </div>
                
                <article className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#d2dad6] flex flex-col pointer-events-none">
                  <div className="w-full h-48 bg-[#e8ebe9] relative flex items-center justify-center overflow-hidden">
                    {imagemUrl ? (
                      <img src={imagemUrl} alt="Capa" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={40} className="text-[#a0aba5]" />
                    )}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#d2dad6] flex items-center gap-1.5 text-xs font-bold text-[#8e7cc3] uppercase tracking-wider">
                      <Tag size={12} /> {categoria || 'Categoria'}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col">
                    <div className="flex items-center gap-4 text-xs font-medium text-[#5a6561] mb-3">
                      <span className="flex items-center gap-1"><Calendar size={14} />{new Date().toLocaleDateString('pt-BR')}</span>
                      <span className="flex items-center gap-1"><User size={14} />Malu Celeghim</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-[#2c3531] mb-3 line-clamp-2">
                      {titulo || 'Título do seu artigo'}
                    </h2>
                    
                    <p className="text-[#5a6561] text-sm leading-relaxed mb-6 line-clamp-3">
                      {resumo || 'O resumo aparecerá aqui para os visitantes...'}
                    </p>

                    <div className="mt-auto pt-4 border-t border-[#d2dad6]/50">
                      <span className="text-sm font-bold text-[#3a4d40]">Ler artigo completo →</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        )}

        {/* === VISTA 3: FORMULÁRIO DE NOVO PRODUTO === */}
        {vistaAtual === 'novo-produto' && (
          <div className="relative z-10 animate-fade-in max-w-6xl w-full">
            <button onClick={() => setVistaAtual('visao-geral')} className="flex items-center gap-2 text-sm font-bold text-[#5a6561] hover:text-[#3a4d40] mb-6 transition-colors">
              <ArrowLeft size={16} /> Voltar
            </button>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Formulário (Lado Esquerdo) */}
              <div className="w-full lg:w-3/5">
                <header className="mb-8">
                  <h1 className="text-3xl font-black text-[#2c3531] tracking-tight">Adicionar à Vitrine</h1>
                  <p className="text-[#5a6561] font-light mt-1">Cadastre um novo item para a Venda de Garagem.</p>
                </header>

                {mensagem.texto && (
                  <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 font-medium ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                    <CheckCircle size={20} /> {mensagem.texto}
                  </div>
                )}

                <form onSubmit={handleCriarProduto} className="bg-white p-8 rounded-2xl border border-[#d2dad6] shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Nome do Item</label>
                      <input type="text" required value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Preço (R$)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a6561]" size={16} />
                        <input type="number" step="0.01" required value={precoProduto} onChange={(e) => setPrecoProduto(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Categoria</label>
                      <select value={catProduto} onChange={(e) => setCatProduto(e.target.value)} className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none">
                        <option value="garagem">Venda de Garagem</option>
                        <option value="diversos">Produtos Diversos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Foto do Produto</label>
                      <label className={`flex justify-center items-center gap-2 px-4 py-3 border-2 border-dashed border-[#d2dad6] rounded-xl cursor-pointer hover:bg-[#fbfbfa] transition-colors ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                          {isUploadingImage ? <Loader2 className="animate-spin text-[#5a6561]" size={20} /> : <UploadCloud className="text-[#5a6561]" size={20} />}
                          <span className="text-sm font-bold text-[#5a6561]">
                            {isUploadingImage ? 'A enviar imagem...' : 'Escolher foto'}
                          </span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setImgProduto)} />
                      </label>
                      {imgProduto && <p className="text-xs font-medium text-green-600 mt-2 flex items-center gap-1"><CheckCircle size={12}/> Foto carregada com sucesso!</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Descrição / Detalhes</label>
                    <textarea required value={descProduto} onChange={(e) => setDescProduto(e.target.value)} rows={3} className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none resize-none"></textarea>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting || isUploadingImage} className="flex items-center gap-2 px-8 py-3 bg-[#3a4d40] text-white rounded-xl font-bold hover:bg-[#2d3c32] disabled:opacity-70 shadow-sm">
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Adicionar à Vitrine'}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Pré-visualização (Lado Direito) */}
              <div className="w-full lg:w-2/5 sticky top-8">
                <div className="flex items-center gap-2 text-sm font-bold text-[#5a6561] uppercase tracking-wider mb-4">
                  <Eye size={16} /> Pré-visualização ao vivo
                </div>
                
                <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-[#d2dad6] flex flex-col pointer-events-none">
                  <div className="h-64 overflow-hidden relative bg-[#e8ebe9] flex items-center justify-center">
                    <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl font-black text-[#3a4d40] shadow-sm border border-[#d2dad6]">
                      R$ {precoProduto ? parseFloat(precoProduto).toFixed(2) : '0.00'}
                    </div>
                    {imgProduto ? (
                      <img src={imgProduto} alt="Produto" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={48} className="text-[#a0aba5]" />
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-[#2c3531] mb-2 line-clamp-1">{nomeProduto || 'Nome do Produto'}</h3>
                    <p className="text-[#5a6561] text-sm font-light leading-relaxed mb-6 line-clamp-3 min-h-[60px]">
                      {descProduto || 'A descrição detalhada do item aparecerá aqui...'}
                    </p>
                    <div className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#3a4d40] text-white shadow-sm">
                      Tenho Interesse <ArrowLeft size={16} className="rotate-180" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* === VISTA 4: CONFIGURAÇÕES === */}
        {vistaAtual === 'configuracoes' && (
          <div className="relative z-10 animate-fade-in max-w-3xl">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-[#2c3531] tracking-tight">Configurações da Conta</h1>
              <p className="text-[#5a6561] font-light mt-1">Atualize os seus dados de acesso ao painel administrativo.</p>
            </header>

            {mensagem.texto && (
              <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 font-medium ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                <CheckCircle size={20} /> {mensagem.texto}
              </div>
            )}

            <form onSubmit={handleAtualizarConfiguracoes} className="bg-white p-8 rounded-2xl border border-[#d2dad6] shadow-sm space-y-6">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Novo E-mail de Acesso</label>
                  <input type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none transition-all"
                    placeholder="Deixe em branco para manter o atual" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5a6561] uppercase mb-2">Nova Palavra-passe</label>
                  <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)}
                    className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#d2dad6] rounded-xl focus:ring-2 focus:ring-[#3a4d40] outline-none transition-all"
                    placeholder="Deixe em branco para manter a atual" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#d2dad6]/50 flex justify-end">
                <button type="submit" disabled={isSubmitting || (!novoEmail && !novaSenha)} 
                  className="flex items-center gap-2 px-8 py-3 bg-[#3a4d40] text-white rounded-xl font-bold hover:bg-[#2d3c32] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Guardar Alterações'}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}