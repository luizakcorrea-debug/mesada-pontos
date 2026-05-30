// ============================================================
// CONFIGURAÇÃO — preencha com seus dados do Supabase
// ============================================================

const SUPABASE_URL = 'https://tamwrirhpnjoqxwxfpla.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhbXdyaXJocG5qb3F4d3hmcGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNjIzMDQsImV4cCI6MjA5NTczODMwNH0.yafNuSNIJziT_0VHafcjdGoU-HZ5EhwQVTyphRUle2k';

// ============================================================
// PINs padrão (serão salvos no banco depois do primeiro acesso)
// ============================================================

const DEFAULT_PINS = {
  pai:    '1234',
  filha:  '1111',
  filho:  '2222'
};

// ============================================================
// Tabela de ações disponíveis
// ============================================================

const ACOES_GANHO = [
  { label: 'Arrumou a cama',                  pts: 3  },
  { label: 'Quarto organizado (semana)',        pts: 5  },
  { label: 'Ajudou na mesa / louça',           pts: 2  },
  { label: 'Lavou louça',                      pts: 3  },
  { label: 'Varreu / aspirou cômodo',          pts: 5  },
  { label: 'Cuidou do pet',                    pts: 3  },
  { label: 'Tirou o lixo',                     pts: 3  },
  { label: 'Fez dever sem ser lembrado',       pts: 5  },
  { label: 'Nota 7–8,9 em prova/trabalho',     pts: 10 },
  { label: 'Nota 9+ em prova/trabalho',        pts: 20 },
  { label: 'Semana sem faltas',                pts: 5  },
  { label: 'Estudou extra / leu por lazer',    pts: 5  },
  { label: 'Ajudou o irmão(ã)',                pts: 5  },
  { label: 'Cumpriu horários',                 pts: 2  },
  { label: 'Resolveu conflito sem brigar',     pts: 8  },
  { label: 'Atitude gentil espontânea',        pts: 5  },
  { label: 'Cumpriu a palavra',                pts: 5  },
  { label: 'Semana sem brigas graves',         pts: 10 },
  { label: 'Iniciativa sem pedir nada',        pts: 10 },
  { label: 'Mês completo de tarefas',          pts: 15 },
  { label: 'Ajudou em ocasião especial',       pts: 10 },
  { label: 'Economizou parte da mesada',       pts: 10 },
  { label: 'Outro (informar pts)',              pts: null },
];

const ACOES_PERDA = [
  { label: 'Mentiu deliberadamente',           pts: 15 },
  { label: 'Briga física / agressividade',     pts: 10 },
  { label: 'Faltou com respeito aos pais',     pts: 10 },
  { label: 'Ignorou tarefa após 2 avisos',     pts: 5  },
  { label: 'Usou tela além do horário',        pts: 5  },
  { label: 'Danificou algo por descuido',      pts: 8  },
  { label: 'Outro (informar pts)',              pts: null },
];
