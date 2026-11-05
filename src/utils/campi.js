// Coordenadas das portarias principais dos dois campi da UniAcademia em Juiz de Fora.
export const CAMPI = [
  {
    id: "academia",
    nome: "Campus Academia (Centro)",
    endereco: "Rua Halfeld, 1179, Centro",
    lat: -21.7612,
    lng: -43.3496,
  },
  {
    id: "estrela-sul",
    nome: "Campus Estrela Sul",
    endereco: "Av. Presidente Itamar Franco, 4000, Cascatinha",
    lat: -21.7774,
    lng: -43.3711,
  },
];

export const CIDADE = { nome: "Juiz de Fora", uf: "MG", lat: -21.7642, lng: -43.3503 };

export function campusPorNome(nome) {
  return CAMPI.find((campus) => campus.nome === nome) || null;
}
