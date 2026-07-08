import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, MessageCircle, Calendar, User, Search, Loader2, Leaf, Flower2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Artigo {
  id: string;
  title: string;
  category: string;
  summary: string;
  image_url: string;
  created_at: string;
  content: string;
}

export default function Terapias() {
  const numeroWhatsApp = "5511978044488";
  
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [artigoSelecionado, setArtigoSelecionado] = useState<Artigo | null>(null);
  
  // 🔍 Estados para Filtro e Pesquisa (Pedidos na Reunião)
  const [pesquisa, setPesquisa] = useState('');
  const [ordenacao, setOrdenacao] = useState<'recentes' | 'antigos'>('recentes');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/posts`)
      .then(response => response.json())
      .then(data => {
        setArtigos(data || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar artigos:", error);
        setIsLoading(false);
      });
  }, []);

  const abrirConversaWhatsApp = (contexto: string) => {
    let mensagem = "Olá, Malu! Estava lendo os artigos do seu blog Mover a Vida e gostaria de conversar a respeito.";
    if (contexto) {
      mensagem = `Olá, Malu! Acabei de ler o seu artigo *"${contexto}"* no Mover a Vida e achei a reflexão muito interessante!`;
    }
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  // 📝 PROCESSAMENTO: Filtragem por texto + Ordenação por data
  const artigosProcessados = artigos
    .filter(artigo => 
      artigo.title.toLowerCase().includes(pesquisa.toLowerCase()) ||
      artigo.summary.toLowerCase().includes(pesquisa.toLowerCase()) ||
      artigo.category.toLowerCase().includes(pesquisa.toLowerCase())
    )
    .sort((a, b) => {
      const dataA = new Date(a.created_at).getTime();
      const dataB = new Date(b.created_at).getTime();
      return ordenacao === 'recentes' ? dataB - dataA : dataA - dataB;
    });

  // TELA DE LEITURA COMPLETA
  if (artigoSelecionado) {
    return (
      <div className="min-h-screen bg-malu-bg pb-24 font-sans">
        <div className="w-full h-[300px] md:h-[450px] relative bg-malu-green-light">
          <img 
            src={artigoSelecionado.image_url || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773'} 
            alt={artigoSelecionado.title} 
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          <div className="absolute top-8 left-6 md:left-12 z-10">
            <button 
              onClick={() => { setArtigoSelecionado(null); window.scrollTo(0,0); }}
              className="inline-flex items-center gap-2 text-sm font-medium bg-malu-card/90 backdrop-blur-sm text-malu-green-dark px-4 py-2 rounded-sm hover:bg-malu-card transition-all shadow"
            >
              <ArrowLeft size={16} /> Voltar para Reflexões
            </button>
          </div>

          <div className="absolute bottom-8 left-6 right-6 max-w-4xl mx-auto text-white space-y-3">
            <span className="bg-malu-lilac text-white text-xs px-3 py-1 rounded-sm font-bold uppercase tracking-wider">
              {artigoSelecionado.category || 'Geral'}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif italic tracking-tight leading-tight drop-shadow-md">
              {artigoSelecionado.title}
            </h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 mt-12 space-y-8">
          <div className="flex items-center gap-6 text-sm font-medium text-malu-text-muted border-b border-malu-green-light pb-4 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} /> {new Date(artigoSelecionado.created_at).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-1.5"><User size={16} /> Por Malu Celeghim</span>
          </div>

          <div className="text-malu-text-main text-base md:text-lg leading-relaxed font-light space-y-6 text-justify whitespace-pre-line">
            {artigoSelecionado.content}
          </div>

          <div className="bg-malu-card border border-malu-green-light rounded-sm p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mt-16">
            <div className="text-center md:text-left space-y-1">
              <h3 className="font-serif text-malu-green-dark text-2xl">Sentiu conexão com essa leitura?</h3>
              <p className="text-sm text-malu-text-muted font-light">Vamos trocar ideias. Me chame no WhatsApp para compartilharmos reflexões.</p>
            </div>
            <button 
              onClick={() => abrirConversaWhatsApp(artigoSelecionado.title)}
              className="flex items-center gap-2 px-6 py-3.5 bg-malu-green text-white rounded-sm font-medium hover:bg-malu-green-dark transition-colors shadow flex-shrink-0"
            >
              <MessageCircle size={18} /> Conversar no WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LISTAGEM DO BLOG MOVER A VIDA
  return (
    <div className="min-h-screen bg-malu-bg relative font-sans">
      
      {/* Barra de Navegação Padronizada */}
      <nav className="p-6 md:px-12 flex justify-between items-center bg-malu-bg/80 backdrop-blur-md sticky top-0 z-50 border-b border-malu-green-light/50">
        {/* Logo Clicável */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.svg" 
            alt="Mover a Vida Logo" 
            className="w-10 h-10 object-contain transition-transform group-hover:scale-105" 
          />
          <div className="text-xl font-serif text-malu-green-dark tracking-wide">
            Mover a <span className="italic font-light text-malu-green">Vida</span>
          </div>
        </Link>
        
        {/* Botão Voltar */}
        <Link to="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-malu-text-muted hover:text-malu-green-dark transition-colors">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </nav>

      <div className="w-full bg-malu-bg pt-16 pb-24 relative border-b border-malu-green-light/40">
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-malu-green-dark tracking-tight italic mb-6">
            Reflexões Mover a Vida
          </h1>
          <p className="text-malu-text-muted max-w-2xl mx-auto font-light text-lg">
            Um espaço de quietude. Artigos sobre práticas terapêuticas, autocuidado, ecologia e um estilo de vida consciente escritos pela Malu.
          </p>
        </div>

        {/* Barra de Pesquisa Estilo Editorial (Idêntica ao Modelo) */}
        <div className="absolute -bottom-8 left-0 w-full flex justify-center px-6 z-20">
          <div className="bg-white rounded-sm shadow-lg border border-malu-green-light flex items-center p-1.5 w-full max-w-3xl">
            <div className="pl-4 text-malu-text-muted flex-shrink-0">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Procurar uma reflexão..." 
              className="w-full px-4 py-3 bg-transparent outline-none text-malu-text-main placeholder:text-malu-text-muted/60 font-light text-sm"
            />
            {/* Filtro embutido discretamente */}
            <div className="hidden md:flex items-center border-l border-malu-green-light/50 pl-4 pr-2">
              <select 
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as 'recentes' | 'antigos')}
                className="bg-transparent outline-none cursor-pointer text-malu-green-dark font-bold text-[10px] uppercase tracking-widest"
              >
                <option value="recentes">Mais Recentes</option>
                <option value="antigos">Mais Antigos</option>
              </select>
            </div>
            {/* Botão Buscar interno igual ao modelo */}
            <button className="bg-malu-green-dark text-white px-8 py-3.5 rounded-sm font-bold uppercase tracking-widest text-[10px] hover:bg-malu-green transition-colors ml-2 flex-shrink-0">
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Renderização Editorial */}
      <div className="w-full flex flex-col pt-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-malu-text-muted">
            <Loader2 className="animate-spin mb-4 text-malu-green" size={32} />
            <p className="font-medium tracking-widest uppercase text-sm">A sintonizar reflexões...</p>
          </div>
        ) : artigosProcessados.length === 0 ? (
          <div className="text-center py-32 px-6 max-w-2xl mx-auto">
            <BookOpen className="mx-auto text-malu-green-light mb-6" size={48} />
            <h3 className="text-2xl font-serif text-malu-green-dark mb-4">Nenhuma reflexão encontrada</h3>
            <p className="text-malu-text-muted font-light">Tente mudar os termos da sua pesquisa.</p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-32 md:gap-48 pb-32">
            {artigosProcessados.map((artigo, index) => {
              const isPar = index % 2 === 0;

              return (
                <section key={artigo.id} className="w-full relative min-h-[420px] flex items-center overflow-hidden">
                  
                  {/* Bloco Verde Lateral */}
                  <div 
                    className={`absolute top-1/2 -translate-y-1/2 h-[80%] w-[35%] bg-malu-green/95 z-0 transition-all hidden md:block
                      ${isPar ? 'left-0 rounded-r-sm' : 'right-0 rounded-l-sm'}`}
                  />

                  {/* Marcas d'água nas bordas */}
                  <div className={`absolute opacity-[0.03] pointer-events-none z-0 hidden lg:block ${isPar ? '-right-32 top-1/2 -translate-y-1/2' : '-left-32 top-1/2 -translate-y-1/2'} text-malu-green-dark`}>
                    {isPar ? <Flower2 size={400} strokeWidth={0.5} /> : <Leaf size={400} strokeWidth={0.5} />}
                  </div>

                  <div className={`max-w-6xl mx-auto px-6 w-full flex flex-col ${isPar ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20 relative z-10`}>
                    
                    {/* Imagem Pura com Efeito Overlap */}
                    <div className="w-full md:w-1/2 relative flex justify-center">
                      <div 
                        onClick={() => { setArtigoSelecionado(artigo); window.scrollTo(0,0); }}
                        className={`w-full aspect-[4/3] max-w-[480px] overflow-hidden relative cursor-pointer shadow-xl transition-transform duration-500 hover:-translate-y-1 group bg-white rounded-sm
                          ${isPar ? 'md:translate-x-10' : 'md:-translate-x-10'}`} 
                      >
                        <img 
                          src={artigo.image_url || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773'} 
                          alt={artigo.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                      </div>
                    </div>
                    
                    {/* Texto Editorial Limpo */}
                    <div className={`w-full md:w-1/2 flex flex-col justify-center text-left ${isPar ? 'md:pl-6' : 'md:pr-6'}`}>
                      
                      {/* Categoria Discreta + Data */}
                      <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-5 text-malu-text-muted">
                        <span className="text-malu-lilac">{artigo.category || 'Geral'}</span>
                        <span className="text-malu-green-light/50">|</span>
                        <span className="flex items-center gap-1.5"><Calendar size={14} className="mb-0.5"/>{new Date(artigo.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                      
                      <h2 
                        onClick={() => { setArtigoSelecionado(artigo); window.scrollTo(0,0); }}
                        className="text-3xl md:text-4xl lg:text-5xl font-serif text-malu-green-dark mb-6 leading-tight cursor-pointer hover:text-malu-green transition-colors"
                      >
                        {artigo.title}
                      </h2>
                      
                      <p className="text-malu-text-muted text-base leading-relaxed mb-8 line-clamp-4 font-light">
                        {artigo.summary}
                      </p>

                      <div>
                        <button 
                          onClick={() => { setArtigoSelecionado(artigo); window.scrollTo(0,0); }}
                          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-malu-green border-b-2 border-malu-green pb-1 hover:text-malu-green-dark hover:border-malu-green-dark transition-colors"
                        >
                          Ler reflexão completa →
                        </button>
                      </div>
                    </div>

                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

        <footer className="w-full text-center py-8 font-sans text-xs text-malu-text-muted/60 tracking-widest uppercase border-t border-malu-green-light/40 mt-16">
        &copy; {new Date().getFullYear()} Mover a Vida por{' '}
        <Link to="/admin" className="hover:text-malu-green-dark transition-colors border-b border-transparent hover:border-malu-green-dark/30">
          Malu Celeghim
        </Link>.
      </footer>

    </div>
    
  );
}