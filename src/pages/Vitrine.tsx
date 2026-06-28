import { useState, useEffect } from 'react';
import { ArrowLeft, Tag, ShoppingBag, Loader2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

// Interface que espelha o nosso modelo de Produto do Golang
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

  // Busca os produtos da API quando a página carrega
  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(response => response.json())
      .then(data => {
        setProdutos(data || []);
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
    <div className="min-h-screen bg-[#fbfbfa] font-sans">
      {/* Navbar Minimalista */}
      <nav className="p-6 md:px-12 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b border-[#d2dad6]/50">
        <div className="text-xl font-black tracking-tighter text-[#2c3531]">Malu<span className="text-[#5a6561] font-light">Celeghim</span></div>
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[#5a6561] hover:text-[#3a4d40] transition-colors">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm text-[#3a4d40] mb-6 border border-[#d2dad6]">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#2c3531] tracking-tight mb-6 leading-tight">
            Venda de <span className="text-[#3a4d40]">Garagem</span>
          </h1>
          <p className="text-[#5a6561] text-lg font-light leading-relaxed">
            Achados especiais, livros e itens com história, agora disponíveis para encontrarem um novo lar.
          </p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#5a6561]">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-medium">A organizar a vitrine...</p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#d2dad6] shadow-sm max-w-2xl mx-auto">
            <Tag className="mx-auto text-[#d2dad6] mb-4" size={48} />
            <h3 className="text-xl font-bold text-[#2c3531] mb-2">A vitrine está vazia</h3>
            <p className="text-[#5a6561]">A Malu ainda não adicionou nenhum item à venda de garagem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {produtos.map((produto) => (
              <div key={produto.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#d2dad6] hover:shadow-xl transition-all group flex flex-col">
                <div className="h-64 overflow-hidden relative bg-[#e8ebe9]">
                  {/* Etiqueta de Preço */}
                  <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl font-black text-[#3a4d40] shadow-sm border border-[#d2dad6]">
                    R$ {produto.price.toFixed(2)}
                  </div>
                  {/* Etiqueta de Status (se estiver vendido) */}
                  {produto.status === 'vendido' && (
                    <div className="absolute top-4 left-4 z-10 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                      Vendido
                    </div>
                  )}
                  <img 
                    src={produto.image_url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38'} 
                    alt={produto.name}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${produto.status === 'vendido' ? 'grayscale opacity-70' : ''}`}
                  />
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#2c3531] mb-2">{produto.name}</h3>
                  <p className="text-[#5a6561] text-sm font-light leading-relaxed flex-1 mb-6">
                    {produto.description}
                  </p>
                  
                  <button 
                    onClick={() => comprarViaWhatsApp(produto.name, produto.price)}
                    disabled={produto.status === 'vendido'}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      produto.status === 'vendido' 
                        ? 'bg-[#e8ebe9] text-[#a0aba5] cursor-not-allowed' 
                        : 'bg-[#3a4d40] text-white hover:bg-[#2d3c32] shadow-sm'
                    }`}
                  >
                    {produto.status === 'vendido' ? (
                      'Item Indisponível'
                    ) : (
                      <>Tenho Interesse <ArrowLeft size={16} className="rotate-180" /></>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-[#e8ebe9] border border-[#d2dad6] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-[#5a6561] max-w-3xl mx-auto">
          <Info size={24} className="flex-shrink-0 text-[#3a4d40]" />
          <p className="text-sm font-medium text-center sm:text-left">
            Os itens da Venda de Garagem são únicos e sujeitos à disponibilidade. O pagamento e a forma de entrega serão combinados diretamente pelo WhatsApp.
          </p>
        </div>
      </main>
    </div>
  );
}