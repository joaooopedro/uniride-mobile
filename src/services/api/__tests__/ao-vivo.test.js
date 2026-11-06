// Chama as APIs de verdade, sem o preset do Expo (que troca o fetch). Uso: npm run test:apis
import { buscarCep, calcularRota, feriadoNaData, geocodificar, previsaoNaHora } from "..";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const ao = process.env.API_AO_VIVO ? describe : describe.skip;
jest.setTimeout(30000);

ao("APIs reais", () => {
  test("CEP de Juiz de Fora", async () => {
    expect(await buscarCep("36036-000")).toMatchObject({ cidade: "Juiz de Fora", uf: "MG" });
    await expect(buscarCep("00000-000")).rejects.toThrow(/CEP não encontrado/);
  });

  test("geocodificação respeita 1 pedido por segundo", async () => {
    const inicio = Date.now();
    const a = await geocodificar("Rua Halfeld, Centro, Juiz de Fora, MG");
    const b = await geocodificar("Avenida Rio Branco, Juiz de Fora, MG");
    expect(a.lat).toBeCloseTo(-21.76, 1);
    expect(b.lng).toBeCloseTo(-43.35, 1);
    expect(Date.now() - inicio).toBeGreaterThanOrEqual(1000);
    expect(await geocodificar("rua halfeld, centro, juiz de fora, mg")).toEqual(a);
  });

  test("rota até o campus", async () => {
    const rota = await calcularRota({ lat: -21.7709, lng: -43.3567 }, { lat: -21.7774, lng: -43.3711 });
    expect(rota.distanciaKm).toBeGreaterThan(1);
    expect(rota.linha.length).toBeGreaterThan(1);
  });

  test("feriado e previsão", async () => {
    expect(await feriadoNaData(new Date(2026, 10, 15, 9))).toEqual({ nome: "Proclamação da República" });
    const previsao = await previsaoNaHora(new Date(Date.now() + 2 * 86400e3));
    expect(previsao).toMatchObject({ temperatura: expect.any(Number), icone: expect.any(String) });
  });
});
