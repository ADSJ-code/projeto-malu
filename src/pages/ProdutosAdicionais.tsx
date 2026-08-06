import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Sparkles, Leaf, Flower2, Loader2, PackageOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Produto {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  status: string;
}

export default function ProdutosAdicionais() {
  const numeroWhatsApp = "5511978044488";
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndexes, setActiveImageIndexes] = useState<{[key: string]: number}>({});

  const handleNextImage = (productId: string, maxIndex: number) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [productId]: prev[productId] !== undefined 
        ? (prev[productId] === maxIndex ? 0 : prev[productId] + 1)
        : 1
    }));
  };

  const handlePrevImage = (productId: string, maxIndex: number) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [productId]: prev[productId] !== undefined 
        ? (prev[productId] === 0 ? maxIndex : prev[productId] - 1)
        : maxIndex
    }));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(response => response.json())
      .then(data => {
        // Filtrar apenas os itens com a categoria "diversos"
        const diversos = (data || []).filter((item: Produto) => item.category === 'diversos');
        setProdutos(diversos);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar produtos:", error);
        setIsLoading(false);
      });
  }, []);

  const lidarComInteresse = (nomeProduto: string, precoProduto: number) => {
    const mensagem = `Olá, Malu! Vi a sua página do Mover a Vida e tenho interesse no produto: *"${nomeProduto}"* (R$ ${precoProduto.toFixed(2)}). Como faço para prosseguir?`;
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-malu-bg font-sans">
      <nav className="p-6 md:px-12 flex justify-between items-center bg-malu-bg/80 backdrop-blur-md sticky top-0 z-50 border-b border-malu-green-light/50">
        {/* Logo Clicável */}
        <Link to="/" className="flex items-center group">
          <img 
            src="/logo.svg" 
            alt="Mover a Vida Logo" 
            className="h-16 sm:h-24 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>
        
        {/* Botão Voltar */}
        <Link to="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-malu-text-muted hover:text-malu-green-dark transition-colors">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </nav>

      <div className="w-full bg-malu-bg pt-16 pb-20 text-center border-b border-malu-green-light/40">
        <h1 className="text-5xl md:text-6xl font-serif text-malu-green-dark tracking-tight italic mb-6">
          Bem-Estar & Nutrição
        </h1>
        <p className="text-malu-text-muted max-w-2xl mx-auto font-light text-lg px-6">
          Produtos e suplementos cuidadosamente selecionados para apoiar a sua vitalidade, nutrição e o equilíbrio do corpo físico.
        </p>
      </div>

      <div className="w-full flex flex-col pt-16">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-malu-text-muted">
            <Loader2 className="animate-spin mb-4 text-malu-green" size={32} />
            <p className="font-medium uppercase tracking-wider text-sm">A carregar materiais...</p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-32 px-6 max-w-2xl mx-auto">
            <PackageOpen className="mx-auto text-malu-green-light mb-6" size={48} />
            <h3 className="text-3xl font-serif text-malu-green-dark mb-4">Nenhum produto disponível</h3>
            <p className="text-malu-text-muted font-light text-lg">De momento não temos produtos de nutrição listados aqui. Volte em breve!</p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-32 md:gap-48 pb-32">
            {produtos.map((produto, index) => {
              const isPar = index % 2 === 0;

              return (
                <section key={produto.id} className="w-full relative min-h-[420px] flex items-center overflow-hidden">
                  
                  {/* 🟢 BLOCO DE SOTAQUE ASSEMETRICO */}
                  <div 
                    className={`absolute top-1/2 -translate-y-1/2 h-[80%] w-[35%] bg-malu-green/95 z-0 transition-all hidden md:block
                      ${isPar ? 'left-0 rounded-r-sm' : 'right-0 rounded-l-sm'}`}
                  />

                  {/* Marcas d'água */}
                  <div className={`absolute opacity-[0.03] pointer-events-none z-0 hidden lg:block ${isPar ? '-right-32 top-1/2 -translate-y-1/2' : '-left-32 top-1/2 -translate-y-1/2'} text-malu-green-dark`}>
                    {isPar ? <Flower2 size={400} strokeWidth={0.5} /> : <Leaf size={400} strokeWidth={0.5} />}
                  </div>

                  <div className={`max-w-6xl mx-auto px-6 w-full flex flex-col ${isPar ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20 relative z-10`}>
                    
                    {/* Imagem Limpa com Efeito Overlap e Galeria */}
                    <div className="w-full md:w-1/2 relative flex justify-center">
                      <div className={`w-full aspect-[4/3] max-w-[480px] overflow-hidden relative shadow-xl transition-transform duration-500 hover:-translate-y-1 group bg-white rounded-sm ${isPar ? 'md:translate-x-10' : 'md:-translate-x-10'}`}>
                        {produto.status === 'esgotado' && (
                          <div className="absolute top-6 left-6 z-20 bg-red-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                            Esgotado
                          </div>
                        )}
                        
                        {(() => {
                          const images = produto.image_url ? produto.image_url.split(',') : ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38'];
                          const currentIndex = activeImageIndexes[produto.id] || 0;
                          const hasMultiple = images.length > 1;

                          return (
                            <>
                              <img 
                                src={images[currentIndex]} 
                                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38'; }}
                                alt={`${produto.name} - Imagem ${currentIndex + 1}`}
                                className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${produto.status === 'esgotado' ? 'grayscale opacity-70' : ''}`}
                              />
                              
                              {/* Controlos da Galeria */}
                              {hasMultiple && (
                                <>
                                  <button 
                                    onClick={(e) => { e.preventDefault(); handlePrevImage(produto.id, images.length - 1); }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-malu-green-dark p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                                  >
                                    <ChevronLeft size={20} />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.preventDefault(); handleNextImage(produto.id, images.length - 1); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-malu-green-dark p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                                  >
                                    <ChevronRight size={20} />
                                  </button>
                                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                    {images.map((_, idx) => (
                                      <div 
                                        key={idx} 
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-malu-green w-4' : 'bg-white/60'}`}
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </>
                          );
                      })()}
                      </div>
                    </div>
                    
                    {/* Conteúdo Textual */}
                    <div className={`w-full md:w-1/2 flex flex-col justify-center text-left ${isPar ? 'md:pl-6' : 'md:pr-6'}`}>
                      
                      <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-5 text-malu-text-muted">
                        <span className="text-malu-lilac flex items-center gap-1"><Sparkles size={12}/> Exclusivo</span>
                        <span className="text-malu-green-light/50">|</span>
                        <span className="text-malu-green font-sans text-sm">R$ {produto.price.toFixed(2)}</span>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-malu-green-dark mb-6 leading-tight hover:text-malu-green transition-colors">
                        {produto.name}
                      </h2>
                      
                      <p className="text-malu-text-muted text-base leading-relaxed mb-8 font-light">
                        {produto.description}
                      </p>

                      <div>
                        <button 
                          onClick={() => lidarComInteresse(produto.name, produto.price)}
                          disabled={produto.status === 'esgotado'}
                          className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold pb-1 transition-colors border-b-2 ${produto.status === 'esgotado' ? 'text-gray-400 border-gray-400 cursor-not-allowed' : 'text-malu-green border-malu-green hover:text-malu-green-dark hover:border-malu-green-dark'}`}
                        >
                          <MessageCircle size={16} /> {produto.status === 'esgotado' ? 'Produto Indisponível' : 'Adquirir via WhatsApp'}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
        
        <footer className="w-full text-center py-8 font-sans text-xs text-malu-text-muted/60 tracking-widest uppercase border-t border-malu-green-light/40 mt-16 relative z-20 bg-malu-bg/80 backdrop-blur-sm">
          &copy; {new Date().getFullYear()} Mover a Vida por{' '}
          <Link to="/admin" className="hover:text-malu-green-dark transition-colors border-b border-transparent hover:border-malu-green-dark/30">
            Malu Celeghim
          </Link>.
        </footer>
      </div>
    </div>
  );
}