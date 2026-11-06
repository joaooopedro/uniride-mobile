import { obterJson } from "./http";

const NAO_ACHOU = "CEP não encontrado. Confira os números.";
const so8 = (cep) => String(cep || "").replace(/\D/g, "");

export function lerBrasilApi(dados) {
  return { cep: so8(dados.cep), rua: dados.street || "", bairro: dados.neighborhood || "", cidade: dados.city || "", uf: dados.state || "" };
}

export function lerViaCep(dados) {
  if (dados.erro) return null;
  return { cep: so8(dados.cep), rua: dados.logradouro || "", bairro: dados.bairro || "", cidade: dados.localidade || "", uf: dados.uf || "" };
}

// BrasilAPI primeiro; se ela falhar por qualquer motivo que não seja CEP inexistente, tenta o ViaCEP.
export async function buscarCep(cep) {
  const numeros = so8(cep);
  if (numeros.length !== 8) throw new Error("CEP deve ter 8 números.");
  try {
    return lerBrasilApi(await obterJson(`https://brasilapi.com.br/api/cep/v2/${numeros}`, { servico: "A busca de CEP", naoEncontrado: NAO_ACHOU }));
  } catch (erro) {
    if (erro.status === 404) throw erro;
    const reserva = lerViaCep(await obterJson(`https://viacep.com.br/ws/${numeros}/json/`, { servico: "A busca de CEP" }));
    if (!reserva) throw new Error(NAO_ACHOU);
    return reserva;
  }
}
