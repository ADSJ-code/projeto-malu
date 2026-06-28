import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, MessageCircle, Calendar, User, Search, Tag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Interface que espelha o nosso modelo do Golang
interface Artigo {
  id: string;
  title: string;
  category: string;
  summary: string;
  image_url: string;
  created_at: string;
  content: string; // Adicionado para exibir o texto completo
}

export default function Terapias() {
  const numeroWhatsApp = "5511978044488";
  
  // Estados para gerenciar os dados da API
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado que gerencia qual artigo está aberto.
  const [artigoSelecionado, setArtigoSelecionado] = useState<Artigo | null>(null);

  // Busca os artigos da API quando o componente carrega
  useEffect(() => {
    fetch('http://localhost:8080/api/posts')
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
    let mensagem = "Olá, Malu! Estava lendo os artigos do seu blog sobre terapias e gostaria de conversar a respeito.";
    if (contexto) {
      mensagem = `Olá, Malu! Acabei de ler o seu artigo *"${contexto}"* e achei a reflexão muito interessante. Gostaria de compartilhar algumas ideias sobre o assunto!`;
    }
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  // SE UM ARTIGO ESTIVER SELECIONADO: Renderiza a tela de leitura cheia
  if (artigoSelecionado) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] pb-24 font-sans">
        {/* Banner Superior com Imagem e Botão Voltar */}
        <div className="w-full h-[300px] md:h-[450px] relative bg-[#e8ebe9]">
          <img 
            src={artigoSelecionado.image_url || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773'} 
            alt={artigoSelecionado.title} 
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          <div className="absolute top-8 left-6 md:left-12 z-10">
            <button 
              onClick={() => { setArtigoSelecionado(null); window.scrollTo(0,0); }}
              className="inline-flex items-center gap-2 text-sm font-medium bg-white/90 backdrop-blur-sm text-[#3a4d40] px-4 py-2 rounded-xl hover:bg-white transition-all shadow"
            >
              <ArrowLeft size={16} /> Voltar para o Blog
            </button>
          </div>

          <div className="absolute bottom-8 left-6 right-6 max-w-4xl mx-auto text-white space-y-3">
            <span className="bg-[#8e7cc3] text-white text-xs px-3 py-1 rounded-md font-bold uppercase tracking-wider">
              {artigoSelecionado.category || 'Geral'}
            </span>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight drop-shadow">
              {artigoSelecionado.title}
            </h1>
          </div>
        </div>

        {/* Corpo do Texto do Artigo */}
        <div className="max-w-3xl mx-auto px-6 mt-12 space-y-8">
          
          {/* Metadados de Leitura */}
          <div className="flex items-center gap-6 text-sm font-medium text-[#5a6561] border-b border-[#d2dad6]/50 pb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} /> {new Date(artigoSelecionado.created_at).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-1.5"><User size={16} /> Por Malu Celeghim</span>
          </div>

          {/* Renderização do texto (separando por quebras de linha reais do banco) */}
          <div className="text-[#2c3531] text-base md:text-lg leading-relaxed font-light space-y-6 text-justify whitespace-pre-line">
            {artigoSelecionado.content}
          </div>

          {/* CTA Customizado */}
          <div className="bg-[#e8ebe9] border border-[#d2dad6] rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mt-16">
            <div className="text-center md:text-left space-y-1">
              <h3 className="font-bold text-[#2c3531] text-lg">Sentiu conexão com essa leitura?</h3>
              <p className="text-sm text-[#5a6561] font-light">Vamos trocar ideias. Me chame no WhatsApp para compartilharmos reflexões sobre esse tema.</p>
            </div>
            <button 
              onClick={() => abrirConversaWhatsApp(artigoSelecionado.title)}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#3a4d40] text-white rounded-xl font-medium hover:bg-[#2d3c32] transition-colors shadow flex-shrink-0"
            >
              <MessageCircle size={18} /> Conversar sobre o artigo
            </button>
          </div>

        </div>
      </div>
    );
  }

  // CASO CONTRÁRIO: Renderiza a listagem padrão do blog
  return (
    <div className="min-h-screen bg-[#fbfbfa] relative pb-24 font-sans">
      
      {/* Cabeçalho Orgânico Zen com Onda Corrigida */}
      <div className="w-full bg-[#e8ebe9] pt-12 pb-20 relative">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#5a6561] hover:text-[#3a4d40] transition-colors mb-6">
            <ArrowLeft size={16} /> Voltar ao Início
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm text-[#3a4d40]">
              <BookOpen size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#2c3531] tracking-tight">Reflexões & Terapias</h1>
          </div>
          <p className="text-[#5a6561] mt-3 max-w-2xl font-light text-lg">
            Bem-vinda ao meu espaço de artigos. Aqui compartilho visões, estudos e reflexões sobre práticas terapêuticas e bem-estar.
          </p>
        </div>

        {/* Onda SVG Separadora */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#fbfbfa"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-12">
        
        {/* Barra de Pesquisa */}
        <div className="relative max-w-2xl mx-auto -mt-16 z-20">
          <div className="bg-white rounded-2xl shadow-md border border-[#d2dad6] flex items-center p-2">
            <div className="pl-4 text-[#5a6561]">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Pesquisar artigos, temas ou reflexões..." 
              className="w-full px-4 py-3 bg-transparent outline-none text-[#2c3531] placeholder:text-[#5a6561]/60 font-medium"
            />
            <button className="bg-[#3a4d40] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2d3c32] transition-colors">
              Buscar
            </button>
          </div>
        </div>

        {/* Grid de Artigos Dinâmico da API */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#5a6561]">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-medium">A carregar os artigos da nuvem...</p>
          </div>
        ) : artigos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#d2dad6] shadow-sm max-w-2xl mx-auto">
            <BookOpen className="mx-auto text-[#d2dad6] mb-4" size={48} />
            <h3 className="text-xl font-bold text-[#2c3531] mb-2">Nenhum artigo publicado</h3>
            <p className="text-[#5a6561]">Os textos da Malu aparecerão aqui em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {artigos.map((artigo) => (
              <article key={artigo.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#d2dad6] flex flex-col group hover:shadow-lg transition-all duration-300">
                
                <div 
                  onClick={() => { setArtigoSelecionado(artigo); window.scrollTo(0,0); }}
                  className="w-full h-52 overflow-hidden bg-[#e8ebe9] relative cursor-pointer"
                >
                  <img 
                    src={artigo.image_url || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773'} 
                    alt={artigo.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#d2dad6] flex items-center gap-1.5 text-xs font-bold text-[#8e7cc3] uppercase tracking-wider shadow-sm">
                    <Tag size={12} />
                    {artigo.category || 'Geral'}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-medium text-[#5a6561] mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} />{new Date(artigo.created_at).toLocaleDateString('pt-BR')}</span>
                    <span className="flex items-center gap-1"><User size={14} />Malu Celeghim</span>
                  </div>
                  
                  <h2 
                    onClick={() => { setArtigoSelecionado(artigo); window.scrollTo(0,0); }}
                    className="text-xl font-bold text-[#2c3531] mb-3 group-hover:text-[#8e7cc3] transition-colors line-clamp-2 cursor-pointer"
                  >
                    {artigo.title}
                  </h2>
                  
                  <p className="text-[#5a6561] text-sm leading-relaxed mb-6 line-clamp-3">
                    {artigo.summary}
                  </p>

                  <div className="mt-auto pt-4 border-t border-[#d2dad6]/50">
                    <button 
                      onClick={() => { setArtigoSelecionado(artigo); window.scrollTo(0,0); }}
                      className="text-sm font-bold text-[#3a4d40] group-hover:text-[#8e7cc3] group-hover:translate-x-1 transition-all flex items-center gap-1"
                    >
                      Ler artigo completo →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Call to Action Final */}
        <div className="bg-white border border-[#d2dad6] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 max-w-4xl mx-auto">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-[#2c3531]">Quer saber mais sobre algum assunto?</h3>
            <p className="text-sm text-[#5a6561] mt-1">Entre em contato comigo para tirarmos dúvidas ou compartilharmos experiências.</p>
          </div>
          <button 
            onClick={() => abrirConversaWhatsApp("")}
            className="flex items-center gap-2 px-6 py-3 bg-[#3a4d40] text-white rounded-xl font-medium hover:bg-[#2d3c32] transition-colors shadow-sm hover:shadow flex-shrink-0"
          >
            <MessageCircle size={18} />
            Conversar no WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
}