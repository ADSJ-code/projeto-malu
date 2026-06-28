import { useState } from 'react';
import { ArrowLeft, MessageCircle, Sparkles, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockProdutosDiversos = [
  { 
    id: 1, 
    nome: 'E-book: Guia Prático de Auto-reflexão', 
    preco: 'R$ 29,90', 
    descricao: 'Um material digital completo com 30 exercícios práticos e guiados para você desenvolver o autoconhecimento, inteligência emocional e criar uma rotina mais alinhada com os seus propósitos de vida. Formato PDF de alta qualidade, legível em celulares e tablets.',
    imagem: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 2, 
    nome: 'Sessão de Alinhamento de Metas (Individual)', 
    preco: 'R$ 150,00', 
    descricao: 'Um encontro online e exclusivo de 1 hora. Focado totalmente no planejamento estratégico dos seus objetivos pessoais e profissionais. Vamos estruturar juntos uma rotina saudável e metas alcançáveis sem sacrificar a sua saúde mental.',
    imagem: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 3, 
    nome: 'Planner Semanal Minimalista (Digital)', 
    preco: 'R$ 19,90', 
    descricao: 'Ferramenta de organização elegante e sem distrações visuais. Arquivo em alta resolução pronto para impressão caseira ou para ser importado em aplicativos de notas (GoodNotes, Notability, Samsung Notes). Organize seus dias com leveza.',
    imagem: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1200' 
  }
];

export default function ProdutosAdicionais() {
  const numeroWhatsApp = "5511978044488";
  const [produtoSelecionado, setProdutoSelecionado] = useState<typeof mockProdutosDiversos[0] | null>(null);

  const lidarComInteresse = (nomeProduto: string) => {
    const mensagem = `Olá, Malu! Vi a sua página de produtos e tenho interesse em adquirir: *"${nomeProduto}"*. Como faço para prosseguir?`;
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  // TELA DE DETALHES
  if (produtoSelecionado) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] pb-24">
        <div className="w-full h-[300px] md:h-[450px] relative bg-[#e8ebe9]">
          <img src={produtoSelecionado.imagem} alt={produtoSelecionado.nome} className="w-full h-full object-cover brightness-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          <div className="absolute top-8 left-6 md:left-12 z-10">
            <button onClick={() => { setProdutoSelecionado(null); window.scrollTo(0,0); }} className="inline-flex items-center gap-2 text-sm font-medium bg-white/90 backdrop-blur-sm text-[#3a4d40] px-4 py-2 rounded-xl hover:bg-white transition-all shadow">
              <ArrowLeft size={16} /> Voltar para Materiais
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 mt-12 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8e7cc3] bg-[#8e7cc3]/10 px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-[#8e7cc3]/20">
              <Sparkles size={14} /> Material Exclusivo
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#2c3531] tracking-tight">{produtoSelecionado.nome}</h1>
            <p className="text-3xl font-medium text-[#3a4d40] mt-4">{produtoSelecionado.preco}</p>
          </div>

          <div className="text-[#5a6561] text-base md:text-lg leading-relaxed font-light py-6 border-y border-[#d2dad6]/50">
            <p>{produtoSelecionado.descricao}</p>
          </div>

          <div className="bg-[#e8ebe9] border border-[#d2dad6] rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <h3 className="font-bold text-[#2c3531] text-lg">Pronto para dar o próximo passo?</h3>
              <p className="text-sm text-[#5a6561] font-light">Chame no WhatsApp para enviarmos as instruções e liberar o seu acesso.</p>
            </div>
            <button onClick={() => lidarComInteresse(produtoSelecionado.nome)} className="flex items-center gap-2 px-8 py-4 bg-[#3a4d40] text-white rounded-xl font-medium hover:bg-[#2d3c32] transition-colors shadow flex-shrink-0">
              <MessageCircle size={20} /> Adquirir via WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LISTAGEM DE PRODUTOS
  return (
    <div className="min-h-screen bg-[#fbfbfa] relative pb-24">
      <div className="w-full bg-[#e8ebe9] pt-12 pb-20 relative">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#5a6561] hover:text-[#3a4d40] transition-colors mb-6">
            <ArrowLeft size={16} /> Voltar ao Início
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm text-[#3a4d40]">
              <Package size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#2c3531] tracking-tight">Produtos & Materiais</h1>
          </div>
          <p className="text-[#5a6561] mt-3 max-w-2xl font-light text-lg">
            Confira ferramentas, infoprodutos e soluções exclusivas desenvolvidas para apoiar a sua jornada de desenvolvimento pessoal.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#fbfbfa"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProdutosDiversos.map((produto) => (
            <article key={produto.id} onClick={() => { setProdutoSelecionado(produto); window.scrollTo(0,0); }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#d2dad6] group cursor-pointer flex flex-col">
              <div className="h-48 overflow-hidden bg-[#e8ebe9] relative">
                <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#d2dad6] flex items-center gap-1 text-xs font-bold text-[#8e7cc3] uppercase tracking-wider shadow-sm">
                  <Sparkles size={12} /> Exclusivo
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <h3 className="text-lg font-bold text-[#2c3531] group-hover:text-[#8e7cc3] transition-colors">{produto.nome}</h3>
                <p className="text-[#5a6561] text-sm leading-relaxed line-clamp-3">{produto.descricao}</p>
                <div className="pt-2 mt-auto">
                  <p className="text-2xl font-bold text-[#3a4d40]">{produto.preco}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}