const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

function project(lat, lon) {
  const x = ((lon + 180) / 360) * WIDTH;
  const y = ((90 - lat) / 180) * HEIGHT;
  return { x, y };
}

function drawPolygon(coordinates) {
  if (coordinates.length < 2) {
    return;
  }

  ctx.beginPath();
  // coordinates is an array of [lon, lat] pairs
  const start = project(coordinates[0][1], coordinates[0][0]);
  ctx.moveTo(start.x, start.y);

  for (let i = 1; i < coordinates.length; i++) {
    const point = project(coordinates[i][1], coordinates[i][0]);
    ctx.lineTo(point.x, point.y);
  }

  ctx.closePath();
  ctx.fillStyle = "white";
  ctx.fill("evenodd");
}

async function generate() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const response = await fetch("../public/data/ne_110m_land.json");
  const data = await response.json();
  for (const feature of data.features) {
    drawPolygon(feature.geometry.coordinates[0]);
  }
}

generate();

document.getElementById("download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "land_mask.png";
  link.href = canvas.toDataURL();
  link.click();
});
