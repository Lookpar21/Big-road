let results = JSON.parse(localStorage.getItem("results")) || [];

// ----------------
// Save & Control
// ----------------
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
// Build Big Road Grid (full rules)
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
        // ถ้าเต็มแล้ว → ย้ายคอลัมน์ใหม่
        col++;
        row = 0;
      }
      if (!grid[col]) grid[col] = [];
      grid[col][row] = r;
    } else {
      // เปลี่ยนฝั่ง → เริ่มคอลัมน์ใหม่
      col++;
      row = 0;
      if (!grid[col]) grid[col] = [];
      grid[col][row] = r;
    }
    last = r;
  });

  return grid;
}

// ----------------
// Derived Roads (full rules)
// ----------------
function calcDerived(type) {
  const big = buildBigRoad();
  const derived = [];
  const offset = type === "bigEye" ? 1 : type === "smallRoad" ? 2 : 3;

  for (let c = offset; c < big.length; c++) {
    const currCol = big[c];
    if (!currCol) continue;

    for (let r = 0; r < currCol.length; r++) {
      const refCol = big[c - offset];
      let color = "p"; // น้ำเงิน

      if (refCol) {
        // ถ้า column ref มี และความยาวเท่ากัน → แดง
        if (refCol.length === currCol.length) {
          color = "b";
        }
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
  } else {
    if (type === "b") div.classList.add("banker");
    if (type === "p") div.classList.add("player");
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
  renderGrid("bigEye", calcDerived("bigEye"));
  renderGrid("smallRoad", calcDerived("smallRoad"));
  renderGrid("cockroachRoad", calcDerived("cockroachRoad"));
}

window.onload = displayRoads;
