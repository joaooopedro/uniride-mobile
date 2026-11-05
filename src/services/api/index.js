// Serviços web consumidos pelas telas. Implementação real na issue #25;
// até lá devolvem respostas de exemplo com o mesmo formato.
const espera = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function buscarCep(cep) {
  await espera();
  return { cep, rua: "Rua Halfeld", bairro: "Centro", cidade: "Juiz de Fora", uf: "MG" };
}

export async function geocodificar() {
  await espera();
  return { lat: -21.7612, lng: -43.3496 };
}

export async function calcularRota(origem, destino) {
  await espera();
  return { distanciaKm: 4.2, duracaoMin: 12, linha: [[origem.lat, origem.lng], [destino.lat, destino.lng]] };
}

export async function feriadoNaData() {
  await espera(150);
  return null;
}

export async function previsaoNaHora() {
  await espera();
  return { temperatura: 22, chanceChuva: 30, descricao: "Parcialmente nublado", icone: "cloud" };
}
