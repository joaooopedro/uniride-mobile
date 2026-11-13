import { paraData, soDigitos } from "../../utils";

export const LIMITE_COMENTARIO = 280;

export const ROTULOS_NOTA = { 1: "Ruim", 2: "Regular", 3: "Boa", 4: "Muito boa", 5: "Excelente" };

export const ATALHOS_COMENTARIO = [
  { id: "pontual", texto: "Pontual", icone: "clock" },
  { id: "cuidado", texto: "Dirigiu com cuidado", icone: "shield" },
  { id: "educado", texto: "Educado", icone: "smile" },
  { id: "atrasou", texto: "Atrasou", icone: "alert-circle" },
];

export const STATUS_CARONA = {
  aberta: { icone: "clock", texto: "Aguardando saída", cor: "secondary" },
  em_andamento: { icone: "navigation", texto: "Em andamento", cor: "secondary" },
  concluida: { icone: "check-circle", texto: "Concluída", cor: "textSecondary" },
  cancelada: { icone: "x-circle", texto: "Cancelada", cor: "danger" },
};

export const STATUS_RESERVA = {
  solicitada: { icone: "clock", texto: "Aguardando resposta", cor: "warning" },
  aceita: { icone: "check-circle", texto: "Aceita", cor: "success" },
  recusada: { icone: "x-circle", texto: "Recusada", cor: "danger" },
  cancelada: { icone: "slash", texto: "Cancelada", cor: "textMuted" },
  concluida: { icone: "check", texto: "Concluída", cor: "textSecondary" },
};

// Qual bloco de ação o passageiro vê, conforme a carona e a reserva dele.
export function estadoDoPassageiro(carona, reserva) {
  const status = reserva?.status;
  if (status === "solicitada") return "solicitada";
  if (status === "aceita") return "aceita";
  if (status === "recusada") return "recusada";
  if (status === "concluida") return reserva.avaliadaPeloPassageiro ? "avaliada" : "avaliar";
  if (carona.status === "cancelada") return "cancelada";
  if (carona.status !== "aberta") return "indisponivel";
  return carona.vagasRestantes > 0 ? "solicitar" : "sem_vaga";
}

// "sai em 25 min", "sai em 2 h", "sai amanhã", "já saiu".
export function textoSaida(saidaEm, agora = new Date()) {
  const data = paraData(saidaEm);
  if (!data) return "";
  const minutos = Math.round((data.getTime() - agora.getTime()) / 60000);
  if (minutos < -5) return "já saiu";
  if (minutos <= 1) return "sai agora";
  if (minutos < 60) return `sai em ${minutos} min`;
  if (minutos < 24 * 60) {
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return resto ? `sai em ${horas} h ${resto} min` : `sai em ${horas} h`;
  }
  const dias = Math.round(minutos / (24 * 60));
  return dias === 1 ? "sai amanhã" : `sai em ${dias} dias`;
}

export function enderecoCompleto(origem = {}) {
  const rua = [origem.rua, origem.numero].filter(Boolean).join(", ");
  return [rua, origem.bairro].filter(Boolean).join(" - ");
}

export function urlMapas(lat, lng, os) {
  if (os === "ios") return `maps://?daddr=${lat},${lng}`;
  return `geo:${lat},${lng}?q=${lat},${lng}`;
}

export function urlMapasWeb(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function urlTelefone(telefone) {
  return `tel:${soDigitos(telefone)}`;
}

export function urlWhatsapp(telefone) {
  const digitos = soDigitos(telefone);
  const comPais = digitos.startsWith("55") && digitos.length > 11 ? digitos : `55${digitos}`;
  return `https://wa.me/${comPais}`;
}

export function contarViagens(perfil) {
  if (!perfil) return 0;
  if (Number.isFinite(perfil.viagens)) return perfil.viagens;
  return (perfil.notaMotorista?.total || 0) + (perfil.notaPassageiro?.total || 0);
}

// Selos calculados a partir dos dados do perfil. Os que faltam dizem o que falta.
export function calcularSelos({ emailVerificado, nota, viagens }) {
  const media = nota?.media || 0;
  const total = nota?.total || 0;
  const faltamAvaliacoes = Math.max(0, 5 - total);
  let faltaNota = "";
  if (faltamAvaliacoes) faltaNota = `Faltam ${faltamAvaliacoes} ${faltamAvaliacoes === 1 ? "avaliação" : "avaliações"}`;
  else if (media < 4.5) faltaNota = "Precisa de média 4,5 ou mais";
  const faltamViagens = Math.max(0, 10 - (viagens || 0));
  return [
    {
      id: "verificado",
      titulo: "E-mail verificado",
      icone: "check-circle",
      conquistado: !!emailVerificado,
      falta: "Confirme seu e-mail",
    },
    {
      id: "bem-avaliado",
      titulo: "Motorista bem avaliado",
      icone: "star",
      conquistado: media >= 4.5 && total >= 5,
      falta: faltaNota,
    },
    {
      id: "veterano",
      titulo: "Veterano",
      icone: "award",
      conquistado: (viagens || 0) >= 10,
      falta: `Faltam ${faltamViagens} ${faltamViagens === 1 ? "viagem" : "viagens"}`,
    },
  ];
}

// Distribuição por estrelas: { 1: n, ..., 5: n } -> linhas com percentual da maior barra.
export function barrasDeNotas(distribuicao) {
  if (!distribuicao) return null;
  const valores = [5, 4, 3, 2, 1].map((estrelas) => ({ estrelas, total: Number(distribuicao[estrelas]) || 0 }));
  const soma = valores.reduce((acc, v) => acc + v.total, 0);
  if (!soma) return null;
  return valores.map((v) => ({ ...v, percentual: Math.round((v.total / soma) * 100) }));
}

export function prefixoAtalhos(atalhos = []) {
  const textos = ATALHOS_COMENTARIO.filter((a) => atalhos.includes(a.id)).map((a) => a.texto);
  return textos.length ? `${textos.join(", ")}. ` : "";
}

// Comentário final: elogios marcados + texto livre, sempre dentro do limite.
export function montarComentario(texto = "", atalhos = []) {
  return `${prefixoAtalhos(atalhos)}${String(texto).trim()}`.trim().slice(0, LIMITE_COMENTARIO);
}
