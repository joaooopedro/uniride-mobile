import AsyncStorage from "@react-native-async-storage/async-storage";

// Dados que pertencem ao aparelho, não à conta: ficam só no AsyncStorage.
const CHAVES = {
  modo: "@uniride/modo",
  rascunho: "@uniride/rascunho-oferta",
  filtros: "@uniride/filtros-busca",
  lidas: "@uniride/ultima-leitura",
  eventos: "@uniride/eventos-notificados",
  feriados: (ano) => `@uniride/feriados-${ano}`,
};

async function lerJson(chave, padrao = null) {
  try {
    const valor = await AsyncStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch {
    return padrao;
  }
}

async function gravarJson(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // Falha de armazenamento local não pode derrubar a tela.
  }
}

export const lerModo = () => lerJson(CHAVES.modo);
export const salvarModo = (modo) =>
  modo ? gravarJson(CHAVES.modo, modo) : AsyncStorage.removeItem(CHAVES.modo);

export const lerRascunho = () => lerJson(CHAVES.rascunho);
export const salvarRascunho = (dados) => gravarJson(CHAVES.rascunho, { ...dados, salvoEm: Date.now() });
export const descartarRascunho = () => AsyncStorage.removeItem(CHAVES.rascunho);

export const lerFiltros = () => lerJson(CHAVES.filtros, {});
export const salvarFiltros = (filtros) => gravarJson(CHAVES.filtros, filtros);

export const lerUltimasLeituras = () => lerJson(CHAVES.lidas, {});
export async function marcarLeitura(caronaId, quando = Date.now()) {
  const atuais = await lerUltimasLeituras();
  await gravarJson(CHAVES.lidas, { ...atuais, [caronaId]: quando });
  return { ...atuais, [caronaId]: quando };
}

export const lerEventosNotificados = () => lerJson(CHAVES.eventos, {});
export const salvarEventosNotificados = (eventos) => gravarJson(CHAVES.eventos, eventos);

export const lerFeriadosCache = (ano) => lerJson(CHAVES.feriados(ano));
export const salvarFeriadosCache = (ano, lista) => gravarJson(CHAVES.feriados(ano), lista);

export async function limparDadosLocais() {
  const chaves = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(chaves.filter((chave) => chave.startsWith("@uniride/")));
}
