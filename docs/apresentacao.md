# Apresentação do UniRide (18 e 19/11)

Apresentação presencial, sem slides. Cada integrante fala da própria parte, na ordem abaixo, e a demonstração roda ao vivo nos celulares do grupo, cada um com a própria conta.

Contas da demonstração (senha `uniride2026`):
- Motoristas: `jonathan@uniride.app`, `gabriel@uniride.app` e `joao.motorista@uniride.app`
- Passageiros: `caio@uniride.app`, `nicolas@uniride.app` e `joao.passageiro@uniride.app`

Antes de começar: `node scripts/limpar.js && node scripts/seed.js && node scripts/cenario.js`. O seed cria as contas e as caronas dos próximos dias; o cenário acrescenta viagens passadas avaliadas, reservas aceitas com conversa e um pedido aguardando resposta. Nicolas começa sem reserva para pedir vaga ao vivo.

## Como o app evoluiu

| Momento | O que o app tinha |
|---|---|
| Etapa 1 (07/10) | Telas e navegação completas (Drawer, abas e pilha), com dados de exemplo fixos no código. Nada era salvo. |
| Núcleo (04 a 06/11) | Firebase de verdade: conta com e-mail e Google, banco Firestore com regras, reservas com controle de vagas, APIs públicas (CEP, rota, clima, feriados), mapa, notificações e testes automáticos. As telas passaram a ler dados reais por um contrato único. |
| Telas finais (06 a 16/11) | Cada integrante refez as telas da sua parte em cima do banco real. Teste do fluxo completo no simulador do iPhone com o Maestro e correções. |

## Tópicos por integrante

### João Pedro Silva de Almeida
- Etapa 1: criação do projeto Expo, tema e navegação por Drawer, abas e pilha (issues 1 e 2); README e roteiro (11).
- Núcleo: Firebase, autenticação com e-mail e Google, navegação separada para passageiro e motorista (22 e 23).
- Banco: repositórios no Firestore, reserva com transação para não vender a mesma vaga duas vezes, regras de segurança, seed (24).
- Serviços: CEP, Nominatim, rota no OSRM, feriados, clima, mapa OpenStreetMap e 57 testes automáticos (25).
- Notificações locais de pedido, aceite e mensagem (26); build e instalação nos iPhones e APK (27).
- Conversas da carona com avisos rápidos e Minhas Reservas, completando a issue 32.
- Revisão final: teste do fluxo completo no simulador e correções (28).

### Caio Soranço Castilho
- Etapa 1: feed de caronas com filtros e detalhes da carona (issues 3 e 4).
- Final: telas de acesso (entrada, login, cadastro, recuperar senha, verificar e-mail) e busca de caronas por bairro, campus, turno e preço (issue 29).

### Gabriel Caputo Morais
- Etapa 1: formulário de oferta de carona e Minhas Viagens (issues 5 e 6).
- Final: telas do motorista (cadastro do veículo, oferecer carona com CEP, mapa e valor sugerido, minhas rotas com iniciar e concluir, pedidos para aceitar ou recusar), com regras testadas (issue 30).

### Nicolas Isaac Pinto de Jesus
- Etapa 1: avaliações e selos de confiança, perfil universitário (issues 7 e 8).
- Final: detalhes da carona com mapa e clima, avaliação depois da viagem e perfil (issue 31).

### Jonathan Delmonte
- Etapa 1: central de avisos rápidos com chat e camada de dados de exemplo (issues 9 e 10).
- Etapa 1 também: refino da interface e da navegação (barra de abas, menu lateral, tema) e as diretrizes do DESIGN.md.
- Final: componentes de estado (carregando, vazio, erro e aviso sem conexão), usados por todas as telas (issue 32).

## Roteiro da demonstração

| Passo | Quem | Conta | O que faz |
|---|---|---|---|
| 1 | João | `joao.motorista@` | Abertura e arquitetura; mostra o pedido do Caio aguardando |
| 2 | Caio | `caio@` | Entrada e busca; Reservas com a vaga aceita e o pedido aguardando |
| 3 | João | `joao.motorista@` | Aceita o pedido; o Caio recebe o aviso |
| 4 | Nicolas | `nicolas@` | Detalhes da carona do Gabriel, selos e avaliações; pede a vaga; perfil |
| 5 | Gabriel | `gabriel@` | Aceita o Nicolas; Oferecer carona com CEP; inicia a viagem |
| 6 | Jonathan | `jonathan@` (Android) | Conversa já pronta, aviso rápido "Cheguei no ponto de encontro"; modo avião; estado vazio |
| 7 | Gabriel | `gabriel@` | Conclui a viagem |
| 8 | Nicolas | `nicolas@` | Avalia o Gabriel |
| 9 | João | `joao.motorista@` | Transação, regras, teste com o Maestro; perguntas |

Reserva: `joao.passageiro@` em qualquer celular que sobrar.
