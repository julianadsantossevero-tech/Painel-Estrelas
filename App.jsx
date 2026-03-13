import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#1d4ed8', '#93c5fd', '#ef4444', '#fbbf24'];

const exemplo = [
  { Franquia: 'Manaus', Distribuidor: 'DI Norte 01', Empreendedora: 'Ana Paula S.', Pontos: 982, Sacolas: 2, Categoria: '1 Estrela', Status: 'Ativa' },
  { Franquia: 'Manaus', Distribuidor: 'DI Norte 01', Empreendedora: 'Rosana M.', Pontos: 804, Sacolas: 2, Categoria: '1 Estrela', Status: 'Ativa' },
  { Franquia: 'Belém', Distribuidor: 'DI Centro 14', Empreendedora: 'Maria Joana P.', Pontos: 941, Sacolas: 2, Categoria: '1 Estrela', Status: 'Ativa' },
  { Franquia: 'Curitiba', Distribuidor: 'DI Sul 08', Empreendedora: 'Franciele R.', Pontos: 888, Sacolas: 2, Categoria: '1 Estrela', Status: 'Ativa' },
  { Franquia: 'Igrejinha', Distribuidor: 'DI Serra 11', Empreendedora: 'Luzinete C.', Pontos: 915, Sacolas: 2, Categoria: '1 Estrela', Status: 'Ativa' },
  { Franquia: 'Rio Branco', Distribuidor: 'DI Acre 05', Empreendedora: 'Patricia A.', Pontos: 973, Sacolas: 2, Categoria: '1 Estrela', Status: 'Ativa' },
  { Franquia: 'Belém', Distribuidor: 'DI Centro 14', Empreendedora: 'Vanessa L.', Pontos: 1520, Sacolas: 4, Categoria: '2 Estrelas', Status: 'Ativa' },
  { Franquia: 'Manaus', Distribuidor: 'DI Norte 01', Empreendedora: 'Juliana M.', Pontos: 2400, Sacolas: 5, Categoria: '3 Estrelas', Status: 'Ativa' },
  { Franquia: 'Manaus', Distribuidor: 'DI Norte 02', Empreendedora: 'Sueli A.', Pontos: 120, Sacolas: 1, Categoria: 'Nenhum', Status: 'Ativa' },
  { Franquia: 'Curitiba', Distribuidor: 'DI Sul 10', Empreendedora: 'Tatiane O.', Pontos: 540, Sacolas: 2, Categoria: '1 Estrela', Status: 'Ativa' },
  { Franquia: 'Belém', Distribuidor: 'DI Centro 16', Empreendedora: 'Marina C.', Pontos: 610, Sacolas: 2, Categoria: '1 Estrela', Status: 'Ativa' },
  { Franquia: 'Rio Branco', Distribuidor: 'DI Acre 05', Empreendedora: 'Raquel P.', Pontos: 90, Sacolas: 1, Categoria: 'Nenhum', Status: 'Ativa' }
];

const categoriaLabel = (pontos) => {
  if (pontos >= 10000) return 'Superstar';
  if (pontos >= 4000) return '5 Estrelas';
  if (pontos >= 3000) return '4 Estrelas';
  if (pontos >= 2000) return '3 Estrelas';
  if (pontos >= 1000) return '2 Estrelas';
  if (pontos >= 1) return '1 Estrela';
  return 'Nenhum';
};

const prioridadeLabel = (perc) => {
  if (perc < 40) return 'AGIR AGORA';
  if (perc < 50) return 'ACELERAR';
  return 'GANHO RAPIDO';
};

const normalizar = (row) => {
  const franquia = row.Franquia ?? row.franquia ?? row.FILIAL ?? row.Filial ?? 'Sem franquia';
  const distribuidor = row.Distribuidor ?? row.distribuidor ?? row.Gerente ?? row['Distribuidor Independente'] ?? 'Sem distribuidor';
  const empreendedora = row.Empreendedora ?? row.empreendedora ?? row.Nome ?? row['Nome Empreendedora'] ?? 'Sem nome';
  const pontos = Number(row.Pontos ?? row.pontos ?? row.TotalPontos ?? row['Total de Pontos'] ?? 0) || 0;
  const sacolas = Number(row.Sacolas ?? row.sacolas ?? row['Sacolas Realizadas'] ?? row['Qtd Sacolas'] ?? 0) || 0;
  const categoria = row.Categoria ?? row.categoria ?? row['Categoria Estrela'] ?? categoriaLabel(pontos);
  const status = row.Status ?? row.status ?? row['Status Ativa'] ?? 'Ativa';
  return {
    Franquia: String(franquia),
    Distribuidor: String(distribuidor),
    Empreendedora: String(empreendedora),
    Pontos: pontos,
    Sacolas: sacolas,
    Categoria: String(categoria),
    Status: String(status),
  };
};

function StatCard({ title, value, subtitle, clickable, onClick }) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      style={{
        background: '#fff',
        padding: 20,
        borderRadius: 18,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
        border: '1px solid #e2e8f0',
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>{subtitle}</div>
      {clickable && <div style={{ marginTop: 10, fontSize: 12, color: '#1d4ed8', fontWeight: 700 }}>Clique para abrir a lista</div>}
    </div>
  );
}

function App() {
  const [dados, setDados] = useState(exemplo);
  const [view, setView] = useState('dashboard');
  const [arquivoNome, setArquivoNome] = useState('Base de exemplo carregada');

  const processarArquivo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    const normalizados = rows.map(normalizar);
    setDados(normalizados);
    setArquivoNome(file.name);
    setView('dashboard');
  };

  const indicadores = useMemo(() => {
    const base = dados.length;
    const duasMais = dados.filter((d) => ['2 Estrelas', '3 Estrelas', '4 Estrelas', '5 Estrelas', 'Superstar'].includes(d.Categoria)).length;
    const quickWins = dados.filter((d) => d.Pontos >= 700 && d.Pontos < 1000).length;
    const baseFragil = dados.filter((d) => d.Categoria === 'Nenhum' || d.Categoria === '1 Estrela').length;
    const perc = base ? (duasMais / base) * 100 : 0;
    const metaQtd = Math.ceil(base * 0.6);
    const gap = Math.max(0, metaQtd - duasMais);
    return { base, duasMais, quickWins, baseFragil, perc, gap, metaQtd };
  }, [dados]);

  const quickWinsList = useMemo(() => {
    return dados
      .filter((d) => d.Pontos >= 700 && d.Pontos < 1000)
      .sort((a, b) => b.Pontos - a.Pontos);
  }, [dados]);

  const porFranquia = useMemo(() => {
    const mapa = new Map();
    for (const item of dados) {
      if (!mapa.has(item.Franquia)) mapa.set(item.Franquia, []);
      mapa.get(item.Franquia).push(item);
    }
    return [...mapa.entries()].map(([franquia, items]) => {
      const base = items.length;
      const duasMais = items.filter((d) => ['2 Estrelas', '3 Estrelas', '4 Estrelas', '5 Estrelas', 'Superstar'].includes(d.Categoria)).length;
      const perc = base ? (duasMais / base) * 100 : 0;
      const gap = Math.max(0, Math.ceil(base * 0.6) - duasMais);
      const win700 = items.filter((d) => d.Pontos >= 700 && d.Pontos < 1000).length;
      const win500 = items.filter((d) => d.Pontos >= 500 && d.Pontos < 700).length;
      return { franquia, base, duasMais, perc: Number(perc.toFixed(1)), gap, win700, win500, prioridade: prioridadeLabel(perc) };
    }).sort((a, b) => b.gap - a.gap);
  }, [dados]);

  const porDistribuidor = useMemo(() => {
    const mapa = new Map();
    for (const item of quickWinsList) {
      const chave = `${item.Franquia}__${item.Distribuidor}`;
      if (!mapa.has(chave)) mapa.set(chave, { franquia: item.Franquia, distribuidor: item.Distribuidor, quantidade: 0, nomes: [] });
      const atual = mapa.get(chave);
      atual.quantidade += 1;
      atual.nomes.push(item.Empreendedora);
    }
    return [...mapa.values()].sort((a, b) => b.quantidade - a.quantidade);
  }, [quickWinsList]);

  const pieData = [
    { name: '2 estrelas ou mais', value: indicadores.duasMais },
    { name: 'Abaixo de 2 estrelas', value: indicadores.base - indicadores.duasMais },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 6 }}>Central Estrelas 60</div>
            <h1 style={{ margin: 0, fontSize: 34 }}>Painel de guerra comercial</h1>
            <p style={{ margin: '8px 0 0', color: '#64748b' }}>Suba o Excel e o painel recalcula franquias prioritárias, prontas para acelerar e distribuidores foco.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ background: '#1d4ed8', color: '#fff', padding: '12px 18px', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>
              Carregar Excel
              <input type="file" accept=".xlsx,.xls,.csv" onChange={processarArquivo} style={{ display: 'none' }} />
            </label>
            <button onClick={() => setView('dashboard')} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '12px 18px', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>Voltar ao painel</button>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: '#64748b' }}>Arquivo atual: <strong>{arquivoNome}</strong></div>
      </div>

      {view === 'dashboard' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 20 }}>
            <StatCard title="% Brasil 2 estrelas+" value={`${indicadores.perc.toFixed(1)}%`} subtitle="Meta 60%" />
            <StatCard title="Gap para a meta" value={indicadores.gap.toLocaleString('pt-BR')} subtitle="empreendedoras para converter" />
            <StatCard title="Prontas para acelerar" value={indicadores.quickWins.toLocaleString('pt-BR')} subtitle="empreendedoras com 700 a 999 pontos" clickable onClick={() => setView('quickwins')} />
            <StatCard title="Base frágil" value={indicadores.baseFragil.toLocaleString('pt-BR')} subtitle="Nenhum + 1 estrela" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginTop: 20 }}>
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
              <h2 style={{ marginTop: 0 }}>Franquias prioritárias</h2>
              <div style={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={porFranquia.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="franquia" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="gap" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
              <h2 style={{ marginTop: 0 }}>Composição da base</h2>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={95} label>
                      {pieData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ fontSize: 14, color: '#475569' }}>
                <div>Base total: <strong>{indicadores.base.toLocaleString('pt-BR')}</strong></div>
                <div>Meta 60%: <strong>{indicadores.metaQtd.toLocaleString('pt-BR')}</strong></div>
                <div>2 estrelas ou mais: <strong>{indicadores.duasMais.toLocaleString('pt-BR')}</strong></div>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 20, marginTop: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
            <h2 style={{ marginTop: 0 }}>Onde agir agora</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 8px' }}>Franquia</th>
                    <th style={{ padding: '12px 8px' }}>Base</th>
                    <th style={{ padding: '12px 8px' }}>% Atual</th>
                    <th style={{ padding: '12px 8px' }}>Gap</th>
                    <th style={{ padding: '12px 8px' }}>700+</th>
                    <th style={{ padding: '12px 8px' }}>500-699</th>
                    <th style={{ padding: '12px 8px' }}>Prioridade</th>
                  </tr>
                </thead>
                <tbody>
                  {porFranquia.map((f) => (
                    <tr key={f.franquia} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 700 }}>{f.franquia}</td>
                      <td style={{ padding: '12px 8px' }}>{f.base}</td>
                      <td style={{ padding: '12px 8px' }}>{f.perc}%</td>
                      <td style={{ padding: '12px 8px' }}>{f.gap}</td>
                      <td style={{ padding: '12px 8px' }}>{f.win700}</td>
                      <td style={{ padding: '12px 8px' }}>{f.win500}</td>
                      <td style={{ padding: '12px 8px' }}><span style={{ background: f.prioridade === 'AGIR AGORA' ? '#fee2e2' : f.prioridade === 'ACELERAR' ? '#fef3c7' : '#dcfce7', color: '#111827', padding: '6px 10px', borderRadius: 999 }}>{f.prioridade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === 'quickwins' && (
        <div style={{ marginTop: 20, display: 'grid', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
            <h2 style={{ marginTop: 0 }}>Prontas para acelerar</h2>
            <p style={{ color: '#64748b' }}>Empreendedoras com 700 a 999 pontos. Aqui está a lista para ação imediata.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 8px' }}>Empreendedora</th>
                    <th style={{ padding: '12px 8px' }}>Franquia</th>
                    <th style={{ padding: '12px 8px' }}>Distribuidor</th>
                    <th style={{ padding: '12px 8px' }}>Pontos</th>
                    <th style={{ padding: '12px 8px' }}>Sacolas</th>
                    <th style={{ padding: '12px 8px' }}>Ação sugerida</th>
                  </tr>
                </thead>
                <tbody>
                  {quickWinsList.map((q) => (
                    <tr key={`${q.Empreendedora}-${q.Distribuidor}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 700 }}>{q.Empreendedora}</td>
                      <td style={{ padding: '12px 8px' }}>{q.Franquia}</td>
                      <td style={{ padding: '12px 8px' }}>{q.Distribuidor}</td>
                      <td style={{ padding: '12px 8px' }}>{q.Pontos}</td>
                      <td style={{ padding: '12px 8px' }}>{q.Sacolas}</td>
                      <td style={{ padding: '12px 8px' }}>{q.Pontos >= 900 ? 'Contato imediato para virar 2 estrelas' : 'Acelerar próxima sacola'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
            <h2 style={{ marginTop: 0 }}>Distribuidores foco</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 8px' }}>Franquia</th>
                    <th style={{ padding: '12px 8px' }}>Distribuidor</th>
                    <th style={{ padding: '12px 8px' }}>Qtde prontas</th>
                    <th style={{ padding: '12px 8px' }}>Empreendedoras</th>
                  </tr>
                </thead>
                <tbody>
                  {porDistribuidor.map((d) => (
                    <tr key={`${d.franquia}-${d.distribuidor}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px' }}>{d.franquia}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 700 }}>{d.distribuidor}</td>
                      <td style={{ padding: '12px 8px' }}>{d.quantidade}</td>
                      <td style={{ padding: '12px 8px' }}>{d.nomes.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
