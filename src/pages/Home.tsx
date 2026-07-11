import { BookOpen, Sparkles, Store, Package, ArrowRight } from 'lucide-react';import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-malu-bg font-sans overflow-hidden relative">
      
      {/* === OVERLAY DE SOMBRAS BOTÂNICAS (IMAGEM LOCAL) === */}
      {/* A imagem está na pasta public, logo usamos apenas '/sombra.jpg'. O Brave não consegue bloquear isto! */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-50 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "url('/sombra.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-20 pb-32 flex flex-col items-center justify-center text-center border-b border-malu-green-light/40">
        <div className="z-10 max-w-4xl px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-malu-card border border-malu-green-light shadow-sm text-[10px] font-bold text-malu-green-dark uppercase tracking-widest mb-6">
            <Sparkles size={14} className="text-malu-lilac" />
            <span>Bem-vinda ao Espaço Integrativo</span>
          </div>

          {/* === LOGO OFICIAL === */}
          <h1 className="w-full flex justify-center mb-10">
            <img 
              src="/logo.svg" 
              alt="Mover a Vida Logo" 
              className="h-40 sm:h-48 md:h-64 w-auto object-contain mx-auto opacity-95 animate-fade-in" 
            />
            {/* Texto escondido apenas para o Google/SEO ler */}
            <span className="sr-only">Mover a Vida</span>
          </h1>

          <p className="text-lg md:text-xl text-malu-text-muted max-w-2xl mx-auto leading-relaxed font-light mb-10">
            Um portal dedicado ao bem-estar integral, ecologia e autoconhecimento. Alinhe as suas energias e encontre harmonia em todas as facetas da sua jornada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/terapias" className="w-full sm:w-auto px-8 py-4 bg-malu-green text-white rounded-sm font-bold uppercase tracking-wider text-xs hover:bg-malu-green-dark transition-colors shadow-md">
              Explorar Reflexões
            </Link>
            <Link to="/vitrine" className="w-full sm:w-auto px-8 py-4 bg-malu-card text-malu-green-dark border border-malu-green-light rounded-sm font-bold uppercase tracking-wider text-xs hover:bg-malu-bg transition-colors shadow-sm">
              Desapego
            </Link>
          </div>
        </div>
      </section>

      {/* 2. QUEM SOMOS (ESTILO IZZY WAITE) */}
      <section className="w-full relative py-32 flex items-center">
        {/* Bloco Verde Assimétrico */}
        <div className="absolute top-1/2 -translate-y-1/2 h-[80%] w-[35%] bg-malu-green/95 z-0 transition-all hidden md:block left-0 rounded-r-sm" />

        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-12 md:gap-20 relative z-10">
          
          {/* Imagem da Malu sobreposta */}
          <div className="w-full md:w-1/2 relative flex justify-center">
            <div className="w-full aspect-[4/5] max-w-[420px] overflow-hidden relative shadow-xl bg-white rounded-sm md:translate-x-10 group">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" 
                alt="Malu Celeghim" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
          
          {/* Texto Quem Somos */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-left md:pl-6">
            <h2 className="text-4xl md:text-5xl font-serif text-malu-green-dark mb-6 leading-tight">
              Quem é a <span className="italic">Malu?</span>
            </h2>
            
            <div className="text-malu-text-muted text-base leading-relaxed space-y-4 font-light mb-8">
              <p>
                Sou a Malu Celeghim, a voz por trás do Mover a Vida. Acredito que a cura e o bem-estar nascem do equilíbrio entre a nossa mente, o nosso corpo e o ambiente que nos rodeia.
              </p>
              <p>
                Este espaço nasceu da vontade de partilhar estudos, práticas terapêuticas e reflexões sobre um estilo de vida mais consciente, ecológico e sustentável. O meu propósito é guiar-te na tua própria jornada de autoconhecimento.
              </p>
            </div>

            <a href="mailto:moveravida@gmail.com" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-malu-green border-b-2 border-malu-green pb-1 hover:text-malu-green-dark hover:border-malu-green-dark transition-colors w-fit relative z-20">
              Falar com a Malu (moveravida@gmail.com) →
            </a>
          </div>
        </div>
      </section>

      {/* 3. O QUE FAZEMOS */}
      <section className="w-full bg-malu-card py-32 border-t border-malu-green-light/40 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-malu-green-dark mb-4">O Que Fazemos</h2>
            <p className="text-malu-text-muted font-light text-lg">As frentes de atuação do projeto Mover a Vida.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">
            {/* Card 1 */}
            <Link to="/terapias" className="bg-malu-bg p-10 rounded-sm border border-malu-green-light hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col cursor-pointer">
              <BookOpen size={32} className="text-malu-green mb-6 group-hover:text-malu-lilac transition-colors" />
              <h3 className="text-2xl font-serif text-malu-green-dark mb-4 group-hover:text-malu-green transition-colors">Reflexões & Blog</h3>
              <p className="text-malu-text-muted font-light leading-relaxed mb-8 flex-1">
                Artigos profundos sobre bem-estar, ecologia e práticas de autocuidado para nutrir a tua rotina.
              </p>
              <div className="text-xs uppercase tracking-widest font-bold text-malu-green group-hover:text-malu-lilac flex items-center gap-2 mt-auto">
                Ler Blog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/produtos-adicionais" className="bg-malu-bg p-10 rounded-sm border border-malu-green-light hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col cursor-pointer">
              <Package size={32} className="text-malu-green mb-6 group-hover:text-malu-lilac transition-colors" />
              <h3 className="text-2xl font-serif text-malu-green-dark mb-4 group-hover:text-malu-green transition-colors">Bem-Estar & Nutrição</h3>
              <p className="text-malu-text-muted font-light leading-relaxed mb-8 flex-1">
                Uma seleção de produtos físicos e suplementos voltados para a vitalidade e o equilíbrio do teu corpo.
              </p>
              <div className="text-xs uppercase tracking-widest font-bold text-malu-green group-hover:text-malu-lilac flex items-center gap-2 mt-auto">
                Ver Produtos <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/vitrine" className="bg-malu-bg p-10 rounded-sm border border-malu-green-light hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col cursor-pointer">
              <Store size={32} className="text-malu-green mb-6 group-hover:text-malu-lilac transition-colors" />
              <h3 className="text-2xl font-serif text-malu-green-dark mb-4 group-hover:text-malu-green transition-colors">Desapego</h3>
              <p className="text-malu-text-muted font-light leading-relaxed mb-8 flex-1">
                Achados especiais com história e energia renovada, disponíveis para encontrarem um novo lar.
              </p>
              <div className="text-xs uppercase tracking-widest font-bold text-malu-green group-hover:text-malu-lilac flex items-center gap-2 mt-auto">
                Ver Vitrine <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <footer className="w-full text-center py-8 font-sans text-xs text-malu-text-muted/60 tracking-widest uppercase border-t border-malu-green-light/40 relative z-20 bg-malu-bg/80 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} Mover a Vida por{' '}
        <Link to="/admin" className="hover:text-malu-green-dark transition-colors border-b border-transparent hover:border-malu-green-dark/30">
          Malu Celeghim
        </Link>.
      </footer>
    </div>
  );
}