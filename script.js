function br(num){return num.toLocaleString('pt-BR')}
function showView(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(view + '-view').classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
}
function statusClass(status){
  if(status.includes('AGIR')) return 'agir';
  if(status.includes('ACELERAR')) return 'acelerar';
  return 'ganho';
}
function renderDashboard(){
  document.getElementById('kpi-atual').textContent = dashboardData.atual.toFixed(2).replace('.', ',') + '%';
  document.getElementById('kpi-gap').textContent = br(dashboardData.gap);
  document.getElementById('kpi-quickwins').textContent = br(dashboardData.quickwins);
  document.getElementById('kpi-fragil').textContent = br(dashboardData.baseFragil);

  const acoes = document.getElementById('acoes-lista');
  acoes.innerHTML = dashboardData.acoes.map(a => `<li>${a}</li>`).join('');

  const maxGap = Math.max(...dashboardData.franquias.map(f => f.gap));
  const resumo = document.getElementById('franquias-resumo');
  resumo.innerHTML = dashboardData.franquias
    .slice()
    .sort((a,b)=>b.gap-a.gap)
    .map(f => `
      <div class="bar-row">
        <strong>${f.franquia}</strong>
        <div class="bar-track"><div class="bar-fill" style="width:${(f.gap/maxGap)*100}%"></div></div>
        <span>${br(f.gap)}</span>
      </div>
    `).join('');
}
function renderQuickWins(){
  const tbody = document.getElementById('quickwins-table');
  tbody.innerHTML = dashboardData.quickWinsList.map(q => `
    <tr>
      <td>${q.empreendedora}</td>
      <td>${q.franquia}</td>
      <td>${q.distribuidor}</td>
      <td>${q.pontos}</td>
      <td>${q.faixa}</td>
      <td>${q.acao}</td>
    </tr>
  `).join('');
}
function renderFranquias(){
  const tbody = document.getElementById('franquias-table');
  tbody.innerHTML = dashboardData.franquias
    .slice()
    .sort((a,b)=>b.gap-a.gap)
    .map(f => `
    <tr>
      <td>${f.franquia}</td>
      <td>${br(f.base)}</td>
      <td>${br(f.duasMais)}</td>
      <td>${f.atual.toFixed(2).replace('.', ',')}%</td>
      <td>${br(f.gap)}</td>
      <td><span class="status ${statusClass(f.status)}">${f.status}</span></td>
      <td>${br(f.win700)}</td>
      <td>${br(f.win500)}</td>
    </tr>`).join('');
}
function renderDistribuidores(){
  const tbody = document.getElementById('distribuidores-table');
  tbody.innerHTML = dashboardData.distribuidores.map(d => `
    <tr>
      <td>${d.distribuidor}</td>
      <td>${d.franquia}</td>
      <td>${br(d.carteira)}</td>
      <td>${br(d.baseFragil)}</td>
      <td>${br(d.win700)}</td>
      <td>${d.acao}</td>
    </tr>`).join('');
}
renderDashboard();
renderQuickWins();
renderFranquias();
renderDistribuidores();
