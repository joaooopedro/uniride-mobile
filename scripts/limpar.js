// Zera o banco de teste: apaga todos os documentos do Firestore (com subcoleções) e todas as contas do Authentication.
// Uso: node scripts/limpar.js   (depois rode scripts/seed.js para recriar as contas do grupo)
const { IDENTIDADE, PROJETO, admin } = require("./admin");

const BASE = "https://firestore.googleapis.com/v1";
const RAIZ = `projects/${PROJETO}/databases/(default)/documents`;

const subcolecoes = async (pai) =>
  (await admin(`${BASE}/${pai}:listCollectionIds`, "POST", { pageSize: 100 })).collectionIds || [];

async function apagarColecao(pai, colecao) {
  let total = 0;
  for (;;) {
    const lista = await admin(`${BASE}/${pai}/${colecao}?pageSize=300&showMissing=true`, "GET");
    const docs = lista.documents || [];
    if (!docs.length) return total;
    for (const d of docs) {
      for (const sub of await subcolecoes(d.name)) await apagarColecao(d.name, sub);
      await admin(`${BASE}/${d.name}`, "DELETE");
      total += 1;
    }
  }
}

async function main() {
  for (const colecao of await subcolecoes(RAIZ)) {
    console.log(`${colecao}: ${await apagarColecao(RAIZ, colecao)} documentos apagados`);
  }
  const { users = [] } = await admin(`${IDENTIDADE}/accounts:batchGet?maxResults=1000`, "GET");
  for (const u of users) await admin(`${IDENTIDADE}/accounts:delete`, "POST", { localId: u.localId });
  console.log(`${users.length} contas apagadas`);
  process.exit(0);
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
