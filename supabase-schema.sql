-- Execute este SQL no editor SQL do Supabase
-- (SQL Editor → New query → cole tudo → Run)

-- Tabela de eventos (pontos ganhos e perdidos)
create table if not exists events (
  id         bigint generated always as identity primary key,
  kid        text not null,           -- 'filha' ou 'filho'
  month      text not null,           -- formato 'YYYY-MM'
  action     text not null,           -- descrição da ação
  pts        integer not null,        -- positivo = ganho, negativo = perda
  note       text,                    -- observação opcional
  created_at timestamptz default now()
);

-- Tabela de configurações gerais (PINs etc.)
create table if not exists config (
  key   text primary key,
  value text not null
);

-- Liberar acesso público (Row Level Security desativado para uso familiar simples)
alter table events enable row level security;
alter table config enable row level security;

create policy "allow_all_events" on events for all using (true) with check (true);
create policy "allow_all_config" on config for all using (true) with check (true);
