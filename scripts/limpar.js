// Apaga as contas de exemplo do seed e tudo que elas criaram (caronas, reservas, mensagens, avaliações).
// Uso: node scripts/limpar.js
const { IDENTIDADE, PROJETO, MOTORISTAS, admin, uidPorEmail } = require("./admin");

const RAIZ = `https://firestore.googleapis.com/v1/projects/${PROJETO}/databases/(default)/documents`;

async function consultar(colecao, campo, valor) {
  const resposta = await admin(`${RAIZ}:runQuery`, "POST", {
    structuredQuery: {
      from: [{ collectionId: colecao }],
      where: { fieldFilter: { field: { fieldPath: campo }, op: "EQUAL", value: { stringValue: valor } } },
    },
  });
  return resposta.filter((r) => r.document).map((r) => r.document.name);
}

const apagar = (nome) => admin(`https://firestore.googleapis.com/v1/${nome}`, "DELETE");

async function apagarComSubcolecoes(nome) {
  for (const sub of ["mensagens", "privado"]) {
    const lista = await admin(`https://firestore.googleapis.com/v1/${nome}/${sub}?pageSize=300`, "GET");
    for (const d of lista.documents || []) await apagar(d.name);
  }
  await apagar(nome);
}

async function main() {
  for (const m of MOTORISTAS) {
    const uid = await uidPorEmail(m.email);
    if (!uid) continue;
    const caronas = await consultar("caronas", "motoristaId", uid);
    for (const carona of caronas) await apagarComSubcolecoes(carona);
    const reservas = await consultar("reservas", "motoristaId", uid);
    for (const reserva of reservas) await apagar(reserva);
    const avaliacoes = [...(await consultar("avaliacoes", "avaliadoId", uid)), ...(await consultar("avaliacoes", "avaliadorId", uid))];
    for (const avaliacao of avaliacoes) await apagar(avaliacao);
    await apagar(`projects/${PROJETO}/databases/(default)/documents/usuarios/${uid}/privado/dados`);
    await apagar(`projects/${PROJETO}/databases/(default)/documents/usuarios/${uid}`);
    await admin(`${IDENTIDADE}/accounts:delete`, "POST", { localId: uid });
    console.log(`${m.email}: ${caronas.length} caronas, ${reservas.length} reservas, ${avaliacoes.length} avaliações apagadas`);
  }
  process.exit(0);
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
