import brasilApi from "./respostas/brasilapi-cep.json";
import feriados from "./respostas/feriados-2026.json";
import nominatim from "./respostas/nominatim.json";
import openMeteo from "./respostas/open-meteo.json";
import osrm from "./respostas/osrm.json";
import viaCep from "./respostas/viacep.json";
import viaCepInexistente from "./respostas/viacep-inexistente.json";
import { buscarCep, lerBrasilApi, lerViaCep } from "../cep";
import { horaBrasilia, lerOpenMeteo, previsaoNaHora, traduzirTempo } from "../clima";
import { diaLocal, feriadoNaLista } from "../feriados";
import { lerNominatim } from "../geocodificacao";
import { obterJson } from "../http";
import { lerOsrm } from "../rota";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const resposta = (corpo, status = 200) => Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(corpo) });

afterEach(() => {
  delete global.fetch;
});

describe("parsers com respostas gravadas", () => {
  test("CEP pela BrasilAPI e pelo ViaCEP dão o mesmo formato", () => {
    const esperado = { cep: "36036000", rua: "Avenida dos Andradas", bairro: "Centro", cidade: "Juiz de Fora", uf: "MG" };
    expect(lerBrasilApi(brasilApi)).toEqual(esperado);
    expect(lerViaCep(viaCep)).toEqual(esperado);
    expect(lerViaCep(viaCepInexistente)).toBeNull();
  });

  test("Nominatim vira { lat, lng } numérico", () => {
    const ponto = lerNominatim(nominatim);
    expect(ponto.lat).toBeCloseTo(-21.76, 1);
    expect(ponto.lng).toBeCloseTo(-43.35, 1);
    expect(lerNominatim([])).toBeNull();
  });

  test("OSRM troca [lng, lat] por [lat, lng] e arredonda", () => {
    const rota = lerOsrm(osrm);
    expect(rota.distanciaKm).toBe(3.9);
    expect(rota.duracaoMin).toBe(7);
    expect(rota.linha[0][0]).toBeLessThan(-21);
    expect(rota.linha[0][1]).toBeLessThan(-43);
    expect(lerOsrm({ code: "NoRoute", routes: [] })).toBeNull();
  });

  test("feriados pela data local", () => {
    expect(diaLocal(new Date(2026, 10, 15, 8))).toBe("2026-11-15");
    expect(feriadoNaLista(feriados, new Date(2026, 10, 15, 8))).toEqual({ nome: "Proclamação da República" });
    expect(feriadoNaLista(feriados, new Date(2026, 10, 16, 8))).toBeNull();
  });

  test("Open-Meteo na hora cheia de Brasília", () => {
    const hora = openMeteo.hourly.time[10];
    const data = new Date(`${hora}:00-03:00`);
    expect(horaBrasilia(new Date(data.getTime() + 20 * 60e3))).toBe(hora);
    const previsao = lerOpenMeteo(openMeteo, data);
    expect(previsao.temperatura).toBe(Math.round(openMeteo.hourly.temperature_2m[10]));
    expect(typeof previsao.chanceChuva).toBe("number");
    expect(previsao.descricao).toBeTruthy();
    expect(lerOpenMeteo(openMeteo, new Date(2000, 0, 1))).toBeNull();
    expect(traduzirTempo(63)).toEqual({ descricao: "Chuva", icone: "cloud-rain" });
    expect(traduzirTempo(1234).icone).toBe("cloud");
  });
});

describe("http e reservas", () => {
  test("404 vira mensagem própria e 500 vira fora do ar", async () => {
    global.fetch = jest.fn(() => resposta({}, 404));
    await expect(obterJson("x", { servico: "A busca", naoEncontrado: "Não achou." })).rejects.toThrow("Não achou.");
    global.fetch = jest.fn(() => resposta({}, 500));
    await expect(obterJson("x", { servico: "A busca" })).rejects.toThrow("A busca está fora do ar agora. Tente mais tarde.");
  });

  test("falha de rede tenta de novo uma vez", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new TypeError("rede")).mockImplementationOnce(() => resposta({ ok: 1 }));
    await expect(obterJson("x")).resolves.toEqual({ ok: 1 });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test("tempo esgotado aborta com mensagem", async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn((url, { signal }) => new Promise((_, rejeitar) => signal.addEventListener("abort", () => rejeitar(Object.assign(new Error("x"), { name: "AbortError" })))));
    const promessa = obterJson("x", { servico: "O mapa" });
    jest.advanceTimersByTime(8000);
    await expect(promessa).rejects.toThrow("O mapa demorou demais para responder. Tente de novo.");
    jest.useRealTimers();
  });

  test("CEP usa o ViaCEP quando a BrasilAPI cai", async () => {
    global.fetch = jest.fn((url) => (url.includes("brasilapi") ? resposta({}, 500) : resposta(viaCep)));
    await expect(buscarCep("36036-000")).resolves.toMatchObject({ bairro: "Centro" });
  });

  test("CEP inexistente na BrasilAPI não consulta a reserva", async () => {
    global.fetch = jest.fn(() => resposta({}, 404));
    await expect(buscarCep("00000000")).rejects.toThrow("CEP não encontrado. Confira os números.");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("previsão fora da janela de 16 dias é null sem chamar a rede", async () => {
    global.fetch = jest.fn();
    await expect(previsaoNaHora(new Date(Date.now() + 20 * 86400e3))).resolves.toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
