
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
  let bigEye = buildDerived(bigRoad, 1);
  let small = buildDerived(bigRoad, 2);
  let cockroach = buildDerived(bigRoad, 3);

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

function buildDerived(bigRoad, offset) {
  let derived=[];
  for (let c=offset+1;c<bigRoad.length;c++) {
    if(!bigRoad[c]) continue;
    for (let r=0;r<bigRoad[c].length;r++) {
      let color = compareColumns(bigRoad, c, r, offset);
      if(!derived[c]) derived[c]=[];
      derived[c][r]=color;
    }
  }
  return derived;
}

function compareColumns(bigRoad,c,r,offset) {
  let refCol = bigRoad[c-offset]||[];
  let refPrev = bigRoad[c-offset-1]||[];
  if (r===0) {
    return (refCol.length === refPrev.length) ? 'b':'p';
  } else {
    if (refCol[r]) return 'b';
    else return (refCol.length === refPrev.length) ? 'b':'p';
  }
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
