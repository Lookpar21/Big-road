let results = JSON.parse(localStorage.getItem("results")) || [];

function save() {
  localStorage.setItem("results", JSON.stringify(results));
}

function resetAll() {
  results = [];
  save();
  displayRoads();
}

function undo() {
  results.pop();
  save();
  displayRoads();
}

function addResult() {
  const input = document.getElementById("inputResult").value.toLowerCase().replace(/[^bpt]/g, "");
  if (!input) return;
  for (let char of input) {
    results.push(char);
  }
  document.getElementById("inputResult").value = "";
  save();
  displayRoads();
}

// ----------------
// Big Road (Grid)
// ----------------
function buildBigRoad() {
  const grid = [];
  let col = 0, row = 0, last = null;

  results.forEach(r => {
    if (r === "t") return; // Tie ไม่ขยับ

    if (last === null) {
      if (!grid[col]) grid[col] = [];
      grid[col][row] = r;
    } else if (r === last) {
      // ฝั่งเดิม → ลงต่อ
      row++;
      if (grid[col] && grid[col][row]) {
        col++;
        row = 0;
      }
      if (!grid[col]) grid[col] = [];
      grid[col][row] = r;
    } else {
      // เปลี่ยนฝั่ง → คอลัมน์ใหม่
      col++;
      row = 0;
      if (!grid[col]) grid[col] = [];
      grid[col][row] = r;
    }
    last = r;
  });

  console.log("Big Road Grid:", JSON.stringify(grid));
  return grid;
}

// ----------------
// Big Eye Road
// ----------------
function calcBigEye() {
  const big = buildBigRoad();
  const derived = [];

  for (let c = 1; c < big.length; c++) {  // เริ่มจากคอลัมน์ที่ 2
    const currCol = big[c];
    const prevCol = big[c - 1];
    if (!currCol || !prevCol) continue;

    for (let r = 1; r < currCol.length; r++) { // เริ่มจากแถว 2
      let color = "p"; // default น้ำเงิน
      if (prevCol.length === currCol.length) {
        color = "b"; // แดง
      }
      derived.push(color);
    }
  }
  return derived;
}

// ----------------
// Render
// ----------------
function makeCircle(type, road) {
  const div = document.createElement("div");
  div.classList.add("circle");
  if (road === "bigRoad") {
    if (type === "b") div.classList.add("banker");
    if (type === "p") div.classList.add("player");
  } else if (road === "bigEye") {
    if (type === "b") div.classList.add("banker");  // แดง
    if (type === "p") div.classList.add("player");  // น้ำเงิน
  }
  return div;
}

function renderGrid(containerId, data) {
  const grid = document.getElementById(containerId);
  grid.innerHTML = "";
  data.forEach(item => grid.appendChild(makeCircle(item, containerId)));
}

function displayRoads() {
  const big = buildBigRoad();
  const bigFlat = big.flat();
  renderGrid("bigRoad", bigFlat);
  renderGrid("bigEye", calcBigEye());
}

window.onload = displayRoads;
