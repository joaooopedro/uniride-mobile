const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

const doisDigitos = (valor) => String(valor).padStart(2, "0");

export function paraData(valor) {
  if (!valor) return null;
  if (valor instanceof Date) return valor;
  if (typeof valor.toDate === "function") return valor.toDate();
  if (typeof valor.seconds === "number") return new Date(valor.seconds * 1000);
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

export function formatarMoeda(centavos) {
  const valor = Math.round(Number(centavos) || 0);
  const reais = Math.floor(Math.abs(valor) / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const resto = doisDigitos(Math.abs(valor) % 100);
  return `${valor < 0 ? "-" : ""}R$ ${reais},${resto}`;
}

export function formatarHora(valor) {
  const data = paraData(valor);
  if (!data) return "";
  return `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

export function formatarData(valor) {
  const data = paraData(valor);
  if (!data) return "";
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}`;
}

export function formatarDataHora(valor) {
  const data = paraData(valor);
  if (!data) return "";
  return `${DIAS[data.getDay()]}, ${formatarData(data)} às ${formatarHora(data)}`;
}

export function formatarDistancia(km) {
  if (km == null) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace(".", ",")} km`;
}

export function formatarDuracao(minutos) {
  if (minutos == null) return "";
  const total = Math.max(1, Math.round(minutos));
  if (total < 60) return `${total} min`;
  const horas = Math.floor(total / 60);
  const resto = total % 60;
  return resto ? `${horas} h ${resto} min` : `${horas} h`;
}

export function formatarNota(media) {
  if (!media) return "Novo";
  return media.toFixed(1).replace(".", ",");
}

export function iniciais(nome = "") {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return `${primeira}${ultima}`.toUpperCase();
}

export function soDigitos(texto = "") {
  return String(texto).replace(/\D/g, "");
}

export function mascararCep(texto) {
  const digitos = soDigitos(texto).slice(0, 8);
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
}

export function mascararTelefone(texto) {
  const d = soDigitos(texto).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function mascararPlaca(texto) {
  const limpo = String(texto).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  return /^[A-Z]{3}\d{4}$/.test(limpo) ? `${limpo.slice(0, 3)}-${limpo.slice(3)}` : limpo;
}

export function turnoDaHora(valor) {
  const data = paraData(valor);
  if (!data) return null;
  const hora = data.getHours();
  if (hora < 12) return "Manhã";
  if (hora < 18) return "Tarde";
  return "Noite";
}
