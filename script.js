
function brNumber(v){
  return Number(v).toLocaleString('pt-BR');
}
document.getElementById('elite').textContent = dashboardData.elite;
document.getElementById('gap').textContent = brNumber(dashboardData.gap);
document.getElementById('quick').textContent = brNumber(dashboardData.quickwins);
document.getElementById('fragil').textContent = brNumber(dashboardData.baseFragil);

const ul = document.getElementById('acoes');
dashboardData.acoes.forEach(a=>{
  const li=document.createElement('li');
  li.textContent=a;
  ul.appendChild(li);
});

const distList = document.getElementById('dist-list');
dashboardData.distribuidores.forEach(d=>{
  const row = document.createElement('div');
  row.className='dist-row';
  row.innerHTML = `
    <div class="dist-name">${d.nome}</div>
    <div class="bar-wrap">
      <div class="bar">
        <div class="green" style="width:${d.green}%"></div>
        <div class="yellow" style="width:${d.yellow}%"></div>
        <div class="red" style="width:${d.red}%"></div>
      </div>
      <span class="bar-label g1">${d.greenLabel}</span>
      <span class="bar-label y1">${d.yellowLabel}</span>
      <span class="bar-label r1">${d.redLabel}</span>
    </div>
  `;
  distList.appendChild(row);
});
