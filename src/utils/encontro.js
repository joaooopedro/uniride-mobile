// Ponto de encontro bom para os dois: o ponto do caminho do motorista mais perto de onde o passageiro sai.
// O motorista não desvia da rota; o passageiro anda o mínimo. Distâncias em metros (aproximação plana, ok na escala de uma cidade).
const RAIO = 6371000;
const rad = (g) => (g * Math.PI) / 180;

function plano(ref) {
  const k = Math.cos(rad(ref.lat));
  return (p) => ({ x: rad(p.lng) * k * RAIO, y: rad(p.lat) * RAIO });
}

export function distanciaMetros(a, b) {
  const para = plano(a);
  const pa = para(a);
  const pb = para(b);
  return Math.hypot(pa.x - pb.x, pa.y - pb.y);
}

// linha: [[lat, lng], ...] da rota do motorista até o campus.
export function pontoDeEncontro(linha, passageiro) {
  const pontos = (linha || []).map(([lat, lng]) => ({ lat, lng }));
  if (!pontos.length || !passageiro) return null;
  if (pontos.length === 1) return { ...pontos[0], distancia: distanciaMetros(pontos[0], passageiro) };
  const para = plano(passageiro);
  const p = para(passageiro);
  let melhor = null;
  for (let i = 0; i < pontos.length - 1; i += 1) {
    const a = para(pontos[i]);
    const b = para(pontos[i + 1]);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const t = dx || dy ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy))) : 0;
    const distancia = Math.hypot(a.x + t * dx - p.x, a.y + t * dy - p.y);
    if (!melhor || distancia < melhor.distancia) {
      melhor = {
        lat: pontos[i].lat + t * (pontos[i + 1].lat - pontos[i].lat),
        lng: pontos[i].lng + t * (pontos[i + 1].lng - pontos[i].lng),
        distancia,
      };
    }
  }
  return melhor;
}

// "350 m a pé" ou "1,2 km a pé"; até uns 80 m conta como na porta.
export function textoCaminhada(metros) {
  if (metros == null) return "";
  if (metros < 80) return "Na porta do passageiro";
  if (metros < 1000) return `${Math.round(metros / 10) * 10} m a pé para o passageiro`;
  return `${(metros / 1000).toFixed(1).replace(".", ",")} km a pé para o passageiro`;
}

// Pedido "preciso de carona" vence meia hora depois do horário pedido.
export function pedidoVencido(interesse, agora = new Date()) {
  const dia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(interesse?.dia || "");
  const hora = /^(\d{2}):(\d{2})$/.exec(interesse?.hora || "");
  if (!dia || !hora) return true;
  const momento = new Date(Number(dia[1]), Number(dia[2]) - 1, Number(dia[3]), Number(hora[1]), Number(hora[2]));
  return momento.getTime() + 30 * 60000 < agora.getTime();
}
