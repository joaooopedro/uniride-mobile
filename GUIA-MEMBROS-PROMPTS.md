# UniRide - Guia de Desenvolvimento para os Membros & Prompts para IA

Guia prático para a equipe de desenvolvimento do projeto **UniRide (Carona Universitária Solidária)** da disciplina de **Desenvolvimento Móvel (2026-2)** no **UniAcademia**.

---

## 1. Passo a Passo Rápido para Cada Membro

1. **Aceitar o convite do repositório**: Acesse [joaooopedro/uniride-mobile/invitations](https://github.com/joaooopedro/uniride-mobile) ou o e-mail do GitHub.
2. **Clonar o projeto**:
   ```bash
   git clone https://github.com/joaooopedro/uniride-mobile.git
   cd uniride-mobile
   npm install
   ```
3. **Criar a sua branch de trabalho**:
   - Clique na sua Task/Issue no GitHub Projects.
   - Clique em **Create a branch** no painel lateral direito da task.
   - Faça o checkout da sua branch localmente (via GitHub Desktop, VS Code ou terminal):
   ```bash
   git fetch origin
   git checkout <sua-branch>
   ```
4. **Abrir na sua IDE com IA**: (Cursor, VS Code com Claude Code / Cline / Copilot / Gemini / Windsurf).
5. **Executar a Tarefa com a IA**:
   - Copie o **Prompt Mestre de Sistema (Bloco A)**.
   - Copie o **Prompt da sua Tarefa Específica (Bloco B)**.
   - Envie para o seu agente de IA.
6. **Testar no Expo Go**:
   ```bash
   npx expo start
   ```
   Abra o app **Expo Go** no celular (Android ou iOS) e **leia o QR Code** gerado no terminal.
7. **Commitar e Enviar**:
   Faça o commit, envie a branch (`git push origin <sua-branch>`), abra o Pull Request no GitHub e faça o merge após validação.

---

## 2. Prompt Mestre de Sistema (Copiar e colar antes da sua task)

```text
Você é um desenvolvedor especialista em React Native, Expo e Styled Components trabalhando no aplicativo móvel UniRide (Carona Universitária Solidária) da UniAcademia.

=== STACK TÉCNICA E ARQUITETURA ===
1. Stack Base: React Native (Expo SDK 51+), @react-navigation/drawer, @react-navigation/bottom-tabs, @react-navigation/native-stack, styled-components/native.
2. Estado Global: Consuma e atualize o contexto global em `src/context/CaronasContext.js` para persistência em memória de caronas, reservas, histórico e perfil.
3. Mock Realista: Utilize dados contextuais da UniAcademia em Juiz de Fora - MG (Campi: Campus Academia / Centro e Campus Estrela Sul; Bairros: Cascatinha, São Mateus, Alto dos Passos, Santa Luzia, Granbery, Benfica, Centro, Manoel Honório).

=== DIRETRIZES DE DESIGN SYSTEM ===
1. Paleta de Cores Semânticas (`src/theme/index.js`):
   - Primária: #2563EB (Azul UniAcademia - botões principais, destaques ativos)
   - Secundária: #3B82F6 (Azul médio - badges informativos, seleções secundárias)
   - Fundo da Tela: #F8FAFC (Cinza gelo neutro)
   - Superfície / Cards: #FFFFFF (Branco puro)
   - Texto Principal: #0F172A (Grafite escuro de alto contraste)
   - Texto Secundário: #64748B (Cinza ardósia para legendas e labels)
   - Bordas / Divisores sutis: #E2E8F0 (Cinza claro sutil)
   - Sucesso: #10B981 (Verde esmeralda para caronas confirmadas e selos)
   - Alerta: #F59E0B (Âmbar para status pendente ou atenção)
   - Perigo / Erro: #EF4444 (Vermelho para cancelamentos e erros)

2. Tipografia e Hierarquia de Fontes:
   - Use fontes do sistema nativas (San Francisco no iOS, Roboto no Android) ou Inter com pesos bem definidos.
   - Escala Padronizada:
     • Display / Título de Tela: 24px a 28px | Peso: 700 (Bold) | Line-height: 32px
     • Cabeçalho de Seção: 18px a 20px | Peso: 600 (SemiBold) | Line-height: 26px
     • Título de Card / Subtítulo: 16px | Peso: 600 (SemiBold) | Line-height: 22px
     • Corpo de Texto (Body): 14px | Peso: 400 (Regular) | Line-height: 20px
     • Legenda / Detalhe / Badge: 12px | Peso: 500 (Medium) | Line-height: 16px
     • Micro / Tags secundárias: 10px a 11px | Peso: 600 (SemiBold)

3. Biblioteca de Ícones (@expo/vector-icons):
   - Utilize exclusivamente `@expo/vector-icons` com foco em `Feather` ou `Ionicons` para consistência visual.
   - Padrão de Tamanhos de Ícones:
     • 16px: Ícones inline de badges, status pequenos e tags.
     • 20px: Ícones de inputs de formulário, botões secundários e listas.
     • 24px: Ícones de navegação (Tabs, Drawer) e botões de ação principais.
     • 32px: Ícones de destaque de tela e avatares de status.
   - Cores de ícones devem acompanhar rigorosamente o tema semântico.

4. Espaçamentos, Grid e Touch Targets (Escala 8pt):
   - Espaçamentos: 4px (xs), 8px (sm), 12px (md-sm), 16px (md), 24px (lg), 32px (xl).
   - Arredondamento (Border Radius):
     • 8px: Campos de entrada (inputs) e badges pequenos.
     • 12px: Cards de conteúdo e botões principais.
     • 16px: Modais, painéis inferiores (Bottom Sheets).
     • 999px: Tags em formato de pílula (pills) e avatares circulares.
   - Área de Toque: Mínimo de 44x44px em todos os botões, links e elementos clicáveis para ótima usabilidade em celulares.

=== REGRAS RÍGIDAS ANTI-SLOP (CÓDIGO, UI E TEXTO) ===
1. Anti-Slop de Código:
   - NUNCA crie comentários óbvios narrando o que a linha seguinte faz.
   - NUNCA use variáveis ou estados genéricos (como data, result, item, res, temp, processedData). Use nomes semânticos e contextuais (como caronasDisponiveis, filtroCampusSelecionado, passageiroAtual).
   - NUNCA adicione blocos try/catch ou checagens defensivas vazias sem utilidade real.
   - NUNCA crie componentes duplicados; reutilize os componentes compartilhados em `src/components/`.

2. Anti-Slop de UI e Estilização:
   - NUNCA insira linhas horizontais divisórias repetitivas entre cada bloco de texto.
   - NUNCA use gradientes artificiais ou cartões com sombras pesadas e cores saturadas. O visual deve ser limpo, sóbrio e moderno.
   - NUNCA coloque ícones aleatórios sem função (como estrelas, foguetes ou faíscas decorativas soltas).
   - Empty states devem ser objetivos, acolhedores e com botão claro de ação.

3. Anti-Slop de Copy e Redação:
   - O texto da interface deve ser direto, profissional e conciso.
   - NUNCA use chavões típicos de IA (como "solução completa", "mergulhar fundo", "no cenário atual", "alavancar", "experiência única", "de ponta a ponta", "robusto", "game changer", "sem esforço").
   - NUNCA insira travessões ou emojis excessivos nos textos do sistema.

=== REGRAS DE AUTORIA E GIT ===
- NUNCA inclua linhas de co-autoria de IA (como 'Co-authored-by: Claude', 'Co-authored-by: Copilot', 'Cursor', etc.) em commits, pull requests ou documentação.
- Toda autoria pertence exclusivamente ao membro desenvolvedor responsável pela tarefa.
```

---

## 3. Prompts Específicos por Tarefa

---

### Tarefas #1 e #2: Setup, Tema Global e Navegação
- **Responsável**: João Pedro Silva de Almeida (`@joaooopedro`)
- **Arquivos**: `App.js`, `src/theme/index.js`, `src/navigation/AppNavigator.js`, `src/navigation/CustomDrawerContent.js`, `src/navigation/TabNavigator.js`

#### Prompt para a IA:
```text
[Inclua o Prompt Mestre de Sistema acima]

TAREFA: Setup da Estrutura Base, Tema Global e Sistema Completo de Navegação do UniRide.

O QUE FAZER:
1. Configurar `src/theme/index.js` com a paleta de cores completa, tipografia, espaçamentos e raios de borda padronizados.
2. Criar `src/navigation/CustomDrawerContent.js` contendo cabeçalho personalizado com avatar do universitário, nome, curso ("Ciência da Computação - UniAcademia"), badge "Aluno Verificado", itens de menu estilizados com ícones Feather/Ionicons e rodapé com versão e logout.
3. Criar `src/navigation/TabNavigator.js` com Bottom Tabs contendo as abas principais:
   - "Explorar / Feed" (Ícone Carona/Map)
   - "Oferecer" (Ícone Adicionar Rota)
   - "Minhas Viagens" (Ícone Calendário/Bilhete)
   - "Avisos / Chat" (Ícone Mensagens)
   - "Perfil" (Ícone Usuário)
4. Criar `src/navigation/AppNavigator.js` unificando Drawer + Bottom Tabs + Stack Navigator para telas de fluxo interno (Detalhes da Carona, Avaliações e Segurança).
5. Garantir que o `App.js` envolva a aplicação no `ThemeProvider` do Styled Components, `SafeAreaProvider` e `CaronasProvider`.
```

---

### Tarefa #3: [Tela 1] Feed de Caronas e Filtros de Busca
- **Responsável**: Caio Castilho Soranço (`@CaioCastilho`)
- **Issue GitHub**: [#3](https://github.com/joaooopedro/uniride-mobile/issues/3)
- **Arquivos**: `src/screens/TelaFeedCaronas.js`, `src/components/CardCarona.js`, `src/components/FiltrosBusca.js`

#### Prompt para a IA:
```text
[Inclua o Prompt Mestre de Sistema acima]

TAREFA: Implementar a Tela 1 - Feed de Caronas Disponíveis e Filtros de Busca do UniRide.

O QUE FAZER:
1. Criar `src/screens/TelaFeedCaronas.js` com Styled Components.
2. Implementar barra de busca de bairros/rotas com debounce e limpeza rápida.
3. Implementar carrossel horizontal de filtros rápidos:
   - Filtro por Campus de Destino: "Todos", "Campus Academia (Centro)", "Campus Estrela Sul".
   - Filtro por Turno: "Manhã", "Noite".
   - Filtro de Vagas: "Com vagas disponíveis".
4. Criar componente modular `src/components/CardCarona.js`:
   - Cabeçalho do Card: Foto/Avatar do motorista, nome, nota em estrelas (ex: 4.9 ★) e badge "Aluno Verificado".
   - Corpo do Card: Bairro de Origem -> Campus de Destino, Horário de Saída, Modelo do Carro (ex: "Onix Prata - ABC-1234").
   - Rodapé do Card: Contador de vagas com tags coloridas (ex: "2 vagas restantes"), valor de rateio do combustível (ex: "R$ 6,00") e botão estilizado "Ver Detalhes".
5. Integrar com `useCaronas()` do contexto para permitir busca dinâmica na lista de caronas.
6. Adicionar estado vazio estilizado (Empty State) para quando nenhuma carona for encontrada na busca.
```

---

### Tarefa #4: [Tela 2] Detalhes da Carona e Solicitação de Reserva
- **Responsável**: Caio Castilho Soranço (`@CaioCastilho`)
- **Issue GitHub**: [#4](https://github.com/joaooopedro/uniride-mobile/issues/4)
- **Arquivos**: `src/screens/TelaDetalhesCarona.js`, `src/components/ListaPassageiros.js`, `src/components/ModalConfirmacao.js`

#### Prompt para a IA:
```text
[Inclua o Prompt Mestre de Sistema acima]

TAREFA: Implementar a Tela 2 - Detalhes Completos da Carona e Solicitação de Reserva do UniRide.

O QUE FAZER:
1. Criar `src/screens/TelaDetalhesCarona.js` recebendo o ID ou objeto da carona via parâmetros de rota (`route.params`).
2. Seção de Rota e Horário:
   - Ponto de Encontro exato (ex: "Praça do São Mateus - em frente à Igreja").
   - Destino (ex: "UniAcademia - Portaria Principal Campus Estrela Sul").
   - Horário de saída previsto e tolerância de espera (ex: "Saída 18:30 | Tolerância: 5 min").
3. Seção do Motorista e Veículo:
   - Foto ampliada, nome completo, curso ("Engenharia de Software - 6º Período"), telefone de emergência mascarado.
   - Detalhes do carro (Marca, Modelo, Cor, Placa) e comodidades (Ar-condicionado, Música, Porta-malas livre).
4. Seção de Passageiros Confirmados:
   - Lista visual de avatares com nomes dos colegas já no carro e vagas livres restantes.
5. Seção Financeira e PIX:
   - Detalhamento do rateio justo de combustível e chave PIX para acerto pós-viagem.
6. Botão Flutuante de Ação:
   - Botão "Solicitar Vaga nesta Carona" com feedback modal de sucesso e navegação automática para a tela "Minhas Viagens".
```

---

### Tarefa #5: [Tela 3] Formulário de Oferta de Carona (Publicar Rota)
- **Responsável**: Gabriel Caputo Morais (`@gabrielgcm11`)
- **Issue GitHub**: [#5](https://github.com/joaooopedro/uniride-mobile/issues/5)
- **Arquivos**: `src/screens/TelaOferecerCarona.js`, `src/components/SeletorDias.js`, `src/components/CampoEntrada.js`

#### Prompt para a IA:
```text
[Inclua o Prompt Mestre de Sistema acima]

TAREFA: Implementar a Tela 3 - Formulário de Oferta e Publicação de Caronas do UniRide.

O QUE FAZER:
1. Criar `src/screens/TelaOferecerCarona.js` com Styled Components e formulário validado.
2. Campos do Formulário:
   - Bairro e Ponto de Embarque (ex: "Alto dos Passos - Posto Shell").
   - Campus de Destino (Picker/Seletor entre Campus Academia Centro e Campus Estrela Sul).
   - Horário de Saída da Ida e Horário de Retorno da Volta.
   - Seletor múltiplo de dias da semana recorrentes (Seg, Ter, Qua, Qui, Sex).
   - Número de vagas disponíveis no veículo (seletor numérico de 1 a 4).
   - Contribuição sugerida por passageiro (com calculadora de rateio automático baseado em distância).
   - Observações e Regras do Carro (ex: "Sem fumo", "Aceita mochila no colo").
3. Validação em tempo real com mensagens de erro amigáveis caso campos fiquem vazios.
4. Botão "Publicar Rota de Carona":
   - Ao submeter, chamar a função `adicionarCarona(...)` do `CaronasContext`, exibir alerta de sucesso e redirecionar para o feed de caronas.
```

---

### Tarefa #6: [Tela 4] Minhas Viagens e Gestão de Reservas
- **Responsável**: Gabriel Caputo Morais (`@gabrielgcm11`)
- **Issue GitHub**: [#6](https://github.com/joaooopedro/uniride-mobile/issues/6)
- **Arquivos**: `src/screens/TelaMinhasViagens.js`, `src/components/CardViagemAtiva.js`, `src/components/AbaAlternancia.js`

#### Prompt para a IA:
```text
[Inclua o Prompt Mestre de Sistema acima]

TAREFA: Implementar a Tela 4 - Minhas Viagens e Gestão de Reservas do UniRide.

O QUE FAZER:
1. Criar `src/screens/TelaMinhasViagens.js` com sistema de abas alternáveis:
   - Aba 1: "Como Passageiro" (Caronas em que o aluno reservou vaga).
   - Aba 2: "Como Motorista" (Caronas que o aluno está oferecendo).
2. Para cada carona listada, renderizar status com badges coloridos:
   - 🟢 `Confirmada` | 🟡 `Aguardando Saída` | 🔵 `Em Andamento` | ⚪ `Concluída`
3. Ações rápidas em cada card:
   - Botão "Abrir Chat / Ponto de Encontro" (navega para a Central de Avisos).
   - Botão "Cancelar Reserva / Cancelar Rota" (com confirmação de segurança e atualização no contexto).
   - Botão "Avaliar Viagem" (para viagens já concluídas).
4. Interface rica com suporte a "Puxe para atualizar" (RefreshControl) e Empty State com convite para buscar ou oferecer carona.
```

---

### Tarefa #7: [Tela 5] Avaliações, Selos de Confiança e Segurança Comunitária
- **Responsável**: Nicolas Isaac Pinto de Jesus (`@Nipdj14`)
- **Issue GitHub**: [#7](https://github.com/joaooopedro/uniride-mobile/issues/7)
- **Arquivos**: `src/screens/TelaAvaliacoesSeguranca.js`, `src/components/CardAvaliacao.js`, `src/components/SeloConfianca.js`

#### Prompt para a IA:
```text
[Inclua o Prompt Mestre de Sistema acima]

TAREFA: Implementar a Tela 5 - Avaliações, Selos de Confiança e Segurança Comunitária do UniRide.

O QUE FAZER:
1. Criar `src/screens/TelaAvaliacoesSeguranca.js` com Styled Components.
2. Painel de Reputação Geral do Usuário:
   - Média de estrelas (ex: 4.9 / 5.0) baseada em dezenas de viagens.
   - Distribuição de notas (barras de progresso de 5 a 1 estrela).
3. Grid de Selos e Conquistas Acadêmicas:
   - 🎓 *Aluno Verificado UniAcademia* (Matrícula e e-mail institucional checados).
   - ⏱️ *Motorista Pontual* (98% de partidas no horário exato).
   - 🛡️ *Embaixador da Segurança* (+30 caronas com nota máxima).
   - 🌿 *Eco Carona* (+200kg de CO₂ evitados).
4. Feed de Depoimentos e Avaliações Recentes:
   - Cards com foto do colega, curso, data da carona, nota e comentário sobre pontualidade, direção e conversa.
5. Seção de Diretrizes de Segurança Comunitária:
   - Accordion expansível com dicas: pontos de encontro iluminados, confirmação de matrícula antes de embarcar e canais de suporte do campus.
```

---

### Tarefa #8: [Tela 6] Perfil Universitário e Preferências de Viagem
- **Responsável**: Nicolas Isaac Pinto de Jesus (`@Nipdj14`)
- **Issue GitHub**: [#8](https://github.com/joaooopedro/uniride-mobile/issues/8)
- **Arquivos**: `src/screens/TelaPerfilUniversitario.js`, `src/components/CardEstatistica.js`, `src/components/TagPreferencia.js`

#### Prompt para a IA:
```text
[Inclua o Prompt Mestre de Sistema acima]

TAREFA: Implementar a Tela 6 - Perfil Universitário e Preferências de Viagem do UniRide.

O QUE FAZER:
1. Criar `src/screens/TelaPerfilUniversitario.js` com Styled Components.
2. Cabeçalho de Perfil:
   - Foto do universitário com borda de status, nome completo, curso, período e número de matrícula institucional.
   - Botão "Editar Perfil".
3. Cards de Métricas e Impacto:
   - Viagens Realizadas (ex: 42)
   - Caronas Oferecidas (ex: 18)
   - Economia Estimada em Combustível (ex: R$ 340,00)
   - Horas Economizadas no Trânsito (ex: 14h)
4. Configurações de Veículo e PIX:
   - Card com dados do carro cadastrado (Modelo, Cor, Placa) e Chave PIX cadastrada para recebimento.
5. Preferências de Convivência na Carona (Chips interativos):
   - 🎵 Estilo Musical (Sertanejo, Rock, Pop, Silêncio)
   - ❄️ Climatização (Ar-condicionado ligado / Vidro aberto)
   - 💬 Conversa (Adora bater papo / Prefere focar nos estudos)
6. Botão de Logout e Termos de Uso Acadêmico.
```

---

### Tarefa #9: [Tela 7] Central de Avisos Rápidos e Chat do Ponto de Encontro
- **Responsável**: Jonathan Delmonte Pereira (`@JonathanDelmonte`)
- **Issue GitHub**: [#9](https://github.com/joaooopedro/uniride-mobile/issues/9)
- **Arquivos**: `src/screens/TelaCentralAvisosChat.js`, `src/components/BotaoStatusRapido.js`, `src/components/BalaoMensagem.js`

#### Prompt para a IA:
```text
[Inclua o Prompt Mestre de Sistema acima]

TAREFA: Implementar a Tela 7 - Central de Avisos Rápidos e Chat do Ponto de Encontro do UniRide.

O QUE FAZER:
1. Criar `src/screens/TelaCentralAvisosChat.js` com Styled Components.
2. Barra Superior com Resumo da Viagem Ativa:
   - Trajeto ("São Mateus -> Campus Estrela Sul"), nome do motorista e horário.
3. Botões de Aviso com 1 Toque (Quick Status Badges):
   - 📍 "Cheguei no ponto de encontro"
   - ⏳ "Atraso de 5 minutos, aguardem"
   - 🚗 "Carro parado no semáforo"
   - 🎓 "Já cheguei na portaria da faculdade"
   - Ao tocar, o status é publicado instantaneamente no feed da viagem com timestamp.
4. Histórico de Mensagens / Chat da Carona:
   - Balões diferenciados de envio e recebimento com foto do autor, nome e hora.
   - Campo de texto inferior para digitação de mensagens livres com botão de envio.
5. Notificações Operacionais e do Campus:
   - Aba de avisos gerais (ex: "Trânsito intenso na Av. Presidente Itamar Franco", "Entrada do Estrela Sul liberada").
```

---

### Tarefa #10: Camada de Mock Data e Context API de Estado Local
- **Responsável**: Jonathan Delmonte Pereira (`@JonathanDelmonte`)
- **Issue GitHub**: [#10](https://github.com/joaooopedro/uniride-mobile/issues/10)
- **Arquivos**: `src/context/CaronasContext.js`, `src/services/mockData.js`

#### Prompt para a IA:
```text
[Inclua o Prompt Mestre de Sistema acima]

TAREFA: Implementar a Camada de Dados Mockados Realistas e o Contexto Global do UniRide.

O QUE FAZER:
1. Criar `src/services/mockData.js` contendo:
   - 8+ caronas pré-cadastradas com dados realistas da UniAcademia e Juiz de Fora (origens: Cascatinha, São Mateus, Alto dos Passos, Granbery, Santa Luzia, Benfica, Centro, Manoel Honório; destinos: Campus Academia Centro e Campus Estrela Sul).
   - Dados completos de motoristas com nomes, fotos Unsplash/avatares, cursos, notas (4.8 a 5.0), vagas restantes, valor de rateio e lista de passageiros.
   - Lista inicial de viagens ativas do usuário e histórico de mensagens de chat.
2. Criar `src/context/CaronasContext.js` com React Context e Hook `useCaronas()` exportando:
   - `caronas`: lista de caronas disponíveis.
   - `minhasViagens`: lista de caronas reservadas ou criadas pelo usuário logado.
   - `mensagensChat`: mensagens ativas do chat de carona.
   - `usuarioLogado`: perfil do universitário atual.
   - `adicionarCarona(novaCarona)`: adiciona nova rota ao feed e às viagens do motorista.
   - `solicitarVaga(caronaId)`: decrementa vaga, adiciona usuário na lista de passageiros e registra em `minhasViagens`.
   - `cancelarReserva(caronaId)`: desfaz a reserva e restaura vaga.
   - `enviarMensagem(texto, tipo)`: adiciona mensagem ou aviso rápido ao chat.
   - `filtrarCaronas({ campus, turno, busca, apenasComVagas })`: helper de filtro.
```

---

### Tarefas #11 e #12: README Técnico, Roteiro de Apresentação e QA Integrado
- **Responsáveis**: João Pedro (`@joaooopedro`) e Todos os 5 integrantes
- **Issues GitHub**: [#11](https://github.com/joaooopedro/uniride-mobile/issues/11) e [#12](https://github.com/joaooopedro/uniride-mobile/issues/12)

#### O que fazer:
1. **README Técnico**: Detalhar comandos de inicialização, requisitos do Expo SDK, mapeamento visual de todas as 7 telas e tabela de co-autoria dos 5 membros.
2. **Roteiro de Apresentação (3 a 5 minutos)**:
   - *Abertura (30s)*: Apresentação da equipe e o problema do transporte universitário em JF.
   - *Demonstração das Telas (2m30s)*: Navegação fluida no Expo Go mostrando busca no Feed, detalhes da rota, oferta de carona, gestão em Minhas Viagens, avisos rápidos de embarque, avaliações comunitárias e perfil universitário.
   - *Conclusão (30s)*: Arquitetura modular com Styled Components e preparação para a Etapa 2.
3. **QA & Validação**:
   - Rodar em múltiplos aparelhos celulares via Expo Go.
   - Verificar espaçamento em telas pequenas e grandes.
   - Garantir 0 erros no console do Metro Bundler.

---

---

## 4. Registro Continuo de Pontos de Apresentacao por Tarefa

Para facilitar a divisao das falas e garantir que ninguem esqueca os detalhes tecnicos na hora de apresentar para o professor Romualdo, cada integrante deve anotar os pontos-chave da sua funcionalidade assim que terminar o desenvolvimento.

O documento completo com a distribuicao de tempo, falas e matriz de registro esta disponivel em:
* Arquivo local: `ROTEIRO-E-PONTOS-APRESENTACAO.md`
* Google Docs da equipe: [UniRide - Guia e Roteiro de Apresentacao](https://docs.google.com/document/d/1bVCXcsRPYZIrjkzKM-Gv3gFNJQoXjUoq_Phd2nvFgyI/edit?usp=drivesdk)

### O que anotar ao finalizar a sua branch:
1. **3 pontos principais que voce implementou**: recursos da tela, botoes, filtros ou componentes.
2. **Passo a passo de demonstracao no celular**: onde clicar no Expo Go para mostrar sua parte funcionando.
3. **Uma decisao tecnica de destaque**: estilizacao com Styled Components, validacao de inputs, passagem de parametros ou uso do contexto.

---

## 5. Tabela de Distribuicao de Tarefas e Falas da Equipe

| Integrante | Modulo e Telas | Tempo na Apresentacao | Status Dev | Pontos Anotados |
| :--- | :--- | :---: | :---: | :---: |
| **Joao Pedro** | Setup, Tema e Navegacao (#1, #2, #11) | 2 min | [ ] | [ ] |
| **Caio Castilho** | Feed de Caronas e Detalhes (#3, #4) | 2 min | [ ] | [ ] |
| **Gabriel Caputo** | Oferecer Carona e Minhas Viagens (#5, #6) | 2 min | [ ] | [ ] |
| **Nicolas Isaac** | Avaliacoes, Selos e Perfil (#7, #8) | 2 min | [ ] | [ ] |
| **Jonathan Delmonte** | Central de Avisos, Chat e Mock Data (#9, #10) | 2 min | [ ] | [ ] |

