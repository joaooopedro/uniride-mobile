import { criarDadosIniciais, USUARIO_DEMO } from "./dados";
import { mediaAvaliacao } from "../../utils/rateio";

// Implementação em memória com a mesma interface dos repositórios do Firestore.
let banco = criarDadosIniciais();
let sessao = null;
const ouvintes = new Set();
const espera = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

function observar(calcular, callback) {
  const ouvinte = () => callback(calcular());
  ouvintes.add(ouvinte);
  setTimeout(ouvinte, 300);
  return () => ouvintes.delete(ouvinte);
}

function erro(mensagem) {
  return new Error(mensagem);
}

const exigirSessao = () => {
  if (!sessao) throw erro("Entre na sua conta para continuar.");
  return sessao.uid;
};

const resumoPassageiro = (perfil) => ({
  nome: perfil.nome,
  curso: `${perfil.curso}, ${perfil.periodo}º período`,
  nota: mediaAvaliacao(perfil.notaPassageiro).media,
  fotoBase64: perfil.fotoBase64 || null,
});

export const auth = {
  observarSessao(callback) {
    const ouvinte = () => callback(sessao);
    ouvintes.add(ouvinte);
    setTimeout(ouvinte, 200);
    return () => ouvintes.delete(ouvinte);
  },
  async entrar() {
    await espera();
    sessao = { ...USUARIO_DEMO };
    avisar();
    return sessao;
  },
  async cadastrar(dados) {
    await espera();
    sessao = { ...USUARIO_DEMO, email: dados.email };
    banco.usuarios[sessao.uid] = { ...banco.usuarios[sessao.uid], ...dados, senha: undefined };
    avisar();
    return sessao;
  },
  async completarPerfil(dados) {
    await espera();
    banco.usuarios[sessao.uid] = { ...banco.usuarios[sessao.uid], ...dados };
    avisar();
  },
  async sair() {
    sessao = null;
    banco = criarDadosIniciais();
    avisar();
  },
  async redefinirSenha() {
    await espera();
  },
  async reenviarVerificacao() {
    await espera();
  },
  async atualizarVerificacao() {
    return true;
  },
  googleDisponivel: false,
  async entrarComGoogle() {
    throw erro("Login com Google indisponível no modo demonstração.");
  },
};

export const usuarios = {
  observarPerfil(uid, callback) {
    return observar(() => banco.usuarios[uid] || null, callback);
  },
  async salvarPerfil(uid, campos) {
    await espera();
    banco.usuarios[uid] = { ...banco.usuarios[uid], ...campos };
    avisar();
  },
  async salvarMotorista(uid, motorista) {
    await espera();
    banco.usuarios[uid] = { ...banco.usuarios[uid], ehMotorista: true, motorista };
    avisar();
  },
};

const ordenarPorSaida = (lista) => lista.sort((a, b) => a.saidaEm - b.saidaEm);

export const caronas = {
  observarAbertas(callback) {
    return observar(
      () =>
        ordenarPorSaida(
          Object.values(banco.caronas).filter(
            (carona) => carona.status === "aberta" && carona.saidaEm > new Date(),
          ),
        ),
      callback,
    );
  },
  observarCarona(caronaId, callback) {
    return observar(() => banco.caronas[caronaId] || null, callback);
  },
  observarDoMotorista(uid, callback) {
    return observar(
      () => ordenarPorSaida(Object.values(banco.caronas).filter((c) => c.motoristaId === uid)),
      callback,
    );
  },
  observarDoParticipante(uid, callback) {
    return observar(
      () => Object.values(banco.caronas).filter((c) => c.participantes.includes(uid)),
      callback,
    );
  },
  observarContato(caronaId, callback, aoErrar) {
    return observar(() => {
      const carona = banco.caronas[caronaId];
      if (!carona || !carona.participantes.includes(sessao?.uid)) return null;
      const motorista = banco.usuarios[carona.motoristaId];
      return { telefone: motorista.telefone || "(32) 99999-0000", chavePix: motorista.motorista?.chavePix || "" };
    }, callback, aoErrar);
  },
  async criar(perfil, dados) {
    await espera();
    const id = `demo-${Date.now()}`;
    banco.caronas[id] = {
      ...dados,
      id,
      motoristaId: perfil.uid,
      motorista: {
        nome: perfil.nome,
        curso: `${perfil.curso}, ${perfil.periodo}º período`,
        nota: mediaAvaliacao(perfil.notaMotorista).media,
        fotoBase64: perfil.fotoBase64 || null,
        veiculo: perfil.motorista.veiculo,
      },
      vagasRestantes: dados.vagasTotais,
      participantes: [perfil.uid],
      passageirosAceitos: [],
      status: "aberta",
      criadoEm: new Date(),
    };
    avisar();
    return id;
  },
  async cancelar(caronaId) {
    await espera();
    banco.caronas[caronaId].status = "cancelada";
    Object.values(banco.reservas)
      .filter((r) => r.caronaId === caronaId && ["solicitada", "aceita"].includes(r.status))
      .forEach((r) => {
        r.status = "cancelada";
      });
    avisar();
  },
  async iniciar(caronaId) {
    await espera();
    banco.caronas[caronaId].status = "em_andamento";
    avisar();
  },
  async concluir(caronaId) {
    await espera();
    banco.caronas[caronaId].status = "concluida";
    Object.values(banco.reservas)
      .filter((r) => r.caronaId === caronaId && r.status === "aceita")
      .forEach((r) => {
        r.status = "concluida";
      });
    avisar();
  },
};

export const reservas = {
  observarDoPassageiro(uid, callback) {
    return observar(() => Object.values(banco.reservas).filter((r) => r.passageiroId === uid), callback);
  },
  observarDoMotorista(uid, callback) {
    return observar(() => Object.values(banco.reservas).filter((r) => r.motoristaId === uid), callback);
  },
  observarDaCaronaComoMotorista(caronaId, uid, callback) {
    return observar(
      () => Object.values(banco.reservas).filter((r) => r.caronaId === caronaId && r.motoristaId === uid),
      callback,
    );
  },
  observarReserva(reservaId, callback) {
    return observar(() => banco.reservas[reservaId] || null, callback);
  },
  async solicitar(carona, perfil) {
    exigirSessao();
    await espera();
    const id = `${carona.id}_${perfil.uid}`;
    const existente = banco.reservas[id];
    if (existente && ["solicitada", "aceita"].includes(existente.status))
      throw erro("Você já pediu vaga nesta carona.");
    if (carona.motoristaId === perfil.uid) throw erro("Você não pode reservar a própria carona.");
    if (banco.caronas[carona.id].vagasRestantes < 1) throw erro("Esta carona já lotou.");
    banco.reservas[id] = {
      id,
      caronaId: carona.id,
      passageiroId: perfil.uid,
      motoristaId: carona.motoristaId,
      passageiro: resumoPassageiro(perfil),
      status: "solicitada",
      avaliadaPeloPassageiro: false,
      avaliadaPeloMotorista: false,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
    avisar();
    return id;
  },
  async aceitar(reservaId) {
    await espera();
    const reserva = banco.reservas[reservaId];
    const carona = banco.caronas[reserva.caronaId];
    if (reserva.status !== "solicitada") throw erro("Esta solicitação já foi respondida.");
    if (carona.vagasRestantes < 1) throw erro("Não há mais vagas nesta carona.");
    carona.vagasRestantes -= 1;
    carona.participantes = [...carona.participantes, reserva.passageiroId];
    carona.passageirosAceitos = [...carona.passageirosAceitos, { uid: reserva.passageiroId, nome: reserva.passageiro.nome }];
    reserva.status = "aceita";
    reserva.atualizadoEm = new Date();
    avisar();
  },
  async recusar(reservaId) {
    await espera();
    banco.reservas[reservaId].status = "recusada";
    avisar();
  },
  async cancelar(reservaId) {
    await espera();
    const reserva = banco.reservas[reservaId];
    const carona = banco.caronas[reserva.caronaId];
    if (reserva.status === "aceita") {
      carona.vagasRestantes += 1;
      carona.participantes = carona.participantes.filter((uid) => uid !== reserva.passageiroId);
      carona.passageirosAceitos = carona.passageirosAceitos.filter((p) => p.uid !== reserva.passageiroId);
    }
    reserva.status = "cancelada";
    avisar();
  },
};

export const mensagens = {
  observar(caronaId, callback) {
    return observar(() => [...(banco.mensagens[caronaId] || [])], callback);
  },
  async enviar(caronaId, perfil, texto, tipo = "texto") {
    const lista = banco.mensagens[caronaId] || [];
    lista.push({ id: `m-${Date.now()}`, autorId: perfil.uid, autorNome: perfil.nome, texto, tipo, criadoEm: new Date() });
    banco.mensagens[caronaId] = lista;
    avisar();
  },
};

export const avaliacoes = {
  async avaliar({ reservaId, avaliador, avaliadoId, nota, comentario }) {
    await espera();
    const reserva = banco.reservas[reservaId];
    const comoPassageiro = avaliador.uid === reserva.passageiroId;
    const campo = comoPassageiro ? "avaliadaPeloPassageiro" : "avaliadaPeloMotorista";
    if (reserva[campo]) throw erro("Você já avaliou esta viagem.");
    reserva[campo] = true;
    const alvo = banco.usuarios[avaliadoId];
    const chave = comoPassageiro ? "notaMotorista" : "notaPassageiro";
    alvo[chave] = { soma: (alvo[chave]?.soma || 0) + nota, total: (alvo[chave]?.total || 0) + 1 };
    banco.avaliacoes[`${reservaId}_${avaliador.uid}`] = { reservaId, avaliadorId: avaliador.uid, avaliadoId, nota, comentario };
    avisar();
  },
  observarRecebidas(uid, callback) {
    return observar(() => Object.values(banco.avaliacoes).filter((a) => a.avaliadoId === uid), callback);
  },
};
