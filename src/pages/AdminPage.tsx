import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { dbService } from '../firebase';
import { User, ExamAttempt } from '../types';
import { Shield, Eye, Download, Search, Filter, RefreshCw, BarChart3, Users, Clock, MessageSquareShare, CheckCircle2 } from 'lucide-react';

interface AdminPageProps {
  onBack: () => void;
  currentUser?: User | null;
}

export default function AdminPage({ onBack, currentUser }: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.email && ['dareslucas@gmail.com', 'guilhermeamiti007@gmail.com'].includes(currentUser.email.toLowerCase())) {
      setIsAuthenticated(true);
    }
  }, [currentUser]);

  // Loaded database telemetry
  const [users, setUsers] = useState<User[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Search & Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [utmFilter, setUtmFilter] = useState('ALL');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (password === 'alterar123') {
      setIsAuthenticated(true);
    } else {
      setLoginError("Senha de administrador incorreta.");
    }
  };

  const fetchDatabaseLogs = async () => {
    setLoadingData(true);
    try {
      const adminData = await dbService.getAdminData();
      
      setUsers(adminData.users);
      setAttempts(adminData.attempts);
    } catch (err) {
      console.error("Admin dataset fetch failed: ", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDatabaseLogs();
    }
  }, [isAuthenticated]);

  // Download tabular file CSV of all users and progress
  const handleExportCSV = () => {
    if (users.length === 0) return;

    const headers = ["ID", "Nome", "Email", "Telefone", "Origem/UTM Source", "Campanha", "Cadastrado Em", "Simulado Status", "Pontuacao", "Tempo Gasto (s)", "WhatsApp Clicado"];
    const rows = users.map(u => {
      // Find corresponding attempt
      const attempt = attempts.find(a => a.userId === u.uid);
      
      return [
        u.uid,
        `"${u.nome.replace(/"/g, '""')}"`,
        u.email,
        u.telefone || "Não informado",
        u.utm_source || "direct",
        u.utm_campaign || "none",
        u.createdAt,
        attempt ? attempt.status : "Não Iniciado",
        attempt && attempt.score !== undefined ? `${attempt.score}%` : "N/A",
        attempt ? attempt.timeSpent : "N/A",
        attempt ? (attempt.whatsappClicked ? "SIM" : "NAO") : "NAO"
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JornadaBB_Simulados_Relatorio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter candidates matching current queries
  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = u.nome.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    const matchesUtm = utmFilter === 'ALL' || (u.utm_source || 'direct') === utmFilter;
    return matchesSearch && matchesUtm;
  });

  // Extract unique UTM sources
  const uniqueUtms = Array.from(new Set(users.map(u => u.utm_source || 'direct')));

  // Aggregation dashboards math
  const totalUsers = users.length;
  const startedCount = attempts.filter(a => a.status === 'started').length;
  const submittedCount = attempts.filter(a => a.status === 'submitted').length;
  const whatsappClicks = attempts.filter(a => a.whatsappClicked).length;
  const conversionRate = submittedCount > 0 ? Math.round((whatsappClicks / submittedCount) * 100) : 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12 text-slate-800">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <Logo size="md" />
            <p className="text-slate-400 text-[10px] tracking-widest font-bold uppercase mt-2">Executive Admin Portal</p>
          </div>

          <Card variant="premium" className="shadow-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="w-12 h-12 rounded-full bg-[#E5A900]/10 text-[#C48C00] border-2 border-[#E5A900]/10 flex items-center justify-center mx-auto mb-5">
              <Shield className="w-6 h-6" />
            </div>

            <h3 className="font-display font-black text-xl text-slate-800 tracking-tight mb-4 text-center">Gabarito Interno e Métricas</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed text-center mb-6">
              Esta seção é estritamente confidencial para gestores da plataforma Jornada BB. Por favor, forneça a credencial cadastrada.
            </p>

            {loginError && (
              <p className="bg-red-50 text-red-650 text-xs px-3 py-2 rounded-xl border border-red-200 mb-4 font-bold text-center">
                {loginError}
              </p>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 font-mono">
                  Senha Geral Administrativa
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Selecione a chave..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0057A8] text-slate-800 text-sm placeholder-slate-400 rounded-xl outline-hidden font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="secondary" size="md" onClick={onBack} className="flex-1 bg-white">
                  Voltar
                </Button>
                <Button variant="primary" size="md" type="submit" className="flex-1">
                  Destravar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      
      {/* Top navbar bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={true} />
          <span className="w-px h-6 bg-slate-200"></span>
          <span className="text-xs font-mono font-bold tracking-widest text-[#E5A900] uppercase">ADMIN AREA</span>
        </div>
        <Button variant="secondary" size="sm" onClick={onBack} className="bg-white">
          Sair do Admin
        </Button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-grow space-y-8">
        
        {/* Executive summary widgets row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Card variant="default" className="bg-white border-slate-200 border flex items-center gap-4 py-4 px-5 shadow-sm rounded-xl">
            <Users className="w-10 h-10 text-[#00A6D6] bg-[#00A6D6]/10 p-2 rounded-xl" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cadastros totais</p>
              <p className="text-xl sm:text-2xl font-black font-display text-slate-800 mt-1">{totalUsers}</p>
            </div>
          </Card>

          <Card variant="default" className="bg-white border-slate-200 border flex items-center gap-4 py-4 px-5 shadow-sm rounded-xl">
            <Clock className="w-10 h-10 text-[#E5A900] bg-[#E5A900]/10 p-2 rounded-xl" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Iniciados</p>
              <p className="text-xl sm:text-2xl font-black font-display text-slate-800 mt-1">{startedCount}</p>
            </div>
          </Card>

          <Card variant="default" className="bg-white border-slate-200 border flex items-center gap-4 py-4 px-5 shadow-sm rounded-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 bg-emerald-50 p-2 rounded-xl" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enviados</p>
              <p className="text-xl sm:text-2xl font-black font-display text-slate-800 mt-1">{submittedCount}</p>
            </div>
          </Card>

          <Card variant="default" className="bg-white border-slate-200 border flex items-center gap-4 py-4 px-5 shadow-sm rounded-xl">
            <MessageSquareShare className="w-10 h-10 text-pink-600 bg-pink-50 p-2 rounded-xl" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">WhatsApp Clicado</p>
              <p className="text-xl sm:text-2xl font-black font-display text-slate-800 mt-1">
                {whatsappClicks} <span className="text-[10px] text-slate-400 font-normal">({conversionRate}%)</span>
              </p>
            </div>
          </Card>
        </div>

        {/* Database tabular records section */}
        <Card variant="default" className="bg-white p-6 md:p-8 space-y-6 border border-slate-200 rounded-2xl shadow-sm">
          
          {/* Filtering bar section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h3 className="font-display font-black text-lg text-slate-800">Inscrições e Resultados de Candidatos</h3>
              <p className="text-xs text-slate-500 mt-1">Monitore quem está completando e exporte os leads de UTM para otimizar funis do WhatsApp.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchDatabaseLogs}
                loading={loadingData}
                className="bg-white border hover:bg-slate-50 border-slate-200 text-slate-600"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Atualizar base
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExportCSV}
                disabled={users.length === 0}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Exportar Relatório CSV
              </Button>
            </div>
          </div>

          {/* Filtering input indicators */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por nome ou email..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0057A8] text-sm rounded-xl text-slate-800 placeholder-slate-400 outline-hidden transition-colors"
              />
            </div>

            <div className="relative flex-shrink-0 min-w-[200px]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Filter className="w-4 h-4" />
              </span>
              <select
                value={utmFilter}
                onChange={(e) => setUtmFilter(e.target.value)}
                className="w-full pl-9 pr-6 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0057A8] text-sm rounded-xl text-slate-650 outline-hidden cursor-pointer placeholder-slate-400"
              >
                <option value="ALL">Todas as Origens (UTM)</option>
                {uniqueUtms.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Core Table view */}
          <div className="overflow-x-auto border border-slate-150 rounded-xl max-h-[500px]">
            {loadingData ? (
              <div className="p-12 text-center text-slate-500 font-medium">Carregando dados estruturados...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-500">Nenhum candidato localizado com os filtros selecionados.</div>
            ) : (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider select-none">
                    <th className="p-4 font-bold">Candidato</th>
                    <th className="p-4 font-bold">Contato</th>
                    <th className="p-4 font-bold">Origem (UTM)</th>
                    <th className="p-4 font-bold">Data Cadastro</th>
                    <th className="p-4 font-bold">Simulado Status</th>
                    <th className="p-4 font-bold">Pontos</th>
                    <th className="p-4 font-bold">WhatsApp?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const attempt = attempts.find(a => a.userId === u.uid);

                    return (
                      <tr key={u.uid} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-bold text-slate-800">
                          <p>{u.nome}</p>
                          <span className="text-[10px] text-slate-450 font-mono uppercase font-bold">UID: {u.uid.substring(0, 8)}</span>
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-600">
                          <p className="font-semibold">{u.email}</p>
                          <p className="text-slate-400 mt-0.5">{u.telefone || "Não cadastrou"}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                            u.utm_source === 'direct' || !u.utm_source ? 'bg-slate-100 border border-slate-200 text-slate-500' : 'bg-[#00A6D6]/10 border border-[#00A6D6]/30 text-[#00A6D6]'
                          }`}>
                            {u.utm_source || "direct"}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4">
                          {attempt ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold leading-none ${
                              attempt.status === 'submitted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-[#E5A900]/10 text-[#C48C00] border border-[#E5A900]/10'
                            }`}>
                              ● {attempt.status === 'submitted' ? 'Enviado' : 'Em andamento'}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs font-semibold">Não Iniciou</span>
                          )}
                        </td>
                        <td className="p-4 font-bold font-mono">
                          {attempt && attempt.score !== undefined ? (
                            <span className="text-slate-800">{attempt.score}%</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          {attempt ? (
                            <span className={`inline-flex px-1.5 py-0.5 rounded font-bold font-mono text-[10px] ${
                              attempt.whatsappClicked ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {attempt.whatsappClicked ? 'SIM' : 'NÃO'}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </main>

      {/* Footer copyright */}
      <footer className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider py-8 border-t border-slate-200 mt-12 bg-white shadow-xs">
        <span>Painel de gestão confidencial para a diretoria da Jornada BB. Feito com segurança de criptografia ponta a ponta.</span>
      </footer>
    </div>
  );
}
export type { AdminPageProps };
