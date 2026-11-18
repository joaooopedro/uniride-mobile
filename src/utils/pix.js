// Código Pix "copia e cola" (BR Code estático do Banco Central) a partir da chave do motorista.
const campo = (id, valor) => `${id}${String(valor.length).padStart(2, "0")}${valor}`;
const limpar = (texto, max) =>
  String(texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .trim()
    .slice(0, max);

// CRC16-CCITT (polinômio 0x1021, início 0xFFFF), exigido no campo 63.
export function crc16(texto) {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i += 1) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b += 1) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function codigoPix({ chave, nome, cidade = "Juiz de Fora", centavos, identificador = "UNIRIDE" }) {
  if (!chave) return "";
  const conta = campo("00", "br.gov.bcb.pix") + campo("01", String(chave).trim());
  const valor = centavos > 0 ? campo("54", (centavos / 100).toFixed(2)) : "";
  const corpo =
    campo("00", "01") +
    campo("26", conta) +
    campo("52", "0000") +
    campo("53", "986") +
    valor +
    campo("58", "BR") +
    campo("59", limpar(nome, 25) || "MOTORISTA") +
    campo("60", limpar(cidade, 15) || "JUIZ DE FORA") +
    campo("62", campo("05", limpar(identificador, 25).replace(/ /g, "") || "***")) +
    "6304";
  return corpo + crc16(corpo);
}
