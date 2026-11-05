# Contrato entre telas e dados

As telas só usam os hooks e funções abaixo. Nenhuma tela importa `firebase` nem `src/services/*` diretamente (exceto `src/services/api` e `src/services/localStore`, listados aqui). Quem implementa o que está por baixo é o João (issues #22 a #26).

Modo demonstração: crie um `.env` com `EXPO_PUBLIC_MODO_DEMO=1` e o app roda sem internet, com dados de exemplo em memória e a mesma interface. Útil para montar tela. Sem o `.env`, usa o Firebase de verdade.

## `useAuth()` — `src/context/AuthContext`

| Campo | Tipo |
|---|---|
| `usuario` | `{ uid, email, emailVerificado }` ou `null` |
| `perfil` | objeto abaixo ou `null` |
| `modo` | `'passageiro' \| 'motorista' \| null` |
| `carregando`, `emailVerificado`, `googleDisponivel` | `bool` |

Funções (todas `async`, lançam `Error` com `message` em português pronta para mostrar):
`entrar({ email, senha })`, `entrarComGoogle()`, `cadastrar({ nome, email, senha, matricula, curso, periodo, telefone })`, `completarPerfil({ nome, matricula, curso, periodo, telefone })`, `sair()`, `redefinirSenha(email)`, `reenviarVerificacao()`, `atualizarVerificacao()` (devolve `bool`), `definirModo(modo)`, `salvarPerfil(campos)`, `salvarMotorista({ veiculo: { marca, modelo, cor, placa }, lugares, cnhValidade: 'AAAA-MM-DD', chavePix })`.

`perfil`: `{ uid, nome, email, matricula, curso, periodo, telefone, fotoBase64, ehMotorista, motorista: { veiculo, lugares, cnhValidade, chavePix }, notaMotorista: { media, total }, notaPassageiro: { media, total } }`

## `useCaronas()` — `src/context/CaronasContext`

- `caronasAbertas` (sem as do próprio usuário), `carregandoCaronas`, `erroCaronas`, `recarregar()`
- Passageiro: `minhasReservas` = `[{ reserva, carona }]`
- Motorista: `minhasRotas`, `solicitacoesPendentes` = `[{ reserva, carona, passageiro }]`
- `oferecerCarona({ origem, campusDestino, destino, saidaEm, vagasTotais, valorCentavos, rota })` devolve o id
- `cancelarCarona(caronaId)`, `iniciarViagem(caronaId)`, `concluirViagem(caronaId)`
- `solicitarReserva(caronaId)`, `cancelarReserva(caronaId)`, `aceitarReserva(reservaId)`, `recusarReserva(reservaId)`
- `avaliar({ reservaId, avaliadoId, nota, comentario })`

`useCarona(caronaId)` → `{ carona, reservas, minhaReserva, souMotorista, contato, carregando, erro }`. `contato` = `{ telefone, chavePix }` do motorista, e só vem preenchido para quem participa da carona (motorista ou passageiro aceito). Para os outros é `null`.

`carona`: `{ id, motoristaId, motorista: { nome, nota, curso, fotoBase64, veiculo }, origem: { cep, rua, numero, bairro, ponto, lat, lng }, campusDestino, destino: { lat, lng }, saidaEm: Date, vagasTotais, vagasRestantes, valorCentavos, rota: { distanciaKm, duracaoMin, linha: [[lat, lng]] }, passageirosAceitos: [{ uid, nome }], participantes: [uid], status: 'aberta' | 'em_andamento' | 'concluida' | 'cancelada' }`

`reserva`: `{ id, caronaId, passageiroId, motoristaId, passageiro: { nome, curso, nota, fotoBase64 }, status: 'solicitada' | 'aceita' | 'recusada' | 'cancelada' | 'concluida', avaliadaPeloPassageiro, avaliadaPeloMotorista, criadoEm }`

## `useAvisos()` — `src/context/AvisosContext`

- `conversas` = `[{ carona, ultimaMensagem, naoLidas }]`, `naoLidasTotal`
- `enviarMensagem(caronaId, texto, tipo = 'texto' | 'aviso_rapido')`, `marcarComoLido(caronaId)`, `AVISOS_RAPIDOS` (`[{ id, texto, icone }]`, ícone do Feather)
- `useMensagens(caronaId)` → `{ mensagens, carregando, erro }`; mensagem `{ id, autorId, autorNome, texto, tipo, criadoEm }`

## Serviços web — `src/services/api`

`buscarCep(cep)`, `geocodificar(endereco)`, `calcularRota(origem, destino)`, `feriadoNaData(date)`, `previsaoNaHora(date)`. Formatos nas issues. Todos lançam `Error` em português quando falham ou passam de 8 s.

## Armazenamento local — `src/services/localStore`

`lerRascunho()`, `salvarRascunho(dados)`, `descartarRascunho()`, `lerFiltros()`, `salvarFiltros(filtros)`.

## Utilitários — `src/utils`

`formatarMoeda`, `formatarData`, `formatarHora`, `formatarDataHora`, `formatarDistancia`, `formatarDuracao`, `formatarNota`, `iniciais`, `paraData`, `turnoDaHora`, `mascararCep`, `mascararTelefone`, `mascararPlaca`, `soDigitos`, `sugerirRateio(distanciaKm, lugares)`, `CAMPI`, `campusPorNome`, `validarEmail`, `validarSenha`, `validarNome`, `validarMatricula`, `validarTelefone`, `validarCep`, `validarPlaca`, `validarCnhValidade`, `validarSaida`, `validarTextoObrigatorio`.

## Componentes — `src/components`

`MapaRota`, `EstadoTela`, `FaixaSemConexao`, `EstadoViagem`, `MotionPressable`, `AppHeader`, `CardCarona`, `TagPreferencia`, `Wordmark`.

## Rotas

- Acesso: `Entrada`, `Login { modo }`, `Cadastro { modo, completar? }`, `EsqueciSenha`, `VerificarEmail`, `CadastroMotorista`
- Abas do passageiro: `Buscar`, `Reservas`, `Conversas`, `Perfil`
- Abas do motorista: `Rotas`, `Oferecer`, `Solicitacoes`, `Conversas`, `Perfil`
- Por cima das abas: `DetalhesCarona { caronaId }`, `Conversa { caronaId }`, `AvaliarViagem { reservaId }`, `Avaliacoes { uid? }`

Para ligar a sua tela, troque a linha dela em `src/navigation/telas.js`.
