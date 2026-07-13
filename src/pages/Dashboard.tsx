import { useState, useEffect } from 'react';
import { LayoutDashboard, LogOut, PlusCircle, Settings, ArrowLeft, Loader2, CheckCircle, DollarSign, ExternalLink, UploadCloud, Eye, Image as ImageIcon, Tag, Calendar, User, Edit, Trash2, List, PackageX, PackageCheck } from 'lucide-react';import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [vistaAtual, setVistaAtual] = useState<'visao-geral' | 'novo-artigo' | 'gerir-artigos' | 'novo-produto' | 'gerir-produtos' | 'configuracoes'>('visao-geral');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  
  // Estados para CRUD Artigo
  const [editandoArtigoId, setEditandoArtigoId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [resumo, setResumo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  
  // Estados para CRUD Produto
  const [editandoProdutoId, setEditandoProdutoId] = useState<string | null>(null);
  const [nomeProduto, setNomeProduto] = useState('');
  const [descProduto, setDescProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');
  const [imgProduto, setImgProduto] = useState('');
  const [catProduto, setCatProduto] = useState('garagem');
  
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Estados para Gestão (Listagem)
  const [artigosCadastrados, setArtigosCadastrados] = useState<any[]>([]);
  const [produtosCadastrados, setProdutosCadastrados] = useState<any[]>([]);
  const [isLoadingListas, setIsLoadingListas] = useState(false);
  const [isValidatingAuth, setIsValidatingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
    } else {
      setIsValidatingAuth(false);
    }
  }, [navigate]);

  const carregarListas = async () => {
    setIsLoadingListas(true);
    try {
      const resArt = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`);
      const dataArt = await resArt.json();
      setArtigosCadastrados(dataArt || []);

      const resProd = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const dataProd = await resProd.json();
      setProdutosCadastrados(dataProd || []);
    } catch (error) {
      console.error("Erro ao carregar listas", error);
    } finally {
      setIsLoadingListas(false);
    }
  };

  useEffect(() => {
    setMensagem({ tipo: '', texto: '' }); 
    if (vistaAtual === 'gerir-artigos' || vistaAtual === 'gerir-produtos' || vistaAtual === 'visao-geral') {
      carregarListas();
    }
  }, [vistaAtual]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrlCallback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=26d7dc95cc43c4d4dbea2a8100c967c2', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) setUrlCallback(data.data.url);
      else setMensagem({ tipo: 'erro', texto: 'Erro no upload da imagem.' });
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Falha no servidor de imagens.' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const limparFormularioArtigo = () => {
    setEditandoArtigoId(null);
    setTitulo(''); setCategoria(''); setResumo(''); setConteudo(''); setImagemUrl('');
  };

  const handleCriarOuEditarArtigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensagem({ tipo: '', texto: '' });
    
    const url = editandoArtigoId 
      ? `${import.meta.env.VITE_API_URL}/api/posts/${editandoArtigoId}` 
      : `${import.meta.env.VITE_API_URL}/api/posts/create`;
      
    const metodo = editandoArtigoId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: metodo, 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ title: titulo, category: categoria, summary: resumo, content: conteudo, image_url: imagemUrl, slug: titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), status: 'published' }),
      });
      
      const text = await response.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch (err) { data = { message: text }; }
      
      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: editandoArtigoId ? 'Artigo atualizado!' : 'Artigo publicado!' });
        limparFormularioArtigo();
        setTimeout(() => setVistaAtual('gerir-artigos'), 2000);
      } else {
        setMensagem({ tipo: 'erro', texto: data.message || data.error || text || 'Erro desconhecido ao guardar.' });
      }
    } catch { 
      setMensagem({ tipo: 'erro', texto: 'Falha na rede. Verifique se o servidor está ativo.' }); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const removerArtigo = async (id: string) => {
    if(!window.confirm("Tem certeza que deseja apagar permanentemente esta reflexão?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if(res.ok) carregarListas();
      else {
        const errText = await res.text();
        alert("Erro ao remover o artigo: " + errText);
      }
    } catch (e) {
      alert("Falha de conexão com o servidor.");
    }
  };

  const prepararEdicaoArtigo = (art: any) => {
    setEditandoArtigoId(art.id);
    setTitulo(art.title); setCategoria(art.category); setResumo(art.summary); setConteudo(art.content); setImagemUrl(art.image_url);
    setVistaAtual('novo-artigo');
  };

  const limparFormularioProduto = () => {
    setEditandoProdutoId(null);
    setNomeProduto(''); setDescProduto(''); setPrecoProduto(''); setImgProduto(''); setCatProduto('garagem');
  };

  const handleCriarOuEditarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensagem({ tipo: '', texto: '' });
    
    const url = editandoProdutoId 
      ? `${import.meta.env.VITE_API_URL}/api/products/${editandoProdutoId}` 
      : `${import.meta.env.VITE_API_URL}/api/products/create`;
      
    const metodo = editandoProdutoId ? 'PUT' : 'POST';

    let precoFormatado = precoProduto.toString().replace(',', '.');
    const finalPrice = parseFloat(precoFormatado);

    try {
      const response = await fetch(url, {
        method: metodo, 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name: nomeProduto, description: descProduto, price: finalPrice, image_url: imgProduto, category: catProduto, status: 'disponivel' }),
      });
      
      const text = await response.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch (err) { data = { message: text }; }

      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: editandoProdutoId ? 'Produto atualizado!' : 'Produto adicionado à vitrine!' });
        limparFormularioProduto();
        setTimeout(() => setVistaAtual('gerir-produtos'), 2000);
      } else {
        setMensagem({ tipo: 'erro', texto: data.message || data.error || text || 'Erro ao guardar produto.' });
      }
    } catch { 
      setMensagem({ tipo: 'erro', texto: 'Falha na rede. Verifique se o servidor está ativo.' }); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const removerProduto = async (id: string) => {
    if(!window.confirm("Tem certeza que deseja apagar permanentemente este item?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if(res.ok) carregarListas();
      else {
        const errText = await res.text();
        alert("Erro ao remover o item: " + errText);
      }
    } catch (e) {
      alert("Falha de conexão com o servidor.");
    }
  };

  const alternarEstoque = async (produto: any) => {
    const novoStatus = produto.status === 'esgotado' ? 'disponivel' : 'esgotado';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        // Enviamos todos os dados originais + o novo status
        body: JSON.stringify({ 
          name: produto.name, 
          description: produto.description, 
          price: produto.price, 
          image_url: produto.image_url, 
          category: produto.category, 
          status: novoStatus 
        }),
      });
      
      if(res.ok) {
        carregarListas(); // Recarrega a tabela para mostrar o novo status
      } else {
        alert("Erro ao alterar o estoque.");
      }
    } catch (e) {
      alert("Falha de conexão com o servidor.");
    }
  };

  const prepararEdicaoProduto = (prod: any) => {
    setEditandoProdutoId(prod.id);
    setNomeProduto(prod.name); setDescProduto(prod.description); setPrecoProduto(prod.price.toString()); setImgProduto(prod.image_url); setCatProduto(prod.category);
    setVistaAtual('novo-produto');
  };

  const handleAtualizarConfiguracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMensagem({ tipo: '', texto: '' });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/update`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ email: novoEmail, new_password: novaSenha }),
      });
      
      const text = await response.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch (err) { data = { message: text }; }

      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Credenciais atualizadas!' });
        setNovoEmail(''); setNovaSenha('');
      } else setMensagem({ tipo: 'erro', texto: data.message || data.error || text || 'Erro ao atualizar dados.' });
    } catch { setMensagem({ tipo: 'erro', texto: 'Falha na rede.' }); } finally { setIsSubmitting(false); }
  };

  if (isValidatingAuth) {
    return (
      <div className="min-h-screen bg-malu-bg flex flex-col items-center justify-center text-malu-text-muted">
        <Loader2 className="animate-spin mb-4 text-malu-green" size={32} />
        <p className="font-medium uppercase tracking-wider text-xs">A verificar credenciais...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-malu-bg flex font-sans text-malu-text-main">
      
      {/* Menu Lateral Elegante */}
      <aside className="w-64 bg-malu-green-dark text-white flex flex-col shadow-2xl z-20 transition-all flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-serif italic text-white">Mover a Vida</h2>
          <p className="text-malu-lilac text-[10px] font-bold tracking-widest uppercase mt-1">CMS Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="/" target="_blank" className="w-full flex items-center gap-3 px-4 py-3 mb-6 bg-white/10 hover:bg-white/20 rounded-sm font-bold text-xs uppercase tracking-widest transition-colors border border-white/20">
            <ExternalLink size={16} /> Ver Site
          </Link>

          <button onClick={() => setVistaAtual('visao-geral')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-medium text-sm transition-colors ${vistaAtual === 'visao-geral' ? 'bg-malu-lilac/20 text-white' : 'text-white/70 hover:bg-white/5'}`}>
            <LayoutDashboard size={18} /> Visão Geral
          </button>
          
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Reflexões</div>
          <button onClick={() => { limparFormularioArtigo(); setVistaAtual('novo-artigo'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-medium text-sm transition-colors ${vistaAtual === 'novo-artigo' ? 'bg-malu-lilac/20 text-white' : 'text-white/70 hover:bg-white/5'}`}>
            <PlusCircle size={18} /> Nova Reflexão
          </button>
          <button onClick={() => setVistaAtual('gerir-artigos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-medium text-sm transition-colors ${vistaAtual === 'gerir-artigos' ? 'bg-malu-lilac/20 text-white' : 'text-white/70 hover:bg-white/5'}`}>
            <List size={18} /> Gerir Reflexões
          </button>

          <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Loja & Produtos</div>
          <button onClick={() => { limparFormularioProduto(); setVistaAtual('novo-produto'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-medium text-sm transition-colors ${vistaAtual === 'novo-produto' ? 'bg-malu-lilac/20 text-white' : 'text-white/70 hover:bg-white/5'}`}>
            <PlusCircle size={18} /> Novo Produto
          </button>
          <button onClick={() => setVistaAtual('gerir-produtos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-medium text-sm transition-colors ${vistaAtual === 'gerir-produtos' ? 'bg-malu-lilac/20 text-white' : 'text-white/70 hover:bg-white/5'}`}>
            <List size={18} /> Gerir Loja
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button onClick={() => setVistaAtual('configuracoes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-medium text-sm transition-colors ${vistaAtual === 'configuracoes' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}>
            <Settings size={18} /> Configurações
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-400/10 rounded-sm font-medium text-sm transition-colors">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        <div className="absolute opacity-[0.03] top-0 right-0 pointer-events-none text-malu-green-dark">
          <LayoutDashboard size={600} strokeWidth={0.5} />
        </div>

        {/* === VISTA 1: VISÃO GERAL === */}
        {vistaAtual === 'visao-geral' && (
          <div className="relative z-10 animate-fade-in max-w-6xl w-full">
            <header className="mb-10 flex items-center gap-6">
              {/* Logo no Cabeçalho do Dashboard */}
              <img 
                src="/logo.svg" 
                alt="Logo" 
                className="h-28 w-auto object-contain hidden md:block" 
              />
              <div>
                <h1 className="text-4xl font-serif text-malu-green-dark tracking-tight">Olá, Malu!</h1>
                <p className="text-malu-text-muted font-light mt-1">Bem-vinda ao seu centro de controle do Mover a Vida.</p>
              </div>
            </header>

            {/* Cartões de Resumo Clicáveis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div 
                onClick={() => setVistaAtual('gerir-artigos')}
                className="bg-malu-card p-8 rounded-sm border border-malu-green-light shadow-sm flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <h3 className="text-5xl font-serif text-malu-green mb-3 group-hover:scale-110 transition-transform">{artigosCadastrados.length}</h3>
                <p className="text-malu-text-muted text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                  Reflexões Publicadas <span className="text-malu-green opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </p>
              </div>
              <div 
                onClick={() => setVistaAtual('gerir-produtos')}
                className="bg-malu-card p-8 rounded-sm border border-malu-green-light shadow-sm flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <h3 className="text-5xl font-serif text-malu-green mb-3 group-hover:scale-110 transition-transform">{produtosCadastrados.length}</h3>
                <p className="text-malu-text-muted text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                  Itens na Vitrine <span className="text-malu-green opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </p>
              </div>
            </div>

            {/* Atividade Recente (Listas Rápidas) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Últimas Reflexões */}
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-malu-green-light pb-2">
                  <h3 className="text-sm font-bold text-malu-green-dark uppercase tracking-widest">Últimas Reflexões</h3>
                  <button onClick={() => setVistaAtual('gerir-artigos')} className="text-[10px] uppercase font-bold text-malu-text-muted hover:text-malu-green transition-colors">Ver todas</button>
                </div>
                <div className="space-y-3">
                  {artigosCadastrados.length === 0 ? (
                    <p className="text-sm font-light text-malu-text-muted">Nenhuma reflexão ainda.</p>
                  ) : (
                    artigosCadastrados.slice(0, 4).map(artigo => (
                      <div key={artigo.id} className="bg-white p-4 rounded-sm border border-malu-green-light/50 flex justify-between items-center group hover:border-malu-green transition-colors shadow-sm">
                        <div className="flex flex-col">
                          <span className="font-serif text-malu-green-dark line-clamp-1">{artigo.title}</span>
                          <span className="text-[10px] uppercase tracking-widest text-malu-text-muted mt-1">{new Date(artigo.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <button onClick={() => prepararEdicaoArtigo(artigo)} className="text-malu-green opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-malu-bg rounded-sm" title="Editar">
                          <Edit size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Últimos Produtos */}
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-malu-green-light pb-2">
                  <h3 className="text-sm font-bold text-malu-green-dark uppercase tracking-widest">Últimos Itens Adicionados</h3>
                  <button onClick={() => setVistaAtual('gerir-produtos')} className="text-[10px] uppercase font-bold text-malu-text-muted hover:text-malu-green transition-colors">Ver todos</button>
                </div>
                <div className="space-y-3">
                  {produtosCadastrados.length === 0 ? (
                    <p className="text-sm font-light text-malu-text-muted">Nenhum item adicionado.</p>
                  ) : (
                    produtosCadastrados.slice(0, 4).map(produto => (
                      <div key={produto.id} className="bg-white p-4 rounded-sm border border-malu-green-light/50 flex justify-between items-center group hover:border-malu-green transition-colors shadow-sm">
                        <div className="flex items-center gap-3">
                          {produto.image_url && <img src={produto.image_url} alt="mini" className="w-10 h-10 object-cover rounded-sm border border-malu-green-light/50" />}
                          <div className="flex flex-col">
                            <span className="font-serif text-malu-green-dark line-clamp-1">{produto.name}</span>
                            <span className="text-[10px] uppercase tracking-widest text-malu-text-muted mt-1">R$ {produto.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <button onClick={() => prepararEdicaoProduto(produto)} className="text-malu-green opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-malu-bg rounded-sm" title="Editar">
                          <Edit size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
            </div>
          </div>
        )}

        {/* === GERIR ARTIGOS === */}
        {vistaAtual === 'gerir-artigos' && (
          <div className="relative z-10 animate-fade-in max-w-5xl w-full">
            <h1 className="text-3xl font-serif text-malu-green-dark mb-8">Gerir Reflexões</h1>
            
            <div className="bg-malu-card rounded-sm border border-malu-green-light shadow-sm overflow-hidden">
              {isLoadingListas ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-malu-green" size={32} /></div>
              ) : artigosCadastrados.length === 0 ? (
                <div className="p-12 text-center text-malu-text-muted">Nenhuma reflexão publicada.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-malu-bg/50 border-b border-malu-green-light text-[10px] uppercase tracking-widest text-malu-text-muted">
                      <tr>
                        <th className="p-4 font-bold">Título</th>
                        <th className="p-4 font-bold">Categoria</th>
                        <th className="p-4 font-bold">Data</th>
                        <th className="p-4 font-bold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-malu-green-light/50">
                      {artigosCadastrados.map((artigo) => (
                        <tr key={artigo.id} className="hover:bg-malu-bg/30 transition-colors">
                          <td className="p-4 font-serif text-base text-malu-green-dark">{artigo.title}</td>
                          <td className="p-4"><span className="px-2 py-1 bg-malu-lilac-light/30 text-malu-lilac text-[10px] uppercase tracking-widest font-bold rounded-sm border border-malu-lilac-light">{artigo.category}</span></td>
                          <td className="p-4 text-malu-text-muted">{new Date(artigo.created_at).toLocaleDateString('pt-BR')}</td>
                          <td className="p-4 flex items-center justify-end gap-3">
                            <button onClick={() => prepararEdicaoArtigo(artigo)} className="text-malu-green hover:text-malu-green-dark transition-colors" title="Editar"><Edit size={18} /></button>
                            <button onClick={() => removerArtigo(artigo.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Remover"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === GERIR PRODUTOS === */}
        {vistaAtual === 'gerir-produtos' && (
          <div className="relative z-10 animate-fade-in max-w-5xl w-full">
            <h1 className="text-3xl font-serif text-malu-green-dark mb-8">Gerir Loja & Vitrine</h1>
            
            {isLoadingListas ? (
              <div className="bg-malu-card rounded-sm border border-malu-green-light shadow-sm p-12 flex justify-center">
                <Loader2 className="animate-spin text-malu-green" size={32} />
              </div>
            ) : produtosCadastrados.length === 0 ? (
              <div className="bg-malu-card rounded-sm border border-malu-green-light shadow-sm p-12 text-center text-malu-text-muted">
                Nenhum produto ou item cadastrado no sistema.
              </div>
            ) : (
              <div className="space-y-12">
                
                {/* Tabela 1: Bem-Estar & Nutrição */}
                <div>
                  <div className="flex items-center gap-3 mb-4 border-b border-malu-green-light pb-2">
                    <h2 className="text-xl font-serif text-malu-green-dark">Bem-Estar & Nutrição</h2>
                    <span className="px-2 py-0.5 bg-malu-lilac-light/30 text-malu-lilac text-[10px] uppercase tracking-widest font-bold rounded-sm border border-malu-lilac-light">Produtos Físicos</span>
                  </div>
                  <div className="bg-malu-card rounded-sm border border-malu-green-light shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-malu-bg/50 border-b border-malu-green-light text-[10px] uppercase tracking-widest text-malu-text-muted">
                          <tr>
                            <th className="p-4 font-bold">Produto</th>
                            <th className="p-4 font-bold">Preço</th>
                            <th className="p-4 font-bold text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-malu-green-light/50">
                          {produtosCadastrados.filter(p => p.category === 'diversos').length === 0 ? (
                            <tr><td colSpan={3} className="p-6 text-center text-malu-text-muted font-light">Nenhum produto cadastrado nesta categoria.</td></tr>
                          ) : (
                            produtosCadastrados.filter(p => p.category === 'diversos').map((produto) => (
                              <tr key={produto.id} className="hover:bg-malu-bg/30 transition-colors">
                                <td className="p-4 font-serif text-base text-malu-green-dark flex items-center gap-3">
                                  {produto.image_url && <img src={produto.image_url} alt="mini" className="w-10 h-10 object-cover rounded-sm border border-malu-green-light" />}
                                  {produto.name}
                                </td>
                                <td className="p-4 font-bold text-malu-green">R$ {produto.price.toFixed(2)}</td>
                                <td className="p-4 flex items-center justify-end gap-3">
                                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm mr-2 ${produto.status === 'esgotado' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                    {produto.status === 'esgotado' ? 'Esgotado' : 'Em Stock'}
                                  </span>
                                  <button onClick={() => alternarEstoque(produto)} className={`${produto.status === 'esgotado' ? 'text-green-500 hover:text-green-700' : 'text-orange-400 hover:text-orange-600'} transition-colors`} title={produto.status === 'esgotado' ? 'Marcar como Disponível' : 'Marcar como Esgotado'}>
                                    {produto.status === 'esgotado' ? <PackageCheck size={18} /> : <PackageX size={18} />}
                                  </button>
                                  <button onClick={() => prepararEdicaoProduto(produto)} className="text-malu-green hover:text-malu-green-dark transition-colors" title="Editar"><Edit size={18} /></button>
                                  <button onClick={() => removerProduto(produto.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Remover"><Trash2 size={18} /></button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Tabela 2: Desapego */}
                <div>
                  <div className="flex items-center gap-3 mb-4 border-b border-malu-green-light pb-2">
                    <h2 className="text-xl font-serif text-malu-green-dark">Desapego</h2>
                    <span className="px-2 py-0.5 bg-malu-green-light/30 text-malu-green-dark text-[10px] uppercase tracking-widest font-bold rounded-sm border border-malu-green-light">Vitrine</span>
                  </div>
                  <div className="bg-malu-card rounded-sm border border-malu-green-light shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-malu-bg/50 border-b border-malu-green-light text-[10px] uppercase tracking-widest text-malu-text-muted">
                          <tr>
                            <th className="p-4 font-bold">Item</th>
                            <th className="p-4 font-bold">Preço</th>
                            <th className="p-4 font-bold text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-malu-green-light/50">
                          {produtosCadastrados.filter(p => p.category === 'garagem').length === 0 ? (
                            <tr><td colSpan={3} className="p-6 text-center text-malu-text-muted font-light">Nenhum item cadastrado nesta categoria.</td></tr>
                          ) : (
                            produtosCadastrados.filter(p => p.category === 'garagem').map((produto) => (
                              <tr key={produto.id} className="hover:bg-malu-bg/30 transition-colors">
                                <td className="p-4 font-serif text-base text-malu-green-dark flex items-center gap-3">
                                  {produto.image_url && <img src={produto.image_url} alt="mini" className="w-10 h-10 object-cover rounded-sm border border-malu-green-light" />}
                                  {produto.name}
                                </td>
                                <td className="p-4 font-bold text-malu-green">R$ {produto.price.toFixed(2)}</td>
                                <td className="p-4 flex items-center justify-end gap-3">
                                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm mr-2 ${produto.status === 'esgotado' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                    {produto.status === 'esgotado' ? 'Esgotado' : 'Em Stock'}
                                  </span>
                                  <button onClick={() => alternarEstoque(produto)} className={`${produto.status === 'esgotado' ? 'text-green-500 hover:text-green-700' : 'text-orange-400 hover:text-orange-600'} transition-colors`} title={produto.status === 'esgotado' ? 'Marcar como Disponível' : 'Marcar como Esgotado'}>
                                    {produto.status === 'esgotado' ? <PackageCheck size={18} /> : <PackageX size={18} />}
                                  </button>
                                  <button onClick={() => prepararEdicaoProduto(produto)} className="text-malu-green hover:text-malu-green-dark transition-colors" title="Editar"><Edit size={18} /></button>
                                  <button onClick={() => removerProduto(produto.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Remover"><Trash2 size={18} /></button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* === FORMULÁRIO ARTIGO (CRIAR/EDITAR) === */}
        {vistaAtual === 'novo-artigo' && (
          <div className="relative z-10 animate-fade-in max-w-6xl w-full">
            <button onClick={() => { limparFormularioArtigo(); setVistaAtual('gerir-artigos'); }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-malu-text-muted hover:text-malu-green-dark mb-6 transition-colors">
              <ArrowLeft size={16} /> Cancelar / Voltar
            </button>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-3/5">
                <h1 className="text-3xl font-serif text-malu-green-dark mb-8">{editandoArtigoId ? 'Editar Reflexão' : 'Nova Reflexão'}</h1>
                
                {mensagem.texto && (
                  <div className={`p-4 rounded-sm mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                    <CheckCircle size={18} /> {mensagem.texto}
                  </div>
                )}

                <form onSubmit={handleCriarOuEditarArtigo} className="bg-malu-card p-8 rounded-sm border border-malu-green-light shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Título do Artigo</label>
                      <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none font-serif text-lg text-malu-green-dark" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Categoria</label>
                      <input type="text" required value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ex: Autocuidado" className="w-full px-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none font-light" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Imagem Editorial</label>
                    <label className={`flex justify-center items-center gap-2 px-4 py-6 border border-dashed border-malu-green-light bg-malu-bg rounded-sm cursor-pointer hover:bg-white transition-colors ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                      {isUploadingImage ? <Loader2 className="animate-spin text-malu-green" size={20} /> : <UploadCloud className="text-malu-green" size={20} />}
                      <span className="text-xs font-bold uppercase tracking-widest text-malu-green-dark">
                        {isUploadingImage ? 'A enviar...' : 'Escolher foto do computador'}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setImagemUrl)} />
                    </label>
                    {imagemUrl && <p className="text-[10px] font-bold uppercase tracking-widest text-malu-green mt-2 flex items-center gap-1"><CheckCircle size={12}/> {editandoArtigoId && !isUploadingImage ? 'Imagem Atual Mantida' : 'Sucesso!'}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Resumo da Listagem</label>
                    <textarea required value={resumo} onChange={(e) => setResumo(e.target.value)} rows={2} className="w-full px-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none resize-none font-light"></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Texto Completo</label>
                    <textarea required value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows={10} className="w-full px-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none font-light"></textarea>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting || isUploadingImage} className="px-10 py-4 bg-malu-green text-white rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-malu-green-dark shadow-sm flex items-center gap-2 disabled:opacity-70">
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editandoArtigoId ? 'Guardar Alterações' : 'Publicar Reflexão')}
                    </button>
                  </div>
                </form>
              </div>

              {/* Pré-visualização Lado Direito */}
              <div className="w-full lg:w-2/5 sticky top-8">
                <div className="flex items-center gap-2 text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-4">
                  <Eye size={14} /> Visão do Leitor
                </div>
                
                <article className="bg-white rounded-sm overflow-hidden shadow-xl border border-malu-green-light flex flex-col pointer-events-none pb-4">
                  <div className="w-full aspect-[4/3] bg-malu-bg relative flex items-center justify-center overflow-hidden">
                    {imagemUrl ? (
                      <img src={imagemUrl} alt="Capa" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={40} className="text-malu-green-light" />
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest mb-3 text-malu-text-muted">
                      <span className="text-malu-lilac flex items-center gap-1"><Tag size={12} /> {categoria || 'Categoria'}</span>
                      <span className="text-malu-green-light/50">|</span>
                      <span className="flex items-center gap-1"><Calendar size={12} />Hoje</span>
                      <span className="flex items-center gap-1 ml-auto"><User size={12} /> Malu</span>
                    </div>
                    
                    <h2 className="text-2xl font-serif text-malu-green-dark mb-3 line-clamp-2 leading-tight">
                      {titulo || 'O título aparecerá aqui'}
                    </h2>
                    
                    <p className="text-malu-text-muted text-sm leading-relaxed font-light line-clamp-3">
                      {resumo || 'O resumo descritivo guiará o leitor...'}
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        )}

        {/* === FORMULÁRIO PRODUTO (CRIAR/EDITAR) === */}
        {vistaAtual === 'novo-produto' && (
          <div className="relative z-10 animate-fade-in max-w-6xl w-full">
            <button onClick={() => { limparFormularioProduto(); setVistaAtual('gerir-produtos'); }} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-malu-text-muted hover:text-malu-green-dark mb-6 transition-colors">
              <ArrowLeft size={16} /> Cancelar / Voltar
            </button>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-3/5">
                <h1 className="text-3xl font-serif text-malu-green-dark mb-8">{editandoProdutoId ? 'Editar Item' : 'Adicionar à Vitrine'}</h1>
                
                {mensagem.texto && (
                  <div className={`p-4 rounded-sm mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                    <CheckCircle size={18} /> {mensagem.texto}
                  </div>
                )}

                <form onSubmit={handleCriarOuEditarProduto} className="bg-malu-card p-8 rounded-sm border border-malu-green-light shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Nome do Item</label>
                      <input type="text" required value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} className="w-full px-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none font-serif text-lg" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Preço (R$)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-malu-green-light" size={16} />
                        <input type="text" required value={precoProduto} onChange={(e) => setPrecoProduto(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none font-light" placeholder="Ex: 149,90" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Categoria de Destino</label>
                      <select value={catProduto} onChange={(e) => setCatProduto(e.target.value)} className="w-full px-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none font-light uppercase tracking-wider text-xs">
                        <option value="garagem">Desapego</option>
                        <option value="diversos">Bem-Estar & Nutrição</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Foto do Produto</label>
                      <label className={`flex justify-center items-center gap-2 px-4 py-3 border border-dashed border-malu-green-light bg-malu-bg rounded-sm cursor-pointer hover:bg-white transition-colors ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                          {isUploadingImage ? <Loader2 className="animate-spin text-malu-green" size={16} /> : <UploadCloud className="text-malu-green" size={16} />}
                          <span className="text-[10px] font-bold uppercase tracking-widest text-malu-green-dark">
                            {isUploadingImage ? 'A enviar...' : 'Escolher foto'}
                          </span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setImgProduto)} />
                      </label>
                      {imgProduto && <p className="text-[10px] font-bold uppercase tracking-widest text-malu-green mt-2 flex items-center gap-1"><CheckCircle size={12}/> {editandoProdutoId && !isUploadingImage ? 'Imagem Mantida' : 'Sucesso!'}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Descrição / História</label>
                    <textarea required value={descProduto} onChange={(e) => setDescProduto(e.target.value)} rows={4} className="w-full px-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none resize-none font-light"></textarea>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting || isUploadingImage} className="px-10 py-4 bg-malu-green text-white rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-malu-green-dark disabled:opacity-70 shadow-sm flex items-center gap-2">
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editandoProdutoId ? 'Guardar Alterações' : 'Adicionar à Vitrine')}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="w-full lg:w-2/5 sticky top-8">
                <div className="flex items-center gap-2 text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-4">
                  <Eye size={14} /> Visão do Cliente
                </div>
                
                <div className="bg-white rounded-sm overflow-hidden shadow-xl border border-malu-green-light flex flex-col pointer-events-none pb-4">
                  <div className="aspect-[4/3] overflow-hidden relative bg-malu-bg flex items-center justify-center">
                    <div className="absolute top-4 right-4 z-10 bg-malu-card/95 backdrop-blur-sm px-3 py-1.5 rounded-sm font-sans text-sm font-bold text-malu-green-dark shadow-sm border border-malu-green-light">
                      R$ {precoProduto ? parseFloat(precoProduto.replace(',', '.')).toFixed(2) : '0.00'}
                    </div>
                    {imgProduto ? (
                      <img src={imgProduto} alt="Produto" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={48} className="text-malu-green-light" />
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col">
                    <h3 className="text-2xl font-serif text-malu-green-dark mb-2 line-clamp-1">{nomeProduto || 'Nome do Item'}</h3>
                    <p className="text-malu-text-muted text-sm font-light leading-relaxed mb-6 line-clamp-3 min-h-[60px]">
                      {descProduto || 'A história e descrição deste achado único aparecerá aqui...'}
                    </p>
                    <div className="w-full py-4 rounded-sm font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 bg-malu-green text-white shadow-sm">
                      Tenho Interesse <ArrowLeft size={14} className="rotate-180" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === CONFIGURAÇÕES === */}
        {vistaAtual === 'configuracoes' && (
          <div className="relative z-10 animate-fade-in max-w-2xl">
            <h1 className="text-3xl font-serif text-malu-green-dark mb-8">Segurança da Conta</h1>
            
            {mensagem.texto && (
              <div className={`p-4 rounded-sm mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                <CheckCircle size={18} /> {mensagem.texto}
              </div>
            )}

            <form onSubmit={handleAtualizarConfiguracoes} className="bg-malu-card p-8 rounded-sm border border-malu-green-light shadow-sm space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Novo E-mail de Acesso</label>
                <input type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} className="w-full px-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none font-light" placeholder="Deixe em branco para manter" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-malu-text-muted uppercase tracking-widest mb-2">Nova Palavra-passe</label>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className="w-full px-4 py-3 bg-malu-bg border border-malu-green-light rounded-sm focus:ring-1 focus:ring-malu-green outline-none font-light" placeholder="••••••••" />
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting || (!novoEmail && !novaSenha)} className="px-10 py-4 bg-malu-green text-white rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-malu-green-dark disabled:opacity-50 shadow-sm transition-all flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Guardar Segurança'}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}