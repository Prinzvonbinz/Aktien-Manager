const ctx = document.getElementById("chartCanvas").getContext("2d");
const chartCanvas = document.getElementById("chartCanvas");

let money, stocks, stockPrice, prices, lastPrice;

// === LocalStorage laden ===
function loadGame() {
  const save = JSON.parse(localStorage.getItem("stockGame"));
  if (save) {
    money = save.money ?? 100;
    stocks = save.stocks ?? 0;
    stockPrice = save.stockPrice ?? 10;
    lastPrice = save.lastPrice ?? stockPrice;
    prices = save.prices ?? Array(60).fill(stockPrice);
  } else {
    money = 100;
    stocks = 0;
    stockPrice = 10;
    lastPrice = stockPrice;
    prices = Array(60).fill(stockPrice);
  }
}

// === LocalStorage speichern ===
function saveGame() {
  const save = {
    money,
    stocks,
    stockPrice,
    lastPrice,
    prices,
  };
  localStorage.setItem("stockGame", JSON.stringify(save));
}

// === Resize & Chart zeichnen ===
function resizeCanvas() {
  chartCanvas.width = chartCanvas.parentElement.clientWidth;
  chartCanvas.height = chartCanvas.parentElement.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawChart() {
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  let step = chartCanvas.width / prices.length;
  for (let i = 0; i < prices.length; i++) {
    let y = chartCanvas.height - (prices[i] / 20) * chartCanvas.height;
    if (i === 0) ctx.moveTo(i * step, y);
    else ctx.lineTo(i * step, y);
  }
  ctx.stroke();
}

// === UI aktualisieren ===
const moneyEl = document.getElementById("money");
const stocksEl = document.getElementById("stocks");
const changeEl = document.getElementById("change");
const eventBox = document.getElementById("eventBox");

function updateDisplay() {
  moneyEl.textContent = `Kontostand: ${money.toFixed(2)} €`;
  stocksEl.textContent = `Aktien: ${stocks}`;
  let diff = stockPrice - lastPrice;
  let percent = ((diff / lastPrice) * 100).toFixed(2);
  if (percent >= 0) {
    changeEl.textContent = `▲ +${percent}%`;
    changeEl.style.color = "lightgreen";
  } else {
    changeEl.textContent = `▼ ${percent}%`;
    changeEl.style.color = "red";
  }
}

// === Preis aktualisieren ===
function updatePrice() {
  lastPrice = stockPrice;
  let randomChange = (Math.random() - 0.5) * 2;
  stockPrice = Math.max(1, stockPrice + randomChange);
  prices.push(stockPrice);
  if (prices.length > 60) prices.shift();
  drawChart();
  updateDisplay();
  saveGame();
}

// === Kaufen / Verkaufen ===
document.getElementById("buyBtn").addEventListener("click", () => {
  if (money >= stockPrice) {
    money -= stockPrice;
    stocks += 1;
    updateDisplay();
    saveGame();
  }
});

document.getElementById("sellBtn").addEventListener("click", () => {
  if (stocks > 0) {
    money += stockPrice;
    stocks -= 1;
    updateDisplay();
    saveGame();
  }
});

// === Zufällige Events ===
const events = [
  "CEO zurückgetreten!",
  "Produktlaunch angekündigt!",
  "Datenskandal aufgedeckt!",
  "Starke Quartalszahlen!",
  "Investoren steigen ein!",
  "Regierung kündigt Steuerreform an!",
  "Lieferprobleme in Asien!",
  "Neue Konkurrenz im Markt!",
  "Gerichtsverfahren gewonnen!",
  "Hackerangriff entdeckt!"
];

function randomEvent() {
  const event = events[Math.floor(Math.random() * events.length)];
  eventBox.textContent = "📢 " + event;
}

// === Initialisierung ===
loadGame();
drawChart();
updateDisplay();
setInterval(updatePrice, 1000);
setInterval(randomEvent, Math.random() * 20000 + 20000);
