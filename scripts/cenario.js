// Monta o cenário da apresentação em cima do seed: viagens passadas com avaliações,
// reservas aceitas com conversa, um pedido aguardando resposta.
// Uso: node scripts/limpar.js && node scripts/seed.js && node scripts/cenario.js
const { PROJETO, MOTORISTAS, PASSAGEIROS, admin, uidPorEmail } = require("./admin");

const BASE = "https://firestore.googleapis.com/v1";
const RAIZ = `projects/${PROJETO}/databases/(default)/documents`;

function valor(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(valor) } };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "object") return { mapValue: { fields: campos(v) } };
  return { stringValue: String(v) };
}
const campos = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, valor(v)]));
function ler(v) {
  if ("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, ler(x)]));
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(ler);
  if ("integerValue" in v) return Number(v.integerValue);
  if ("timestampValue" in v) return new Date(v.timestampValue);
  return Object.values(v)[0];
}

const gravar = (caminho, dados) => admin(`${BASE}/${RAIZ}/${caminho}`, "PATCH", { fields: campos(dados) });
const criar = async (colecao, dados) => (await admin(`${BASE}/${RAIZ}/${colecao}`, "POST", { fields: campos(dados) })).name.split("/").pop();
const obter = async (caminho) => {
  const d = await admin(`${BASE}/${RAIZ}/${caminho}`, "GET");
  return { id: d.name.split("/").pop(), ...Object.fromEntries(Object.entries(d.fields).map(([k, v]) => [k, ler(v)])) };
};
async function caronasDe(uid) {
  const r = await admin(`${BASE}/${RAIZ}:runQuery`, "POST", {
    structuredQuery: {
      from: [{ collectionId: "caronas" }],
      where: { fieldFilter: { field: { fieldPath: "motoristaId" }, op: "EQUAL", value: { stringValue: uid } } },
    },
  });
  return r.filter((x) => x.document).map((x) => obter(x.document.name.split("/documents/")[1]));
}

const minutos = (n) => new Date(Date.now() + n * 60000);
const diasAtras = (n, hora) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hora, 10, 0, 0);
  return d;
};

async function main() {
  const pessoa = {};
  for (const p of [...MOTORISTAS, ...PASSAGEIROS]) {
    const uid = await uidPorEmail(p.email);
    if (!uid) throw new Error(`${p.email} não existe: rode scripts/seed.js antes`);
    pessoa[p.email.split("@")[0]] = { uid, nome: p.nome, curso: `${p.curso}, ${p.periodo}º período`, perfil: await obter(`usuarios/${uid}`) };
  }
  const { jonathan, gabriel, caio, nicolas } = pessoa;
  const joaoM = pessoa["joao.motorista"];
  const joaoP = pessoa["joao.passageiro"];
  const notas = {}; // uid -> { notaMotorista: {soma,total}, notaPassageiro: {soma,total} }
  const somar = (uid, campo, n) => {
    notas[uid] ??= { notaMotorista: { soma: 0, total: 0 }, notaPassageiro: { soma: 0, total: 0 } };
    notas[uid][campo].soma += n;
    notas[uid][campo].total += 1;
  };

  async function reserva(carona, passageiro, status, extra = {}) {
    const id = `${carona.id}_${passageiro.uid}`;
    await gravar(`reservas/${id}`, {
      caronaId: carona.id, passageiroId: passageiro.uid, motoristaId: carona.motoristaId,
      passageiro: { nome: passageiro.nome, curso: passageiro.curso, nota: 0, fotoBase64: null },
      status, avaliadaPeloPassageiro: false, avaliadaPeloMotorista: false,
      criadoEm: minutos(-600), atualizadoEm: minutos(-300), ...extra,
    });
    return id;
  }
  async function avaliar(reservaId, carona, avaliador, avaliado, papelAvaliado, nota, comentario, quando) {
    await gravar(`avaliacoes/${reservaId}_${avaliador.uid}`, {
      reservaId, caronaId: carona.id, avaliadorId: avaliador.uid, avaliadorNome: avaliador.nome,
      avaliadoId: avaliado.uid, papelAvaliado, nota, comentario, criadoEm: quando,
    });
    somar(avaliado.uid, papelAvaliado === "motorista" ? "notaMotorista" : "notaPassageiro", nota);
  }
  async function conversa(carona, linhas, inicio) {
    for (const [i, [autor, texto, tipo]] of linhas.entries()) {
      await criar(`caronas/${carona.id}/mensagens`, {
        autorId: autor.uid, autorNome: autor.nome, texto, tipo: tipo || "texto", criadoEm: minutos(inicio + i * 3),
      });
    }
  }

  // Viagens da semana passada, já concluídas e avaliadas pelos dois lados.
  const passadas = [
    { motorista: jonathan, veiculo: jonathan.perfil.motorista.veiculo, bairro: "São Mateus", ponto: "Em frente à padaria da esquina com a Rua São Mateus", campus: "Campus Estrela Sul", dias: 7, hora: 7, valor: 500,
      passageiros: [[caio, 5, "Pontual. Dirigiu com cuidado.", 5], [nicolas, 5, "Educado. Música boa no caminho.", 5], [joaoP, 4, "Pontual.", 5]] },
    { motorista: gabriel, veiculo: gabriel.perfil.motorista.veiculo, bairro: "Granbery", ponto: "Portão do Colégio Granbery", campus: "Campus Estrela Sul", dias: 6, hora: 13, valor: 450,
      passageiros: [[nicolas, 5, "Pontual. Dirigiu com cuidado.", 5], [joaoP, 4, "Atrasou uns minutos, mas avisou pelo chat.", 4]] },
    { motorista: joaoM, veiculo: joaoM.perfil.motorista.veiculo, bairro: "Centro", ponto: "Parque Halfeld, lado da Rua Halfeld", campus: "Campus Academia (Centro)", dias: 5, hora: 18, valor: 400,
      passageiros: [[caio, 5, "Educado. Pontual.", 5]] },
  ];
  for (const v of passadas) {
    const saida = diasAtras(v.dias, v.hora);
    const aceitos = v.passageiros.map(([p]) => ({ uid: p.uid, nome: p.nome }));
    const dados = {
      motoristaId: v.motorista.uid,
      motorista: { nome: v.motorista.nome, curso: v.motorista.curso, nota: 0, fotoBase64: null, veiculo: v.veiculo },
      origem: { cep: "", rua: "", numero: "", bairro: v.bairro, ponto: v.ponto, lat: -21.765, lng: -43.352 },
      campusDestino: v.campus, destino: { lat: -21.7774, lng: -43.3711 }, saidaEm: saida,
      vagasTotais: 3, vagasRestantes: 3 - aceitos.length, valorCentavos: v.valor, rota: null,
      participantes: [v.motorista.uid, ...aceitos.map((a) => a.uid)], passageirosAceitos: aceitos,
      status: "concluida", criadoEm: diasAtras(v.dias + 2, 20), atualizadoEm: saida,
    };
    const id = await criar("caronas", dados);
    const carona = { id, ...dados };
    for (const [p, notaMotorista, comentario, notaPassageiro] of v.passageiros) {
      const rid = await reserva(carona, p, "concluida", { avaliadaPeloPassageiro: true, avaliadaPeloMotorista: true, criadoEm: diasAtras(v.dias + 1, 21), atualizadoEm: saida });
      await avaliar(rid, carona, p, v.motorista, "motorista", notaMotorista, comentario, new Date(saida.getTime() + 3600000));
      await avaliar(rid, carona, v.motorista, p, "passageiro", notaPassageiro, "", new Date(saida.getTime() + 4000000));
    }
    await conversa(carona, [[v.motorista, "Estou saindo agora", "aviso_rapido"], [v.motorista, "Cheguei no ponto de encontro", "aviso_rapido"], [v.passageiros[0][0], "Descendo, 1 minuto"]], (saida - Date.now()) / 60000 - 10);
  }

  // Próximas caronas: reservas aceitas com conversa e um pedido aguardando.
  const [jon1] = (await Promise.all(await caronasDe(jonathan.uid))).filter((c) => c.status === "aberta").sort((a, b) => a.saidaEm - b.saidaEm);
  const [gab1] = (await Promise.all(await caronasDe(gabriel.uid))).filter((c) => c.status === "aberta").sort((a, b) => a.saidaEm - b.saidaEm);
  const [joao1] = (await Promise.all(await caronasDe(joaoM.uid))).filter((c) => c.status === "aberta").sort((a, b) => a.saidaEm - b.saidaEm);

  async function aceitar(carona, passageiros) {
    for (const p of passageiros) await reserva(carona, p, "aceita");
    const aceitos = passageiros.map((p) => ({ uid: p.uid, nome: p.nome }));
    await gravar(`caronas/${carona.id}?updateMask.fieldPaths=vagasRestantes&updateMask.fieldPaths=participantes&updateMask.fieldPaths=passageirosAceitos`, {
      vagasRestantes: carona.vagasRestantes - passageiros.length,
      participantes: [carona.motoristaId, ...aceitos.map((a) => a.uid)],
      passageirosAceitos: aceitos,
    });
  }
  await aceitar(jon1, [caio, joaoP]);
  await conversa(jon1, [
    [jonathan, "Oi pessoal, amanhã saio no horário. Ponto de encontro na padaria."],
    [caio, "Fechado. Levo o notebook, tem espaço no porta-malas?"],
    [jonathan, "Tem sim."],
    [joaoP, "Posso pagar no Pix na hora?"],
    [jonathan, "Pode, a chave está nos detalhes da carona."],
  ], -90);
  await aceitar(gab1, [joaoP]);
  await conversa(gab1, [
    [joaoP, "Gabriel, vou estar de camisa azul no ponto."],
    [gabriel, "Beleza, Gol branco. Qualquer atraso eu aviso aqui."],
  ], -60);
  await reserva(joao1, caio, "solicitada", { criadoEm: minutos(-20), atualizadoEm: minutos(-20) });

  // Notas acumuladas no perfil e na carona de cada motorista.
  for (const [uid, n] of Object.entries(notas)) {
    await gravar(`usuarios/${uid}?updateMask.fieldPaths=notaMotorista&updateMask.fieldPaths=notaPassageiro`, n);
  }
  for (const m of [jonathan, gabriel, joaoM]) {
    const n = notas[m.uid]?.notaMotorista;
    if (!n?.total) continue;
    for (const c of await Promise.all(await caronasDe(m.uid))) {
      await gravar(`caronas/${c.id}?updateMask.fieldPaths=motorista.nota`, { motorista: { nota: Math.round((n.soma / n.total) * 10) / 10 } });
    }
  }

  console.log("3 viagens passadas avaliadas; Caio e João (passageiro) aceitos na próxima do Jonathan com conversa;");
  console.log("João (passageiro) aceito na próxima do Gabriel com conversa; Caio pediu vaga na próxima do João (motorista).");
  console.log("Nicolas fica sem reserva para pedir vaga ao vivo.");
  process.exit(0);
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
