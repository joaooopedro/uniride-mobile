// Toda chamada externa passa por aqui: tempo limite de 8 s, uma nova tentativa em falha de rede
// e erro com mensagem em português pronta para a tela.
export const TEMPO_LIMITE_MS = 8000;

export class ErroApi extends Error {
  constructor(mensagem, status = 0) {
    super(mensagem);
    this.status = status;
    this.amigavel = true;
  }
}

async function tentar(url, { headers, tempoLimite = TEMPO_LIMITE_MS }) {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), tempoLimite);
  try {
    return await fetch(url, { headers: { Accept: "application/json", ...headers }, signal: controle.signal });
  } finally {
    clearTimeout(relogio);
  }
}

export async function obterJson(url, opcoes = {}) {
  const { servico = "O serviço", naoEncontrado } = opcoes;
  let resposta;
  for (let tentativa = 0; tentativa < 2 && !resposta; tentativa++) {
    try {
      resposta = await tentar(url, opcoes);
    } catch (erro) {
      if (erro.name === "AbortError") throw new ErroApi(`${servico} demorou demais para responder. Tente de novo.`);
      if (tentativa === 1) throw new ErroApi("Sem conexão com a internet. Confira a rede e tente de novo.");
    }
  }
  if (resposta.status === 404 && naoEncontrado) throw new ErroApi(naoEncontrado, 404);
  if (resposta.status === 429) throw new ErroApi(`${servico} recebeu muitos pedidos. Espere um pouco.`, 429);
  if (!resposta.ok) throw new ErroApi(`${servico} está fora do ar agora. Tente mais tarde.`, resposta.status);
  try {
    return await resposta.json();
  } catch {
    throw new ErroApi(`${servico} respondeu algo inesperado.`, resposta.status);
  }
}
