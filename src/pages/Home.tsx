import { BookOpen, Sparkles, Store, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 relative overflow-hidden bg-[#fbfbfa]">
      {/* Elementos Fluidos Orgânicos de Fundo */}
      <div className="zen-blob w-[500px] h-[500px] -top-20 -left-20"></div>
      <div className="zen-blob w-[600px] h-[600px] -bottom-40 -right-20"></div>

      {/* Logo Minimalista no Topo (Item de Escopo do Contrato) */}
      <header className="w-full max-w-6xl mx-auto flex justify-center pt-4 z-10">
        <div className="flex items-center gap-2 tracking-[0.2em] text-[#3a4d40] font-light text-sm uppercase">
          <span className="text-lg text-[#8e7cc3]">🌱</span>
          <span>Malu Celeghim</span>
          <span className="text-xs text-[#5a6561]/60">|</span>
          <span className="text-xs text-[#5a6561] tracking-widest font-normal">Espaço Terapêutico</span>
        </div>
      </header>

      {/* Conteúdo Centralizado */}
      <div className="max-w-4xl w-full text-center z-10 space-y-8 my-auto animate-in fade-in zoom-in duration-500">
        
        {/* Badge de Boas-vindas */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#d2dad6] shadow-sm text-sm font-medium text-[#3a4d40]">
          <Sparkles size={16} className="text-[#8e7cc3]" />
          <span>Bem-vinda ao Espaço Integrativo</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl md:text-6xl font-black text-[#2c3531] tracking-tight leading-tight">
          Equilíbrio, Bem-estar e <br />
          <span className="text-[#8e7cc3] drop-shadow-sm font-serif italic">Oportunidades</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-base md:text-lg text-[#5a6561] max-w-2xl mx-auto leading-relaxed font-light">
          Acompanhe artigos e reflexões sobre terapias no nosso blog ou confira achados imperdíveis na nossa vitrine exclusiva.
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-2xl mx-auto">
          <Link to="/terapias" className="w-full sm:w-1/3 flex items-center justify-center gap-2 px-6 py-4 bg-[#3a4d40] text-white rounded-xl font-medium hover:bg-[#2d3c32] transition-all shadow-md hover:shadow-lg">
            <BookOpen size={18} />
            Blog Terapias
          </Link>

          <Link to="/vitrine" className="w-full sm:w-1/3 flex items-center justify-center gap-2 px-6 py-4 bg-white text-[#3a4d40] border border-[#d2dad6] rounded-xl font-medium hover:bg-[#e8ebe9] transition-all shadow-sm">
            <Store size={18} />
            Venda de Garagem
          </Link>

          <Link to="/produtos-adicionais" className="w-full sm:w-1/3 flex items-center justify-center gap-2 px-6 py-4 bg-white text-[#3a4d40] border border-[#d2dad6] rounded-xl font-medium hover:bg-[#e8ebe9] transition-all shadow-sm">
            <Package size={18} />
            Outros Produtos
          </Link>
        </div>
      </div>

      {/* Rodapé institucional discreto para fechar o layout executivo */}
      <footer className="w-full text-center pb-2 text-xs text-[#5a6561]/50 z-10">
        &copy; {new Date().getFullYear()} Espaço Malu Celeghim. Todos os direitos reservados.
      </footer>
    </div>
  );
}