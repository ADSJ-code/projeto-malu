import { useState, useEffect } from 'react';
import { ArrowLeft, Tag, Loader2, Info, Leaf, Flower2 } from 'lucide-react';
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

export default function Vitrine() {
  const numeroWhatsApp = "5511978044488";
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(response => response.json())
      .then(data => {
        // Filtra para garantir que apenas os itens da garagem aparecem aqui
        const apenasGaragem = (data || []).filter((item: Produto) => item.category === 'garagem');
        setProdutos(apenasGaragem);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar produtos:", error);
        setIsLoading(false);
      });
  }, []);

  const comprarViaWhatsApp = (nomeProduto: string, precoProduto: number) => {
    const mensagem = `Olá, Malu! Tenho interesse no item da sua Venda de Garagem: *${nomeProduto}* (R$ ${precoProduto.toFixed(2)}). Ele ainda está disponível?`;
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
            className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>
        
        {/* Botão Voltar */}
        <Link to="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-malu-text-muted hover:text-malu-green-dark transition-colors">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </nav>

      <div className="w-full bg-malu-bg pt-16 pb-20 text-center border-b border-malu-green-light/40">
        <h1 className="text-5xl md:text-6xl font-serif text-malu-green-dark tracking-tight italic mb-6">
          Venda de Garagem
        </h1>
        <p className="text-malu-text-muted max-w-2xl mx-auto font-light text-lg px-6">
          Achados especiais, livros e itens com história, agora disponíveis para encontrarem um novo lar e novas energias.
        </p>
      </div>

      <div className="w-full flex flex-col">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-malu-text-muted">
            <Loader2 className="animate-spin mb-4 text-malu-green" size={32} />
            <p className="font-medium uppercase tracking-wider text-sm">A organizar a vitrine...</p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-32 px-6 max-w-2xl mx-auto">
            <Tag className="mx-auto text-malu-green-light mb-6" size={48} />
            <h3 className="text-3xl font-serif text-malu-green-dark mb-4">A vitrine está vazia</h3>
            <p className="text-malu-text-muted font-light text-lg">Nenhum item adicionado à venda de garagem de momento.</p>
          </div>
        ) : (
          produtos.map((produto, index) => {
            const isPar = index % 2 === 0;
            const bgClass = 'bg-malu-bg';
            
            const btnClass = produto.status === 'esgotado'
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-malu-green text-white hover:bg-malu-green-dark shadow-sm';

            return (
              <section key={produto.id} className={`w-full py-24 relative overflow-hidden ${bgClass}`}>
                
                {/* Bloco Lateral de Sotaque */}
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 h-[80%] w-[35%] bg-malu-green/95 z-0 transition-all hidden md:block
                    ${isPar ? 'left-0 rounded-r-sm' : 'right-0 rounded-l-sm'}`}
                />

                {/* Marcas d'água */}
                <div className={`absolute opacity-[0.03] pointer-events-none z-0 hidden lg:block ${isPar ? '-right-32 top-1/2 -translate-y-1/2' : '-left-32 top-1/2 -translate-y-1/2'} text-malu-green-dark`}>
                  {isPar ? <Leaf size={400} strokeWidth={0.5} /> : <Flower2 size={400} strokeWidth={0.5} />}
                </div>

                <div className={`max-w-6xl mx-auto px-6 w-full flex flex-col ${isPar ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20 relative z-10`}>
                  
                  {/* Foto Limpa com Efeito Overlap */}
                  <div className="w-full md:w-1/2 relative flex justify-center">
                    <div 
                      className={`w-full aspect-[4/3] max-w-[480px] overflow-hidden relative shadow-xl bg-white rounded-sm
                        ${isPar ? 'md:translate-x-10' : 'md:-translate-x-10'}`}
                    >
                      {produto.status === 'esgotado' && (
                        <div className="absolute top-6 left-6 z-10 bg-red-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                          Esgotado
                        </div>
                      )}
                      <img 
                        src={produto.image_url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38'} 
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38'; }}
                        alt={produto.name}
                        className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102 ${produto.status === 'esgotado' ? 'grayscale opacity-70' : ''}`}
                      />
                    </div>
                  </div>
                  
                  {/* Conteúdo do Produto */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest mb-4">
                      <span className="text-malu-lilac">R$ {produto.price.toFixed(2)}</span>
                      <span className="text-malu-green-light/50">|</span>
                      <span className="text-malu-text-muted font-light">{produto.category}</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-malu-green-dark mb-6 leading-tight">
                      {produto.name}
                    </h2>
                    
                    <p className="text-malu-text-muted text-base leading-relaxed mb-10 font-light">
                      {produto.description}
                    </p>

                    <div>
                      <button 
                        onClick={() => comprarViaWhatsApp(produto.name, produto.price)}
                        disabled={produto.status === 'esgotado'}
                        className={`px-8 py-4 rounded-sm font-bold uppercase tracking-wider text-xs transition-all ${btnClass}`}
                      >
                        {produto.status === 'esgotado' ? (
                          'Item Indisponível'
                        ) : (
                          <span className="flex items-center gap-2">Tenho Interesse <ArrowLeft size={16} className="rotate-180" /></span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            );
          })
        )}

        <div className="w-full bg-malu-bg py-16 border-t border-malu-green-light/40">
          <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center gap-4 text-malu-text-muted">
            <Info size={24} className="flex-shrink-0 text-malu-green" />
            <p className="text-sm font-light text-center sm:text-left">
              Os itens da Venda de Garagem são únicos e sujeitos à disponibilidade. O pagamento e a forma de entrega serão combinados diretamente pelo WhatsApp.
            </p>
          </div>
        </div>
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