# UniRide - Carona Universitária Solidária

Aplicativo móvel desenvolvido em **React Native / Expo** para a disciplina de **Desenvolvimento Móvel (2026-2)** no **UniAcademia**.

---

## Informações do Projeto
- **Instituição**: Centro Universitário Academia (UniAcademia)
- **Disciplina**: Desenvolvimento Móvel
- **Professor**: Romualdo Monteiro de Resende Costa
- **Etapa 1 (Telas e Componentes)**: Entrega em 08/10/2026 (20 Pontos) | Apresentações em 06 e 07/10/2026

### Integrantes do Grupo
1. **João Pedro Silva de Almeida** - `tracknotrash@gmail.com` - GitHub: [@joaooopedro](https://github.com/joaooopedro)
2. **Gabriel Caputo Morais** - `bielcaputomorais@gmail.com` - GitHub: [@gabrielgcm11](https://github.com/gabrielgcm11)
3. **Caio Castilho Soranço** - `caiocastilho65@gmail.com` - GitHub: [@CaioCastilho](https://github.com/CaioCastilho)
4. **Nicolas Isaac Pinto de Jesus** - `nicolasisaac7@gmail.com` - GitHub: [@Nipdj14](https://github.com/Nipdj14)
5. **Jonathan Delmonte Pereira** - `jonathanpdelmon@gmail.com` - GitHub: [@JonathanDelmonte](https://github.com/JonathanDelmonte)

---

## Repositório e Gestão
- **Repositório GitHub**: [https://github.com/joaooopedro/uniride-mobile](https://github.com/joaooopedro/uniride-mobile)
- **Quadro Kanban (GitHub Projects)**: [https://github.com/users/joaooopedro/projects/5](https://github.com/users/joaooopedro/projects/5)
- **Guia de Desenvolvimento & Prompts para IA**: [GUIA-MEMBROS-PROMPTS.md](./GUIA-MEMBROS-PROMPTS.md) (Tutorial completo passo a passo, prompt mestre e prompt individual para cada tarefa/membro da equipe)

---

## Proposta e Escopo

### Problema
Estudantes universitários enfrentam dificuldades diárias de locomoção em Juiz de Fora, dependendo de linhas de ônibus escassas em horários noturnos ou de transporte individual com alto custo de combustível.

### Solução
O **UniRide** conecta universitários que fazem rotas semelhantes até os campi da UniAcademia (Campus Academia / Centro e Campus Estrela Sul), permitindo combinar caronas solidárias, dividir custos de combustível de maneira justa e criar uma rede segura entre alunos verificados da mesma instituição.

---

## Telas Implementadas (Etapa 1 - Mínimo de 6 telas)

1. **Buscar Caronas / Feed Principal**:
   - Barra de busca com filtros dinâmicos por campus de destino, bairro de origem e turno.
   - Cards com foto do motorista, veículo, horário de partida, vagas disponíveis e custo de rateio.
2. **Detalhes da Carona e Reserva**:
   - Trajeto detalhado do ponto de encontro até o campus.
   - Informações do motorista, lista de passageiros confirmados, regras do veículo e botão de confirmação.
3. **Oferecer Carona (Publicar Rota)**:
   - Formulário de cadastro de rota com horários de ida/volta, dias da semana, veículo, vagas e rateio de gasolina.
4. **Minhas Viagens / Reservas**:
   - Gestão de caronas ativas e histórico dividido em abas ("Como Passageiro" e "Como Motorista").
5. **Avaliações e Segurança Comunitária**:
   - Feed de avaliações entre estudantes, selo de verificação acadêmica e diretrizes de segurança para pontos de encontro.
6. **Perfil Universitário**:
   - Dados acadêmicos do aluno (curso, turno), veículo cadastrado, chave PIX para rateio e preferências.
7. **Central de Avisos e Chat de Ponto de Encontro**:
   - Avisos em tempo real ("Motorista no local", "Estou no portão") e comunicação rápida entre o grupo da viagem.

---

## Divisão de Tarefas na Equipe (GitHub Projects)

| Issue | Tarefa | Responsável | Status |
| :--- | :--- | :--- | :--- |
| [#1](https://github.com/joaooopedro/uniride-mobile/issues/1) | Setup inicial do projeto Expo, Navegação e Tema Global | João Pedro (`@joaooopedro`) | Todo |
| [#2](https://github.com/joaooopedro/uniride-mobile/issues/2) | Estruturação da Navegação Drawer, Bottom Tabs e Stack | João Pedro (`@joaooopedro`) | Todo |
| [#3](https://github.com/joaooopedro/uniride-mobile/issues/3) | [Tela 1] Feed de Caronas e Filtros de Busca | Caio Castilho (`@CaioCastilho`) | Todo |
| [#4](https://github.com/joaooopedro/uniride-mobile/issues/4) | [Tela 2] Detalhes da Carona e Solicitação de Vaga | Caio Castilho (`@CaioCastilho`) | Todo |
| [#5](https://github.com/joaooopedro/uniride-mobile/issues/5) | [Tela 3] Formulário de Oferta de Carona (Publicar Rota) | Gabriel Caputo (`@gabrielgcm11`) | Todo |
| [#6](https://github.com/joaooopedro/uniride-mobile/issues/6) | [Tela 4] Minhas Viagens e Gestão de Reservas | Gabriel Caputo (`@gabrielgcm11`) | Todo |
| [#7](https://github.com/joaooopedro/uniride-mobile/issues/7) | [Tela 5] Avaliações, Selos de Confiança e Segurança | Nicolas Isaac (`@Nipdj14`) | Todo |
| [#8](https://github.com/joaooopedro/uniride-mobile/issues/8) | [Tela 6] Perfil Universitário e Preferências de Viagem | Nicolas Isaac (`@Nipdj14`) | Todo |
| [#9](https://github.com/joaooopedro/uniride-mobile/issues/9) | [Tela 7] Central de Avisos e Chat do Ponto de Encontro | Jonathan Delmonte (`@JonathanDelmonte`) | Todo |
| [#10](https://github.com/joaooopedro/uniride-mobile/issues/10) | Camada de Dados Mockados e Contexto de Estado Local | Jonathan Delmonte (`@JonathanDelmonte`) | Todo |
| [#11](https://github.com/joaooopedro/uniride-mobile/issues/11) | README Técnico e Roteiro de Apresentação | João Pedro (`@joaooopedro`) | Todo |
| [#12](https://github.com/joaooopedro/uniride-mobile/issues/12) | Revisão, QA no Expo Go e Testes de Responsividade | Todos os 5 integrantes | Todo |
