import {
  CAMPI,
  formatarData,
  formatarMoeda,
  paraData,
  soDigitos,
  sugerirRateio,
  validarCnhValidade,
  validarPlaca,
  validarSaida,
  validarTextoObrigatorio,
} from "../../utils";

const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const dois = (n) => String(n).padStart(2, "0");
const HORA_INVALIDA = "Horário inválido. Use hh:mm entre 00:00 e 23:59.";
const semVazios = (erros) => Object.fromEntries(Object.entries(erros).filter(([, msg]) => msg));

export const VALOR_MAXIMO = 5000;
export const PASSO_VALOR = 50;

export function mascararData(texto) {
  const d = soDigitos(texto).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function mascararHora(texto) {
  const d = soDigitos(texto).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}:${d.slice(2)}` : d;
}

// new Date(2026, 1, 31) vira 3 de março; a conferência de volta descarta datas que não existem.
export function lerDataBr(texto = "") {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(texto).trim());
  if (!partes) return null;
  const [dia, mes, ano] = partes.slice(1).map(Number);
  const data = new Date(ano, mes - 1, dia);
  return data.getDate() === dia && data.getMonth() === mes - 1 ? data : null;
}

export function dataParaIso(data) {
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}`;
}

export function isoParaBr(iso = "") {
  const [ano, mes, dia] = String(iso).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "";
}

export function validarVeiculo(dados) {
  const lugares = Number(dados.lugares);
  const validade = lerDataBr(dados.cnhValidade);
  return semVazios({
    marca: validarTextoObrigatorio(dados.marca, "Marca", 30),
    modelo: validarTextoObrigatorio(dados.modelo, "Modelo", 30),
    cor: validarTextoObrigatorio(dados.cor, "Cor", 20),
    placa: validarPlaca(dados.placa),
    lugares: Number.isInteger(lugares) && lugares >= 1 && lugares <= 6 ? null : "Escolha de 1 a 6 lugares.",
    cnhValidade:
      dados.cnhValidade && !validade ? "Data inválida. Use dd/mm/aaaa." : validarCnhValidade(validade),
    chavePix: validarTextoObrigatorio(dados.chavePix, "Chave PIX", 80),
  });
}

export function montarSaida(diaIso, hora) {
  const dia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(diaIso || "");
  const horario = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hora || "");
  if (!dia || !horario) return null;
  return new Date(Number(dia[1]), Number(dia[2]) - 1, Number(dia[3]), Number(horario[1]), Number(horario[2]));
}

// Espelha validarOferta do serviço para o botão Publicar só acender quando o envio vai passar.
export function errosOferta(form, lugaresVeiculo) {
  const limite = Number(lugaresVeiculo) || 6;
  const vagas = Number(form.vagas);
  const valor = Number(form.valorCentavos);
  const marcado = typeof form.lat === "number" && typeof form.lng === "number";
  return semVazios({
    bairro: validarTextoObrigatorio(form.bairro, "Bairro", 60),
    ponto: validarTextoObrigatorio(form.ponto || form.rua, "Ponto de encontro", 120),
    mapa: marcado ? null : "Marque o ponto de encontro no mapa.",
    campus: CAMPI.some((campus) => campus.nome === form.campusDestino) ? null : "Escolha o campus de destino.",
    saida:
      String(form.hora || "").length === 5 && !montarSaida(form.dia, form.hora)
        ? HORA_INVALIDA
        : validarSaida(montarSaida(form.dia, form.hora)),
    vagas: Number.isInteger(vagas) && vagas >= 1 && vagas <= limite ? null : `Escolha de 1 a ${limite} vagas.`,
    valor:
      Number.isInteger(valor) && valor >= 0 && valor <= VALOR_MAXIMO
        ? null
        : `Valor deve ficar entre ${formatarMoeda(0)} e ${formatarMoeda(VALOR_MAXIMO)}.`,
  });
}

export function ofertaVazia(lugares, hoje = dataParaIso(new Date())) {
  return {
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    ponto: "",
    lat: null,
    lng: null,
    geoEndereco: "",
    campusDestino: "",
    dia: hoje,
    hora: "",
    vagas: lugares,
    valorCentavos: sugerirRateio(0, lugares),
    rota: null,
  };
}

// O rascunho fica no aparelho; o uid impede que o endereço de uma conta apareça para outra.
export function restaurarRascunho(salvo, lugares, hoje, uid) {
  if (!salvo || !uid || salvo.uid !== uid) return null;
  const { salvoEm, uid: _dono, ...campos } = salvo;
  const oferta = { ...ofertaVazia(lugares, hoje), ...campos };
  const vagas = Number(oferta.vagas);
  return {
    ...oferta,
    dia: oferta.dia >= hoje ? oferta.dia : hoje,
    vagas: Number.isInteger(vagas) && vagas >= 1 ? Math.min(vagas, lugares) : lugares,
  };
}

export function chaveDaRota(lat, lng, campus) {
  return typeof lat === "number" && typeof lng === "number" && campus ? `${lat},${lng}>${campus.id}` : null;
}

export function mesclarEndereco(anterior, endereco) {
  return { ...anterior, rua: endereco?.rua || anterior.rua, bairro: endereco?.bairro || anterior.bairro };
}

// Aceite que falha por vaga não tem como ser refeito: o pedido é recusado para o passageiro saber.
export function resultadoResposta(acao, mensagemErro) {
  return acao === "aceitar" && ehErroSemVaga(mensagemErro) ? "recusar_sem_vaga" : "erro";
}

export function ajustarValor(centavos, delta) {
  return Math.min(VALOR_MAXIMO, Math.max(0, (Number(centavos) || 0) + delta));
}

export function proximosDias(agora = new Date(), quantidade = 14) {
  return Array.from({ length: quantidade }, (_, i) => {
    const dia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + i);
    const rotulo = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : `${DIAS[dia.getDay()]} ${formatarData(dia)}`;
    return { iso: dataParaIso(dia), rotulo };
  });
}

const ATIVAS = ["aberta", "em_andamento"];
const tempo = (rota) => paraData(rota.saidaEm)?.getTime() || 0;

export function separarRotas(rotas = []) {
  return {
    proximas: rotas.filter((r) => ATIVAS.includes(r.status)).sort((a, b) => tempo(a) - tempo(b)),
    anteriores: rotas.filter((r) => !ATIVAS.includes(r.status)).sort((a, b) => tempo(b) - tempo(a)),
  };
}

const ACOES = {
  aberta: ["iniciar", "cancelar", "conversa"],
  em_andamento: ["concluir", "conversa"],
};

export function acoesDaRota(status) {
  return ACOES[status] || [];
}

const ROTULOS = {
  aberta: "Aguardando Saída",
  em_andamento: "Em Andamento",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export function rotuloStatus(status) {
  return ROTULOS[status] || status;
}

export function ehErroSemVaga(mensagem = "") {
  // Textos de reservas.aceitar/solicitar no Firebase e no modo demonstração.
  return /já lotou|não há mais vagas/i.test(mensagem);
}

export function saudacao(agora = new Date()) {
  const hora = agora.getHours();
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
}

export function primeiroNome(nome = "") {
  return String(nome).trim().split(/\s+/)[0] || "";
}
