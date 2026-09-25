# UniRide: Roteiro e Registro Continuo de Pontos para Apresentacao

Registro estruturado para organizacao de tarefas, distribuicao de falas e anotacao continua de pontos de destaque a medida que cada tela e funcionalidade for sendo desenvolvida no aplicativo UniRide (Desenvolvimento Movel 2026.2 - UniAcademia).

---

## 1. Visao Geral da Apresentacao.

* **Disciplina**: Desenvolvimento Movel
* **Professor**: Romualdo Monteiro de Resende Costa
* **Datas Previstas**: 06 e 07 de outubro de 2026
* **Formato**: Oral presencial ou video gravado demonstrando o app em execucao no Expo Go
* **Tempo Total Sugerido**: 8 a 10 minutos (aproximadamente 1 minuto e meio a 2 minutos por integrante)

---

## 2. Distribuicao de Falas e Responsabilidades por Integrante

| Integrante | Papel / Modulo | Telas e Componentes | Tempo Estimado |
| :--- | :--- | :--- | :--- |
| **Joao Pedro** | Abertura, Arquitetura e Navegacao | Setup, ThemeProvider, Drawer Navigator, Bottom Tabs e Stack | 2 min |
| **Caio Castilho** | Feed de Caronas e Detalhes da Rota | Tela 1 (FeedCaronas, Filtros) e Tela 2 (DetalhesCarona, Reserva) | 2 min |
| **Gabriel Caputo** | Oferta de Caronas e Gestao de Viagens | Tela 3 (OferecerCarona) e Tela 4 (MinhasViagens) | 2 min |
| **Nicolas Isaac** | Avaliacoes, Seguranca e Perfil | Tela 5 (AvaliacoesSeguranca) e Tela 6 (PerfilUniversitario) | 2 min |
| **Jonathan Delmonte** | Central de Avisos, Estado Global e Encerramento | Tela 7 (CentralAvisosChat), CaronasContext e Mocks | 2 min |

---

## 3. Matriz Viva de Registro de Pontos por Tarefa

A medida que cada integrante conclui sua tarefa, preenche ou valida os pontos tecnicos e o roteiro de demonstracao abaixo.

### Bloco 1: Setup, Identidade Visual e Navegacao
* **Responsavel**: Joao Pedro
* **Tarefas Relacionadas**: #1 (Setup e Tema) e #2 (Estrutura de Navegacao)
* **O que foi feito**:
  * Configuracao do tema centralizado com tokens semanticos de cores, tipografia e espacamentos 8pt.
  * Estrutura de navegacao hibrida combinando Drawer lateral para menus institucionais e Bottom Tabs para fluxo diario.
  * Integracao do CaronasProvider envolvendo toda a aplicacao.
* **Pontos Chave para Falar na Apresentacao**:
  * Explicar a escolha do Styled Components para manter estilizacao desacoplada e componentizada.
  * Demonstrar como o Drawer Navigator contem as informacoes do aluno e badges de status.
  * Mostrar a transicao fluida entre abas inferiores e telas internas em pilha.
* **Roteiro de Demonstracao no Expo Go**:
  * Abrir o aplicativo no celular.
  * Abrir o menu Drawer lateral arrastando o dedo da esquerda para a direita.
  * Alternar entre as cinco abas inferiores demonstrando responsividade.

---

### Bloco 2: Descoberta de Rotas e Solicitacao de Vaga
* **Responsavel**: Caio Castilho
* **Tarefas Relacionadas**: #3 (Tela 1: Feed) e #4 (Tela 2: Detalhes da Carona)
* **O que foi feito**:
  * Tela de feed com barra de busca por bairro e carrossel de filtros por campus e turno.
  * Cards modulares com avatar do motorista, horario, veiculo, valor de rateio e vagas restantes.
  * Tela detalhada de rota com ponto de encontro exato, lista de colegas no carro e modal de confirmacao de reserva.
* **Pontos Chave para Falar na Apresentacao**:
  * Destacar a facilidade de busca filtrando especificamente pelo campus de destino (Centro ou Estrela Sul).
  * Mostrar o calculo visual do rateio justo de combustivel.
  * Explicar como a solicitacao atualiza as vagas disponiveis em tempo real no contexto.
* **Roteiro de Demonstracao no Expo Go**:
  * Digitar um bairro no campo de busca (exemplo: Sao Mateus).
  * Clicar no filtro de campus para filtrar apenas caronas para o Campus Estrela Sul.
  * Clicar em Ver Detalhes em um dos cards.
  * Clicar no botao Solicitar Vaga e mostrar o modal de confirmacao.

---

### Bloco 3: Publicacao de Rotas e Acompanhamento de Viagens
* **Responsavel**: Gabriel Caputo
* **Tarefas Relacionadas**: #5 (Tela 3: Oferecer Carona) e #6 (Tela 4: Minhas Viagens)
* **O que foi feito**:
  * Formulario completo de publicacao de carona com selecao de dias da semana recorrentes e horario de saida/retorno.
  * Calculadora de sugestao de rateio baseada no percurso.
  * Painel Minhas Viagens com abas alternaveis entre visualizacao Como Passageiro e Como Motorista.
* **Pontos Chave para Falar na Apresentacao**:
  * Explicar o cuidado na validacao dos campos para impedir rotas sem horario ou sem ponto de encontro definido.
  * Apresentar o sistema de status visual por badges (Confirmada, Aguardando Saida, Em Andamento, Concluida).
  * Demonstrar o fluxo de cancelamento seguro com aviso de confirmacao.
* **Roteiro de Demonstracao no Expo Go**:
  * Acessar a aba Oferecer na barra inferior.
  * Preencher uma nova rota (exemplo: Cascatinha para Campus Academia, 2 vagas, R$ 5,00).
  * Clicar em Publicar Rota e verificar o redirecionamento automatico para o feed.
  * Acessar a aba Minhas Viagens e alternar entre as abas de Passageiro e Motorista.

---

### Bloco 4: Seguranca, Reputacao e Perfil Institucional
* **Responsavel**: Nicolas Isaac
* **Tarefas Relacionadas**: #7 (Tela 5: Avaliacoes e Seguranca) e #8 (Tela 6: Perfil do Aluno)
* **O que foi feito**:
  * Tela de reputacao com media de estrelas, comentarios de caronas anteriores e criterios de seguranca.
  * Tela de perfil academico com dados do estudante, curso, matricula institucional e historico acumulado de caronas.
  * Botoes de acao para edicao de preferencias de viagem (ar-condicionado, musica, bagagem).
* **Pontos Chave para Falar na Apresentacao**:
  * Ressaltar o foco em confianca universitaria, garantindo que apenas alunos verificados participam das viagens.
  * Explicar a exibicao do historico de avaliacoes como fator determinante para a seguranca da comunidade academica.
  * Mostrar as configuracoes de preferencias e dados veiculares cadastrados.
* **Roteiro de Demonstracao no Expo Go**:
  * Abrir a tela de Perfil a partir do menu Drawer ou da barra inferior.
  * Navegar ate a tela de Avaliacoes e Seguranca.
  * Mostrar a listagem de feedbacks e a pontuacao consolidada do usuario.

---

### Bloco 5: Comunicacao, Camada de Dados e Fechamento
* **Responsavel**: Jonathan Delmonte
* **Tarefas Relacionadas**: #9 (Tela 7: Central de Avisos e Chat), #10 (Mock Data) e #11 (CaronasContext)
* **O que foi feito**:
  * Tela de Central de Avisos com cards de mensagens sobre pontos de encontro, alteracoes de transito e confirmacoes.
  * Arquitetura de dados em memoria no CaronasContext com funcoes de consulta, reserva, criacao e cancelamento.
  * Mock realista com nomes de bairros e polos de Juiz de Fora e dados compativeis com a rotina do UniAcademia.
* **Pontos Chave para Falar na Apresentacao**:
  * Detalhar como o gerenciamento de estado global permite que todas as telas operem de forma sincronizada sem backend externo.
  * Explicar a utilidade da Central de Avisos para avisos operacionais entre motoristas e passageiros.
  * Fazer o resumo final destacando o cumprimento integral dos requisitos do trabalho (componentizacao, navegacao, temas e qualidade).
* **Roteiro de Demonstracao no Expo Go**:
  * Abrir a aba de Avisos e exibir as conversas ativas.
  * Demonstrar que a criacao de uma carona ou reserva reflete imediatamente nos contadores de aviso e no historico.
  * Concluir a apresentacao convidando o professor para perguntas.

---

## 4. Template para o Membro Anotar Pontos ao Finalizar a Task

Copie e cole este bloco ao abrir o Pull Request ou enviar a mensagem de conclusao da sua tarefa:

```markdown
### Registro de Pontos da Tarefa [Numero da Task]
* **Nome do Integrante**: [Seu Nome]
* **Tela ou Modulo**: [Nome da Tela / Componentes criados]
* **3 Principais Pontos Desenvolvidos**:
  1. [Ponto 1]
  2. [Ponto 2]
  3. [Ponto 3]
* **Como Demonstrar no Expo Go (Passo a Passo)**:
  1. [Passo 1]
  2. [Passo 2]
* **Decisao Tecnica Relevante**: [Explicar brevemente uma escolha de codigo, componente ou layout]
```

---

## 5. Checklist de Verificacao Antes da Apresentacao

1. Todos os 5 integrantes testaram o app em seus respectivos celulares via Expo Go.
2. Nao ha erros vermelhos ou avisos amarelos bloqueantes no terminal durante a execucao.
3. Todas as 7 telas abrem corretamente atraves da navegacao por Drawer e Tabs.
4. Cada membro ensaiou sua fala respeitando a janela de 2 minutos.
5. Os links do repositorio GitHub e do Google Docs estao disponiveis para consulta do professor.
