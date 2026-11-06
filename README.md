# UniRide

Aplicativo de carona solidária entre alunos do UniAcademia, em Juiz de Fora. O motorista oferece lugares no trajeto até o campus, o passageiro pede vaga, o motorista aceita, os dois conversam pelo chat da carona e se avaliam depois da viagem. O valor é um rateio do combustível pago por PIX direto ao motorista.

Trabalho da disciplina Desenvolvimento Móvel (2026-2), professor Romualdo Monteiro de Resende Costa.

## Stack

- React Native 0.88 com Expo SDK 58, JavaScript. Todo o app é React Native, sem código nativo próprio.
- React Navigation (pilha, abas e menu lateral) e Styled Components.
- Firebase JS SDK: Authentication (e-mail e senha, Google) e Cloud Firestore (`southamerica-east1`).
- AsyncStorage para dados do aparelho.
- `react-native-webview` com Leaflet 1.9.4 e tiles do OpenStreetMap para o mapa.
- `expo-notifications` para avisos locais.
- Jest com `jest-expo` para os testes.

## Arquitetura

```
App.js                      provedores (tema, auth, caronas, avisos) e notificações
src/
  config/                   firebase.js (app, auth persistida, firestore), modo demo, regras de cadastro
  context/                  AuthContext, CaronasContext, AvisosContext: a única porta das telas para os dados
  services/
    index.js                escolhe o repositório: Firestore ou modo demo
    firebase/               auth, usuarios, caronas, reservas, mensagens, avaliacoes, conversao, erros
    demo/                   mesma interface em memória, para montar tela sem internet
    api/                    http.js e os serviços web (CEP, geocodificação, rota, feriados, clima)
    notificacoes/           eventos que viram notificação local e o hook que dispara
    localStore.js           AsyncStorage: modo, rascunho, filtros, leituras do chat, eventos notificados
  components/               MapaRota, EstadoTela, FaixaSemConexao, CardCarona e outros
  navigation/               RootNavigator, abas por papel, telas.js (onde cada tela é ligada)
  screens/                  telas do grupo
  utils/                    formato, validação, rateio, campi (funções puras, testadas)
scripts/                    seed.js, limpar.js
firestore.rules             regras de segurança
firestore.indexes.json      índices das consultas
```

Regra do projeto: tela usa os hooks dos contextos (`useAuth`, `useCaronas`, `useCarona`, `useAvisos`, `useMensagens`) e, quando precisa, `src/services/api` e `src/services/localStore`. Nenhuma tela importa `firebase`. A interface completa está em [`CONTRATO.md`](CONTRATO.md).

## Modelo de dados (Firestore)

| Coleção | Conteúdo | Quem lê / escreve |
|---|---|---|
| `usuarios/{uid}` | nome, curso, período, foto, `ehMotorista`, `motorista` (veículo, lugares, CNH), `notaMotorista` e `notaPassageiro` (`{ soma, total }`) | alunos verificados leem; só o dono edita, e nunca as próprias notas |
| `usuarios/{uid}/privado/dados` | e-mail, matrícula, telefone, chave PIX | só o dono |
| `caronas/{id}` | motorista (resumo), origem com coordenadas, campus, `saidaEm`, vagas, `valorCentavos`, rota (`distanciaKm`, `duracaoMin`, linha), `participantes`, `passageirosAceitos`, `status` | alunos verificados leem; só o motorista cria e altera; o passageiro aceito só consegue se remover |
| `caronas/{id}/privado/contato` | telefone e PIX do motorista | só participantes |
| `caronas/{id}/mensagens/{id}` | autor, texto (até 500), tipo (`texto` ou `aviso_rapido`) | só participantes |
| `reservas/{caronaId_passageiroId}` | carona, passageiro, motorista, `status` (`solicitada`, `aceita`, `recusada`, `cancelada`, `concluida`), marcas de avaliação | passageiro e motorista da reserva |
| `avaliacoes/{reservaId_avaliadorId}` | nota 1 a 5, comentário, papel avaliado | alunos verificados leem; só participante de reserva concluída cria, uma vez |

Regras de negócio que rodam no banco:
- Aceitar reserva é uma transação: vaga, participantes e status da reserva mudam juntos. Dois aceites ao mesmo tempo não passam do número de vagas.
- Cancelar reserva aceita devolve a vaga na mesma transação.
- Cancelar, iniciar e concluir carona atualizam as reservas no mesmo lote.
- Avaliar grava a avaliação e soma a nota no perfil do avaliado na mesma transação. A regra de `usuarios` só aceita mudança de nota de outra pessoa se a avaliação correspondente estiver sendo criada junto (`getAfter`/`existsAfter`).
- Valor em centavos e datas como `Timestamp`; carona com saída no passado some da busca.

## Serviços web

Todos públicos e sem chave, todos por `src/services/api/http.js` (tempo limite de 8 s, uma nova tentativa em falha de rede, erro em português).

| Função | Serviço |
|---|---|
| `buscarCep(cep)` | BrasilAPI CEP v2, com ViaCEP de reserva |
| `geocodificar(endereco)` | Nominatim (OpenStreetMap), 1 pedido por segundo, cache |
| `calcularRota(origem, destino)` | OSRM público |
| `feriadoNaData(data)` | BrasilAPI feriados, cache por ano no aparelho |
| `previsaoNaHora(data)` | Open-Meteo, previsão horária no fuso de São Paulo |

## Como rodar

```bash
npm ci
npx expo start
```

Abra no Expo Go (login com Google só funciona no app instalado) ou instale o app pelo passo a passo em [`docs/instalacao.md`](docs/instalacao.md).

### Modo demonstração

Para montar tela sem internet e sem conta: crie um `.env` com `EXPO_PUBLIC_MODO_DEMO=1` e rode `npx expo start -c`. Os dados ficam em memória, com a mesma interface do Firestore.

### Dados de exemplo (seed)

Precisa do login do Firebase no computador (`npx firebase-tools login`, conta com acesso ao projeto `uniride-uniacademia`).

```bash
node scripts/limpar.js   # apaga as contas de exemplo e tudo que elas criaram
node scripts/seed.js     # cria os logins de teste, mais 2 motoristas de exemplo, e 6 caronas nos próximos dias em Juiz de Fora
```

Logins de teste: `motorista@uniride.app` (com veículo e caronas) e `passageiro@uniride.app`, com e-mail verificado e senha `uniride2026` (troque com `SEED_SENHA=... node scripts/seed.js`). As caronas vencem em poucos dias: rode os dois comandos de novo no dia da apresentação.

### Regras do banco

```bash
npx firebase-tools deploy --only firestore --project uniride-uniacademia
```

## Testes

```bash
npm test            # funções puras, parsers das APIs com respostas gravadas, regras de notificação
npm run test:apis   # chama as cinco APIs de verdade (precisa de internet)
```

As regras do Firestore foram testadas contra o banco real com três usuários verificados (motorista, dois passageiros): cada regra no caso permitido e no proibido, aceites concorrentes com uma vaga, cancelamento devolvendo vaga, iniciar, concluir, avaliar e avaliar de novo.

## Instalação nos celulares

Passo a passo em [`docs/instalacao.md`](docs/instalacao.md): iPhone pelo Xcode com conta gratuita (o app vence em 7 dias, reinstalar em 17/11) e APK para Android.

## Manual de uso

[`docs/manual`](docs/manual/README.md), escrito por quem fez cada tela.

## Equipe

- João Pedro: dados, regras, serviços web, mapa, notificações, build
- Caio Castilho: acesso e busca
- Gabriel Caputo: telas do motorista
- Nicolas Isaac: detalhes, avaliação e perfil
- Jonathan Delmonte: chat, reservas e acabamento visual
