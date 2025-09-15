
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
  let bigEye = buildDerived(bigRoad, 1, false); // Big Eye = ไม่สลับสี
  let small = buildDerived(bigRoad, 2, true);   // Small = สลับสี
  let cockroach = buildDerived(bigRoad, 3, true); // Cockroach = สลับสี

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
      let color = compareColumns(bigRoad, c, r, offset, flipColor);
      if(!derived[c]) derived[c]=[];
      derived[c][r]=color;
    }
  }
  return derived;
}

function compareColumns(bigRoad,c,r,offset,flip) {
  let refCol = bigRoad[c-offset]||[];
  let refPrev = bigRoad[c-offset-1]||[];
  let same = (refCol.length === refPrev.length);
  let color;
  if (r===0) {
    color = same ? 'b' : 'p';
  } else {
    color = refCol[r] ? 'b' : (same ? 'b' : 'p');
  }
  if (flip) color = (color === 'b') ? 'p' : 'b'; // สลับสีถ้าเป็น Small / Cockroach
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
