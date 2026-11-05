// Sugestão de rateio a partir da distância real da rota.
// Base: consumo médio de 11 km/l e gasolina a R$ 6,29, dividido entre passageiros e motorista.
export const PARAMETROS_RATEIO = {
  consumoKmPorLitro: 11,
  precoLitroCentavos: 629,
  minimoCentavos: 300,
  maximoCentavos: 2500,
};

export function sugerirRateio(distanciaKm, lugares = 1, parametros = PARAMETROS_RATEIO) {
  const km = Math.max(0, Number(distanciaKm) || 0);
  const ocupantes = Math.max(1, Number(lugares) || 1) + 1;
  const custoCentavos = (km / parametros.consumoKmPorLitro) * parametros.precoLitroCentavos;
  const porPessoa = custoCentavos / ocupantes;
  const arredondado = Math.ceil(porPessoa / 50) * 50;
  return Math.min(parametros.maximoCentavos, Math.max(parametros.minimoCentavos, arredondado));
}

export function mediaAvaliacao(nota) {
  if (!nota || !nota.total) return { media: 0, total: 0 };
  return { media: Math.round((nota.soma / nota.total) * 10) / 10, total: nota.total };
}
