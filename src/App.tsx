import React, { useState } from 'react';
import { 
  Menu, X, ChevronRight, Target, BarChart3, Users, 
  Shield, Award, TrendingUp, Search, PenTool, 
  Heart, Eye, Star, Phone, Mail, Instagram, 
  Linkedin, Facebook, Edit, ArrowUp, 
  Stethoscope, Activity, Plus
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Olá! Vim através do site da bx.\n\nDados de contato:\nNome: ${formData.nome}\nE-mail: ${formData.email}\nTelefone: ${formData.telefone}\n\nGostaria de saber mais sobre os serviços de marketing para clínicas.`;
    const whatsappUrl = `https://wa.me/5519991042675?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-bx-blue rounded-full opacity-20"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-bx-blue rounded-lg rotate-45 opacity-20"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-bx-blue rounded-full opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-bx-blue rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-bx-blue rounded-lg rotate-12 opacity-20"></div>
      </div>

      {/* Header */}
      <header className="bg-black shadow-lg sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img src="/bx.png" alt="bx logo" className="h-12 w-auto rounded-lg" />
              <div className="hidden sm:block">
                <div className="text-xs text-gray-400">Assessoria de Marketing para Clínicas</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#servicos" className="text-gray-300 hover:text-bx-blue transition-colors">Serviços</a>
              <a href="#sobre" className="text-gray-300 hover:text-bx-blue transition-colors">Sobre</a>
              <a href="#contato" className="text-gray-300 hover:text-bx-blue transition-colors">Contato</a>
              <button className="bg-bx-gradient text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all transform hover:scale-105">
                Fale Conosco
              </button>
            </nav>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#servicos" className="text-gray-300 hover:text-bx-blue transition-colors">Serviços</a>
                <a href="#sobre" className="text-gray-300 hover:text-bx-blue transition-colors">Sobre</a>
                <a href="#contato" className="text-gray-300 hover:text-bx-blue transition-colors">Contato</a>
                <button className="bg-bx-gradient text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all">
                  Fale Conosco
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-bx-gradient text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <Stethoscope className="absolute top-10 left-10 w-20 h-20 opacity-10" />
          <Activity className="absolute bottom-10 right-10 w-24 h-24 opacity-10" />
          <Heart className="absolute top-1/2 left-1/4 w-16 h-16 opacity-10" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Posicione sua Clínica para o
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"> Próximo Nível</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-200">
            Estrutura e estratégias de marketing sob medida para clínicas que querem atrair mais pacientes e construir uma presença sólida no mercado.
          </p>
          <button className="bg-white text-bx-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 mb-12">
            Fale com um Especialista
            <ChevronRight className="inline-block ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Método Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Nosso Método</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Um processo estruturado que garante resultados consistentes e mensuráveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all group border border-gray-700">
              <div className="bg-bx-gradient w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Diagnóstico e Planejamento</h3>
              <p className="text-gray-300">
                Análise profunda do seu negócio e definição de estratégias personalizadas para maximizar resultados.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all group border border-gray-700">
              <div className="bg-bx-gradient-light w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Execução e Metrificação</h3>
              <p className="text-gray-300">
                Implementação das campanhas com foco em performance, usando as melhores práticas do mercado.
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all group border border-gray-700">
              <div className="bg-bx-gradient-reverse w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Organização e Escala</h3>
              <p className="text-gray-300">
                Monitoramento contínuo e otimização baseada em dados reais para garantir o ROI esperado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section id="servicos" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Serviços</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Serviços que iremos vender de primeiro momento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group border border-gray-700">
              <div className="bg-bx-gradient w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Marketing</h3>
              <p className="text-gray-300 text-sm mb-4">
                Soluções completas de marketing digital para maximizar sua presença online e atrair mais clientes.
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Construção de SEO (sites, páginas, posicionamento orgânico do Google)</li>
                <li>• Google ADS</li>
                <li>• Meta ADS</li>
                <li>• E-mail marketing</li>
                <li>• Automação de fluxos de nutrição de leads</li>
                <li>• Social Mídia</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group border border-gray-700">
              <div className="bg-bx-gradient-light w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PenTool className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Mídias</h3>
              <p className="text-gray-300 text-sm mb-4">
                Produção completa de conteúdo audiovisual para fortalecer sua marca e engajar seu público.
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Captura de vídeos</li>
                <li>• Captura de fotos</li>
                <li>• Edição de vídeos</li>
                <li>• Criação de roteiro</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group border border-gray-700">
              <div className="bg-bx-gradient-reverse w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Dados</h3>
              <p className="text-gray-300 text-sm mb-4">
                Análise inteligente de dados para tomada de decisões estratégicas baseadas em métricas reais.
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Dashboards de acompanhamento de métricas Microsoft B.I.</li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group border border-gray-700">
              <div className="bg-bx-gradient w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">CRM</h3>
              <p className="text-gray-300 text-sm mb-4">
                Sistema completo de gestão de relacionamento com clientes e automação de processos de vendas.
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• CRM</li>
                <li>• Automação de primeiro atendimento</li>
                <li>• Automação para vendas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Missão Visão Valores Section */}
      <section id="sobre" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Missão, Visão e Valores</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Os princípios que norteiam nossa jornada e definem quem somos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <div className="bg-bx-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Missão</h3>
              <p className="text-gray-300">
                Construir o futuro da gestão empresarial, aumentando a eficiência operacional, gerando mais oportunidades de vendas e acelerando o crescimento dessas empresas para gerar 1 milhão de empregos até 2032. Fazemos isso unindo educação, estratégia, execução e inovação — ajudando nossos clientes e parceiros comerciais a crescerem de maneira sustentável e organizada.
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <div className="bg-bx-gradient-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Visão</h3>
              <p className="text-gray-300">
                Ser a referência em educação empresarial e crescimento de empresas no Brasil, transformando milhares de empresas em organizações sólidas, inovadoras e exponenciais — até 2030, impactando diretamente mais de 50 mil líderes e milhões de pessoas de forma indireta.
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <div className="bg-bx-gradient-reverse w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Valores</h3>
              <div className="text-gray-300 text-sm space-y-1">
                <p>• Foco no Cliente • Intensidade • Responsabilidade</p>
                <p>• Autorresponsabilidade • Coragem • Antifragilidade</p>
                <p>• Visão de Futuro • Alta Performance • Inovação Contínua</p>
                <p>• Exponencialidade • Empreendedorismo • Adaptabilidade</p>
                <p>• Clareza • Autenticidade • Educação Contínua</p>
                <p>• Colaboração • Impacto Social</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Transforme sua Clínica</h2>
            <p className="text-xl text-gray-200 mb-4">
              Pronto para atrair mais pacientes? Vamos criar uma estratégia de marketing perfeita para sua clínica.
            </p>
            <h3 className="text-2xl font-bold text-gray-200">Vamos Fazer sua Clínica Crescer</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-gray-300 mr-3" />
                  <div>
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-gray-300">(19) 991042675</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-gray-300 mr-3" />
                  <div>
                    <div className="font-semibold">E-mail</div>
                    <div className="text-gray-300">bx2gestao@gmail.com</div>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold mb-2 text-gray-200">Consulta Gratuita</h4>
                <p className="text-gray-300 text-sm">
                  Analisamos sua clínica sem compromisso e apresentamos oportunidades específicas de crescimento no marketing médico.
                </p>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-gray-300 border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-gray-300 border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-gray-300 border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Enviar Mensagem
                </button>
              </form>
              <p className="text-xs text-gray-300 mt-4 text-center">
                Ao enviar, você será redirecionado para o WhatsApp com suas informações preenchidas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img src="/bx.png" alt="bx logo" className="h-16 w-auto rounded-lg" />
                <div>
                  <div className="text-xl font-bold">bx Assessoria de Marketing para Clínicas</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Transformamos estratégias em resultados. Sua parceira para o crescimento sustentável no mundo digital.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-bx-blue mr-3" />
                  <span>(19) 991042675</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-bx-blue mr-3" />
                  <span>bx2gestao@gmail.com</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Siga-nos para dicas de marketing e novidades do setor.</p>
                <div className="flex space-x-4">
                  <Instagram className="w-6 h-6 text-gray-400 hover:text-bx-blue cursor-pointer transition-colors" />
                  <Linkedin className="w-6 h-6 text-gray-400 hover:text-bx-blue cursor-pointer transition-colors" />
                  <Facebook className="w-6 h-6 text-gray-400 hover:text-bx-blue cursor-pointer transition-colors" />
                </div>
              </div>
            </div>

            <div className="bg-bx-gradient rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4 text-purple-300">
                Pronto para transformar seu negócio?
              </h3>
              <p className="text-gray-400 mb-6">
                Entre em contato e descubra como podemos impulsionar seus resultados.
              </p>
              <button className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                Fale conosco agora
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 bx - Todos os direitos reservados.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-bx-blue transition-colors">Política de Privacidade</a>
                <a href="#" className="text-gray-400 hover:text-bx-blue transition-colors">Termos de Uso</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-bx-gradient hover:opacity-90 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}

export default App;