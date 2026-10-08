# BusinessAroundMe 🏢📍

> **Plataforma de Descoberta, Conexão e Fortalecimento do Comércio Local**

O **BusinessAroundMe** é uma aplicação completa voltada para conectar moradores, consumidores e empresários de uma mesma região geográfica. A plataforma permite localizar estabelecimentos por proximidade, visualizar catálogos de produtos e serviços, agendar atendimentos, consultar avaliações reais e gerenciar uma rede ativa de parcerias B2B entre os próprios negócios locais.

---

## 📌 Visão Geral & Apresentação Funcional

O sistema foi desenhado com foco em usabilidade e performance, priorizando o contato direto com o comerciante local (via WhatsApp, telefone e rotas no mapa) e uma área administrativa integrada com controle de papéis de acesso (*Role-Based Access Control*).

---

## 🚀 Funcionalidades Principais

### 1. 📊 Painel Principal (Dashboard)
- **Barra de Procura Inteligente**: Pesquisa abrangente por palavras-chave, produtos ou especialidades.
- **Geolocalização Ativa**: Indicador de bairro e proximidade imediata (ex: Pinheiros, Vila Madalena, Jardins).
- **Métricas do Ecossistema**: Total de comércios verificados, média de satisfação geral e contadores em tempo real.
- **Categorias Rápidas**: Acesso direto a segmentos como *Alimentação & Café*, *Tecnologia*, *Flores*, *Serviços Automotivos*, *Saúde & Bem-estar*.
- **Negócios em Destaque**: Vitrine com os estabelecimentos mais bem avaliados da região.
- **Feed Social de Avaliações**: Prévia dos comentários mais recentes da comunidade.

### 2. 🏬 Catálogo de Negócios (Businesses)
- **Alternância de Layout**: Visualização em **Grade** (cards visuais com fotos) ou em **Lista** (modo condensado).
- **Filtros Avançados**:
  - Filtro por categoria.
  - Filtro exclusivo para **Negócios Verificados** pela moderação.
  - Indicadores de faixa de preço (`$`, `$$`, `$$$`).
- **Comunicação Imediata**: Botões de ação rápida com links para WhatsApp, ligação telefônica e website oficial.
- **Cadastro Ágil**: Modal para inclusão de novos estabelecimentos comerciais com coordenadas geográficas.

### 3. 🗺️ Mapa Interativo de Proximidade (Map)
- **Visualizador Vetorial Dinâmico**: Mapa estilizado com avenidas principais, referências urbanas e representação do Rio Pinheiros.
- **Controle de Raio Radial**: Barra deslizante para calibrar a busca de 1 km até 15 km de distância.
- **Pins Pulsantes**: Seleção de qualquer estabelecimento com destaque visual imediato.
- **Calculadora de Deslocamento**:
  - 🚶 Tempo estimado a pé.
  - 🚲 Tempo estimado de bicicleta.
  - 🚗 Tempo estimado de carro.

### 4. 📦 Vitrine de Produtos Locais (Products)
- Catálogo descentralizado de mercadorias físicas (pães de fermentação natural, cafés especiais, buquês botânicos, passes corporativos, etc.).
- Filtro por estabelecimento fornecedor.
- Pedido direto no WhatsApp do comerciante com mensagem pré-formatada.
- Cadastro de novos produtos diretamente pela interface.

### 5. 💼 Hub de Serviços Especializados (Services)
- Catálogo de serviços com duração média, preços e escopo detalhado (mecânica, salas de reunião, banho & tosa, pilates).
- **Agendamento Interativo**: Formulário com solicitação de data e contato para retorno pelo estabelecimento.

### 6. ⭐ Sistema de Avaliações Comunitárias (Reviews)
- Avaliações autênticas com notas de 1 a 5 estrelas.
- Filtro por classificação de estrelas (5 estrelas, 4 estrelas, 3 estrelas).
- Contador de "Útil" (curtidas em avaliações).
- Formulário público para submeter novas notas e relatos de experiência.

### 7. 🛡️ Área Administrativa & Gestão (Admin)
- **Gerenciamento de Negócios**:
  - Edição de dados cadastrais.
  - Ativação ou desativação do **Selo de Verificado**.
  - Exclusão e moderação de conteúdos.
- **Rede de Relacionamentos B2B**:
  - Mapeamento de parcerias entre estabelecimentos (ex: fornecimento de café, manutenção predial, parcerias de coworking).
  - Classificação por tipo (*Fornecedor*, *Parceiro Comercial*, *Prestador de Serviço*, *Ponto de Retirada*).
- **Gerenciamento de Usuários**:
  - Controle de papéis: `Administrador`, `Dono de Negócio`, `Cliente / Visitante`.
  - Habilitação granular de permissões de gestão de parcerias.

---

## 👥 Perfis de Acesso & Demonstração

Para facilitar a exploração de todas as rotas e permissões, o sistema conta com um **Alternador de Perfis** acessível no rodapé da Sidebar ou no cabeçalho superior:

1. **Carlos Eduardo Menezes (Administrador Geral)**: Acesso total a todas as seções públicas e menus administrativos restritos.
2. **Mariana Costa (Dona de Negócio - Café Aromas da Vila)**: Perfil focado na gestão comercial e catálogo de produtos.
3. **Lucas Fernandes Silva (Cliente / Explorador)**: Perfil focado em navegação, busca no mapa, agendamentos e avaliações.
4. **Visitante Desconectado**: Modo público de navegação.

---

## 🛠️ Tecnologias & Estrutura

- **Frontend**: [React 19](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/)
- **Build & Dev**: [Vite 8](https://vitejs.dev/)
- **Roteamento**: [React Router DOM v7](https://reactrouter.com/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com fontes Google (*Plus Jakarta Sans*)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Camada de Dados & API**: Cliente `base44Client` com armazenamento persistente em `localStorage`, permitindo operações de CRUD completas no navegador sem necessidade de banco de dados externo para testes.

---

## 📂 Estrutura de Arquivos

```
├── src/
│   ├── api/
│   │   └── base44Client.ts       # Simulação de API, dados iniciais e persistência
│   ├── components/
│   │   ├── ui/
│   │   │   ├── badge.tsx         # Componente de tags/selos
│   │   │   ├── button.tsx        # Componente de botões variantes
│   │   │   └── sidebar.tsx       # Sidebar responsiva e acessível
│   │   ├── AuthModal.tsx         # Alternador de perfis e autenticação
│   │   ├── BusinessModal.tsx     # Modal de criação/edição de negócios
│   │   └── Layout.tsx            # Layout estrutural conforme especificação
│   ├── pages/
│   │   ├── AdminBusinesses.tsx    # Moderação administrativa de negócios
│   │   ├── BusinessDetail.tsx     # Página de detalhes com abas
│   │   ├── BusinessRelationships.tsx # Mapeamento de parcerias B2B
│   │   ├── Businesses.tsx         # Catálogo geral de comércios
│   │   ├── Dashboard.tsx          # Painel principal
│   │   ├── MapPage.tsx            # Mapa interativo com raio radial e rotas
│   │   ├── Products.tsx           # Marketplace de produtos
│   │   ├── Reviews.tsx            # Centro de avaliações
│   │   ├── Services.tsx           # Catálogo de serviços e agendamentos
│   │   └── UserManagement.tsx     # Gestão de usuários e permissões
│   ├── utils/
│   │   └── index.ts               # Utilitários de roteamento e formatação
│   ├── App.tsx                    # Rotas da aplicação
│   ├── main.tsx                   # Ponto de entrada React
│   └── index.css                  # Folha de estilos com Tailwind CSS
├── index.html                     # HTML com SEO e metadados
├── metadata.json                  # Metadados do applet
├── package.json                   # Dependências do projeto
└── vite.config.ts                 # Configuração do Vite com aliases
```

---

## 💻 Como Rodar o Projeto

1. Instalar as dependências:
   ```bash
   npm install
   ```

2. Iniciar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Construir para produção:
   ```bash
   npm run build
   ```
