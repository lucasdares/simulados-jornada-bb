import React, { useState, useEffect } from 'react';
import { ArrowLeft, Activity, CheckCircle2, XCircle, Info, Globe, RefreshCw, AlertTriangle, Key, ShieldAlert } from 'lucide-react';
import { Button } from '../components/Button';
import { isLocalStorageMode, forceLocalStorageMode, restoreFirebaseMode } from '../supabase';

interface DiagnosticPageProps {
  onBack: () => void;
}

export default function DiagnosticPage({ onBack }: DiagnosticPageProps) {
  const [localModeOn, setLocalModeOn] = useState(isLocalStorageMode);
  
  // Retrieve properties securely
  // @ts-ignore
  const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  // @ts-ignore
  const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  // Extract domain
  let domain = 'Não configurado';
  try {
    if (supabaseUrl) {
      const urlObj = new URL(supabaseUrl);
      domain = urlObj.hostname;
    }
  } catch (e) {
    domain = 'URL Inválida: ' + supabaseUrl;
  }

  // Network Check State
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [healthMessage, setHealthMessage] = useState<string>('');
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [latency, setLatency] = useState<number | null>(null);

  const checkHealth = async () => {
    if (!supabaseUrl) {
      setHealthStatus('error');
      setErrorMessage('Nenhuma URL do Supabase configurada nas variáveis de ambiente.');
      return;
    }

    setLoading(true);
    setHealthStatus('idle');
    setHttpStatus(null);
    setErrorMessage('');
    setLatency(null);

    const startTime = Date.now();
    try {
      const targetUrl = `${supabaseUrl}/auth/v1/health`;
      console.log(`[Diagnostic] Fetching target: ${targetUrl}`);
      
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
        },
        mode: 'cors',
      });

      const endTime = Date.now();
      setLatency(endTime - startTime);
      setHttpStatus(response.status);

      if (response.ok) {
        setHealthStatus('success');
        const data = await response.json();
        setHealthMessage(JSON.stringify(data, null, 2));
      } else {
        setHealthStatus('error');
        const text = await response.text();
        setErrorMessage(`HTTP ${response.status}: ${text || 'Erro sem descrição'}`);
      }
    } catch (err: any) {
      const endTime = Date.now();
      setLatency(endTime - startTime);
      setHealthStatus('error');
      
      console.error('[Diagnostic] Connection error caught:', err);
      
      // Handle typical DNS/Connection Errors
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setErrorMessage(
          'TypeError: Failed to fetch (Erro de Rede).\n\n' +
          'Isto geralmente acontece se o domínio não puder ser resolvido (net::ERR_NAME_NOT_RESOLVED), ' +
          'se o projeto estiver desativado/pausado pela Supabase, se houver bloqueio de CORS, ou ' +
          'se sua conexão com a internet estiver bloqueando este endereço específico.'
        );
      } else {
        setErrorMessage(err?.message || String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6 font-sans">
      <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center py-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-full hover:bg-slate-900 border border-slate-800 transition-colors text-slate-400 hover:text-white"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-mono text-bb-cyan uppercase tracking-wider font-semibold">SUPORTAR SISTEMA</span>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">Diagnóstico de Conexão Supabase</h1>
          </div>
        </div>

        {/* Local Storage Mode Control Panel */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border-2 border-amber-500/30 shadow-lg shadow-amber-500/5 mb-6 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-grow">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-2">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Modo de Operação Resiliente
                </h2>
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${
                  localModeOn 
                    ? 'bg-amber-500/25 text-amber-400 border border-amber-500/35' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {localModeOn ? 'Modo Local (Offline)' : 'Modo Cloud (Supabase)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4 font-normal">
                {localModeOn 
                  ? 'Você está usando o Modo Local. Todos os dados (usuários, respostas, relatórios) são salvos com segurança diretamente no seu navegador. Perfeito para contornar problemas de rede, servidores temporariamente desativados ou pausados!' 
                  : 'Você está no Modo Conectado. O aplicativo tenta se comunicar com os servidores da Supabase para autenticação compartilhada e armazenamento na nuvem.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {localModeOn ? (
                  <Button 
                    onClick={() => {
                      restoreFirebaseMode();
                      setLocalModeOn(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-xs border-slate-700 hover:bg-slate-850"
                  >
                    Voltar para o Modo Cloud (Supabase)
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      forceLocalStorageMode();
                      setLocalModeOn(true);
                    }}
                    variant="accent"
                    size="sm"
                    className="w-full sm:w-auto text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-none"
                  >
                    Ativar Modo Local (Offline)
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Card: Loaded URL */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-slate-400 mb-3">
              <Globe className="w-5 h-5 text-bb-cyan" />
              <span className="text-sm font-semibold tracking-wide uppercase text-slate-300">Variável URL Carregada</span>
            </div>
            <p className="font-mono text-xs break-all bg-slate-950 p-3 rounded-lg border border-slate-800 text-white min-h-[44px] flex items-center">
              {supabaseUrl || <span className="text-red-400 italic">Vazia ou não configurada</span>}
            </p>
            <p className="text-[11px] text-slate-500 mt-2 font-mono leading-relaxed">
              Carregado via <span className="text-slate-400">import.meta.env.VITE_SUPABASE_URL</span>
            </p>
          </div>

          {/* Card: Domain Parsing */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-slate-400 mb-3">
              <Activity className="w-5 h-5 text-bb-cyan" />
              <span className="text-sm font-semibold tracking-wide uppercase text-slate-300">Domínio Extraído</span>
            </div>
            <p className="font-mono text-xs break-all bg-slate-950 p-3 rounded-lg border border-slate-800 text-white min-h-[44px] flex items-center">
              {domain}
            </p>
            <p className="text-[11px] text-slate-500 mt-2 font-mono leading-relaxed">
              Resolução de DNS aponta para este servidor de destino.
            </p>
          </div>

          {/* Card: Token Auth Key state */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm md:col-span-2">
            <div className="flex items-center gap-3 text-slate-400 mb-3">
              <Key className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-semibold tracking-wide uppercase text-indigo-300">Configuração de Chave Pública (Anon Key)</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <p className="font-mono text-xs break-all bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-400 flex-grow">
                {supabaseKey 
                  ? `${supabaseKey.substring(0, 12)}...${supabaseKey.substring(supabaseKey.length - 12)}` 
                  : <span className="text-red-400 italic">Chave não encontrada</span>
                }
              </p>
              <div className="px-4 py-2 border border-slate-800/80 bg-slate-950 rounded-lg text-xs font-mono flex items-center justify-center text-slate-400">
                Tamanho: {supabaseKey ? `${supabaseKey.length} caracteres` : '0'}
              </div>
            </div>
          </div>
        </div>

        {/* Connection Test Results */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Resultado do Teste de Conexão</h2>
              <p className="text-xs text-slate-400 mt-1">Conecta à rota GoTrue API Health do Supabase (`/auth/v1/health`)</p>
            </div>
            <Button 
              onClick={checkHealth} 
              disabled={loading}
              className="w-full sm:w-auto flex items-center gap-2"
              variant="accent"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Testando...' : 'Reexecutar Teste'}
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <RefreshCw className="w-8 h-8 text-bb-cyan animate-spin mb-3" />
              <p className="text-sm">Enviando requisição de teste para o servidor...</p>
            </div>
          ) : (
            <div>
              {/* Status Banner */}
              {healthStatus === 'success' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3 items-start mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-300 text-sm">Pronto e Conectado!</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      O servidor respondeu com sucesso. Latência: <strong>{latency}ms</strong>
                    </p>
                  </div>
                </div>
              )}

              {healthStatus === 'error' && (
                <div className="bg-red-500/15 border border-red-500/20 p-4 rounded-xl flex gap-3 items-start mb-4">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-red-300 text-sm">Falha na Conexão</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Não foi possível estabelecer contato com a API do Supabase. Latência: <strong>{latency}ms</strong>
                    </p>
                    {httpStatus && (
                      <div className="mt-2 text-xs font-mono text-slate-300">
                        Código de Retorno HTTP: <span className="bg-slate-950 px-2 py-0.5 rounded text-red-400 font-bold">{httpStatus}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {healthStatus === 'idle' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-400 italic text-center text-xs">
                  Inicie o teste clicando em "Reexecutar Teste" acima.
                </div>
              )}

              {/* Console log content */}
              {(healthStatus === 'success' || healthStatus === 'error') && (
                <div className="mt-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">Logs & Respostas Detalhadas:</span>
                  <pre className="font-mono text-xs p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto max-h-60 leading-relaxed whitespace-pre-wrap">
                    {healthStatus === 'success' ? healthMessage : errorMessage}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Troubleshooting / DNS Analysis */}
        <div className="bg-slate-900/45 p-5 rounded-2xl border border-slate-800/80">
          <div className="flex gap-3 mb-3">
            <Info className="w-5 h-5 text-bb-cyan shrink-0" />
            <h3 className="text-sm font-bold text-slate-200">Como Resolver Erros de Host/DNS (net::ERR_NAME_NOT_RESOLVED)</h3>
          </div>
          <ul className="text-xs text-slate-400 space-y-2 pl-4 list-decimal leading-relaxed">
            <li>
              <strong className="text-slate-350">Seu Projeto no Supabase pode ter Pausado:</strong> Projetos da camada gratuita no Supabase entram em pausa automaticamente se ficarem sem acesso por alguns dias. Vá ao painel do <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-bb-cyan hover:underline hover:text-white">Supabase</a>, clique no seu projeto e reative-o.
            </li>
            <li>
              <strong className="text-slate-350">URL Escrita de Forma Incorreta:</strong> Certifique-se de que a URL no `.env` está idêntica à exibida em <strong>Settings &rarr; API &rarr; Project URL</strong>. Espaços adicionais, falta do `https://` ou erros de digitação causarão falhas.
            </li>
            <li>
              <strong className="text-slate-350">Limpeza de Cache DNS:</strong> O seu navegador ou seu provedor de rede pode ter cacheado uma rota DNS offline incorreta. Tente acessar em tela anônima ou limpe o cache DNS do sistema operacional.
            </li>
            <li>
              <strong className="text-slate-350">Verificação de Chave:</strong> Confirme que <span className="text-slate-300">VITE_SUPABASE_ANON_KEY</span> está devidamente sincronizado com a chave Anon em seu painel Supabase.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
