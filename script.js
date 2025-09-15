
let results = [];

function addResult(r) {
  results.push(r);
  calculate();
}

function undo() {
  results.pop();
  calculate();
}

function reset() {
  results = [];
  clearGrids();
}

function calculate() {
  let bigRoad = buildBigRoad(results);
  let bigEye = buildDerived(bigRoad, 1, false); // Big Eye
  let small = buildDerived(bigRoad, 2, true);   // Small = flip color
  let cockroach = buildDerived(bigRoad, 3, true); // Cockroach = flip color

  drawBigRoad('bigRoad', bigRoad);
  drawGrid('bigEye', bigEye);
  drawGrid('smallRoad', small);
  drawGrid('cockroach', cockroach);
}

function clearGrids(){
  ['bigRoad','bigEye','smallRoad','cockroach'].forEach(id => document.getElementById(id).innerHTML='');
}

function buildBigRoad(results) {
  let grid = [];
  let col = 0, row = 0, last = null;
  results.forEach(r=>{
    if (last && r===last) row++;
    else { col++; row=0; }
    if(!grid[col]) grid[col]=[];
    grid[col][row]=r;
    last=r;
  });
  return grid;
}

function buildDerived(bigRoad, offset, flipColor) {
  let derived=[];
  for (let c=offset+1;c<bigRoad.length;c++) {
    if(!bigRoad[c]) continue;
    for (let r=0;r<bigRoad[c].length;r++) {
      let color = compareColumnsAdvanced(bigRoad, c, r, offset, flipColor);
      if(!derived[c]) derived[c]=[];
      derived[c][r]=color;
    }
  }
  return derived;
}

function compareColumnsAdvanced(bigRoad,c,r,offset,flip) {
  let refCol = bigRoad[c-offset]||[];
  let refPrev = bigRoad[c-offset-1]||[];
  let sameHeight = (refCol.length === refPrev.length);
  let color;

  if (r===0) {
    // เริ่มคอลใหม่: เทียบจำนวนจุดในคอลอ้างอิงกับคอลก่อนหน้า
    color = sameHeight ? 'b' : 'p';
  } else {
    // ลงต่อในคอล: ดูว่ามีจุดที่แถวเดียวกันของคอลอ้างอิงหรือไม่
    if (refCol[r]) {
      color = 'b';
    } else {
      // กติกาพิเศษ: ถ้าไม่มีจุด ใช้ความสูงคอลอ้างอิงเทียบคอลก่อนหน้า
      color = sameHeight ? 'b' : 'p';
    }
  }
  if (flip) color = (color === 'b') ? 'p' : 'b'; // flip สำหรับ Small / Cockroach
  return color;
}

function drawBigRoad(id, grid) {
  let container = document.getElementById(id);
  container.innerHTML='';
  for(let c=1;c<grid.length;c++) {
    if(!grid[c]) continue;
    for(let r=0;r<grid[c].length;r++) {
      let cell=document.createElement('div');
      cell.className='cell '+(grid[c][r]||'');
      cell.textContent=grid[c][r];
      container.appendChild(cell);
    }
  }
}

function drawGrid(id, grid) {
  let container = document.getElementById(id);
  container.innerHTML='';
  for(let c=1;c<grid.length;c++) {
    if(!grid[c]) continue;
    for(let r=0;r<grid[c].length;r++) {
      let cell=document.createElement('div');
      cell.className='cell '+(grid[c][r]||'');
      container.appendChild(cell);
    }
  }
}
