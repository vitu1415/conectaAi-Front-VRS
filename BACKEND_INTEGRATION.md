# 🔌 Integração Frontend ↔ Backend — Mapeamento de Rotas

> Fonte oficial: `backend/conectaAí-vrs/01 - Backend/API.md`
> Base URL: `http://localhost:8080` · Auth: `Bearer JWT` (12h) + `Refresh Token` (7d)
> Swagger: `/swagger-ui.html` · OpenAPI: `/v3/api-docs`

---

## 1. Pré-requisitos (Infra)

| # | Ação | Arquivo | Status |
|---|------|---------|--------|
| 1 | Corrigir `baseURL` de `:3000/api` para `http://localhost:8080` (via `VITE_API_URL`) | `src/services/api.ts` + `.env` | ✅ |
| 2 | Implementar fluxo de `refresh-token` no interceptor (401 → renovar → retry) | `src/services/api.ts` | ✅ |
| 3 | Validar CORS no backend (já está aberto, mas conferir na rede) | backend | ✅ |
| 4 | Criar camada de adaptação de tipos (back → front) | `src/services/mappers.ts` + `src/types/api.ts` | ✅ |

> ⚠️ Os tipos do frontend (User, Event, Post, AgendaItem) **não batem** com os DTOs do backend. Toda fase exige um mapper (ver §5).

---

## 2. Mapa de Endpoints → Consumidores no Frontend

### 2.1 Autenticação `/auth` (Público)

| Método | Rota | Consumidor front | Substitui mock | Status |
|---|---|---|---|---|
| POST | `/auth/register` | `pages/Login.tsx` (botão "Criar conta") | — (não existia) | ✅ |
| POST | `/auth/login` | `pages/Login.tsx` | `AppContext.login()` (fake) | ✅ |
| POST | `/auth/refresh-token` | `services/api.ts` (interceptor) | — | ✅ |
| POST | `/auth/logout` | `contexts/AppContext.tsx` (`logout`) | localStorage fake | ✅ |
| POST | `/auth/redefinir-senha` | — (sem tela) | — | ⬜ |
| GET | `/auth/me` | `contexts/AppContext.tsx` (restaurar sessão) | `MOCK_USER` | ✅ |

### 2.2 Usuários `/usuarios` (Autenticado)

| Método | Rota | Consumidor front | Substitui mock | Status |
|---|---|---|---|---|
| GET | `/usuarios/me` | `pages/Profile.tsx` (perfil próprio) | `mockService.getUser()` / `MOCK_USER` | ⬜ |
| PUT | `/usuarios/me` | `pages/Profile.tsx` (botão Editar) | — (não existe) | ⬜ |
| PATCH | `/usuarios/me/foto` | `pages/Profile.tsx` (avatar) | — | ⬜ |
| DELETE | `/usuarios/me` | — (sem tela) | — | ⬜ |
| GET | `/usuarios/{id}` | `pages/Profile.tsx` (perfil público) | `mockPeople.find()` | ⬜ |
| GET | `/usuarios/me/interesses` | `pages/Profile.tsx` (interesses) | `MOCK_USER.interests` | ⬜ |
| PUT | `/usuarios/me/interesses` | `pages/Profile.tsx` (editar) | — | ⬜ |
| GET | `/usuarios/me/eventos` | `pages/Profile.tsx` (aba Eventos) | — (hardcoded "12 eventos") | ⬜ |

### 2.3 Eventos `/eventos` (Autenticado)

| Método | Rota | Consumidor front | Substitui mock | Status |
|---|---|---|---|---|
| GET | `/eventos` | `pages/EventsDashboard.tsx` | `mockEvents` + `mockService.getEvents()` | ⬜ |
| GET | `/eventos/destaques` | `pages/EventsDashboard.tsx` (hero/top) | `mockEvents` | ⬜ |
| GET | `/eventos/proximos` | `pages/EventsDashboard.tsx` (futuros) | `mockEvents` | ⬜ |
| GET | `/eventos/{id}` | `layouts/EventLayout.tsx` | `mockService.getEvent(id)` | ⬜ |
| POST | `/eventos` | — (sem tela de criação) | — | ⬜ |
| PUT | `/eventos/{id}` | — (sem tela de edição) | — | ⬜ |
| DELETE | `/eventos/{id}` | — | — | ⬜ |
| POST | `/eventos/{id}/participar` | `pages/EventsDashboard.tsx` (inscrever) | — | ⬜ |
| DELETE | `/eventos/{id}/participar` | — (cancelar inscrição) | — | ⬜ |
| GET | `/eventos/{id}/participantes` | `pages/People.tsx` (pessoas do evento) | `mockService.getPeople()` / `mockPeople` | ⬜ |

### 2.4 Posts `/post` (Autenticado)

| Método | Rota | Consumidor front | Substitui mock | Status |
|---|---|---|---|---|
| GET | `/post/feed/{usuarioId}` | feed global (futuro) | — | ⬜ |
| GET | `/post/eventos/{eventoId}` | `pages/Feed.tsx` | `mockPosts.filter()` | ⬜ |
| GET | `/post/usuarios/{usuarioId}` | `pages/Profile.tsx` (posts do usuário) | `mockPosts` | ⬜ |
| POST | `/post` | `components/CreatePost.tsx` | — (publicação fake) | ⬜ |
| GET | `/post/{id}` | detalhe de post | — | ⬜ |
| PUT | `/post/{id}` | edição (futuro) | — | ⬜ |
| DELETE | `/post/{id}` | exclusão (futuro) | — | ⬜ |
| POST | `/post/{id}/curtir` | `components/PostCard.tsx` (like) | estado local `liked` | ⬜ |
| DELETE | `/post/{id}/curtir` | `components/PostCard.tsx` (deslike) | estado local | ⬜ |

### 2.5 Comentários `/comentarios` (Autenticado)

| Método | Rota | Consumidor front | Substitui mock | Status |
|---|---|---|---|---|
| GET | `/comentarios/post/{id}` | `components/PostCard.tsx` (comentários) | `Comment[]` inline | ⬜ |
| POST | `/comentarios/post/{id}` | criação de comentário | — | ⬜ |
| PUT | `/comentarios/{id}` | edição (futuro) | — | ⬜ |
| DELETE | `/comentarios/{id}` | exclusão (futuro) | — | ⬜ |

### 2.6 Conexões `/conexoes` (Autenticado)

| Método | Rota | Consumidor front | Substitui mock | Status |
|---|---|---|---|---|
| POST | `/usuarios/{id}/conexoes` | `pages/People.tsx` · `pages/Profile.tsx` | `mockService.sendConnectionRequest()` | ⬜ |
| GET | `/usuarios/me/conexoes/recebidas` | `pages/EventsDashboard.tsx` (sino) · `pages/People.tsx` | `mockService.getConnectionRequests()` | ⬜ |
| GET | `/usuarios/me/conexoes/enviadas` | `pages/People.tsx` (pendências) | `mockService.getConnectionRequests()` | ⬜ |
| GET | `/usuarios/{id}/conexoes` | `pages/Profile.tsx` (lista) | `mockService.getConnections()` | ⬜ |
| GET | `/usuarios/{id}/conexao` | `pages/Profile.tsx` (status) | `mockService.getConnectionStatus()` | ⬜ |
| PATCH | `/conexoes/{id}/aceitar` | `pages/People.tsx` · `pages/EventsDashboard.tsx` | `mockService.acceptConnection()` | ⬜ |
| PATCH | `/conexoes/{id}/recusar` | idem | `mockService.rejectConnection()` | ⬜ |
| DELETE | `/conexoes/{id}` | `pages/Profile.tsx` (remover) | `mockService.removeConnection()` | ⬜ |

### 2.7 Agenda `/agenda` (Autenticado)

| Método | Rota | Consumidor front | Substitui mock | Status |
|---|---|---|---|---|
| GET | `/agenda?eventoId={id}` | `pages/Agenda.tsx` | `mockAgenda` | ⬜ |
| POST | `/agenda` | — (sem tela) | — | ⬜ |
| PUT | `/agenda/{id}` | — | — | ⬜ |
| DELETE | `/agenda/{id}` | — | — | ⬜ |

---

## 3. Módulos SEM backend (mantêm mock por enquanto)

| Página | Situação | Recomendação |
|---|---|---|
| `pages/Groups.tsx` | Backend não tem grupos de interesse (roadmap pendente) | Manter `mockGroups` |
| `components/AnnouncementCard.tsx` | Avisos hardcoded no componente; backend tem `Post.tipo` | Futuro: post com `tipo=ANUNCIO` via `/post/eventos/{id}` |
| Badges / Level / XP / universidade | Não existem nos DTOs do backend | Tratar como enriquecimento opcional (ou ocultar) |
| Match/descoberta de pessoas | Não existe no backend | People passa a usar participantes + conexões |

---

## 4. Plano em Fases (ordem sugerida)

### Fase 0 — Infra ✅
- Corrigir `baseURL` para `:8080`, adicionar `.env` com `VITE_API_URL` — **feito**
- Interceptor com `refresh-token` + retry (single-flight) — **feito**
- DTOs do backend tipados em `src/types/api.ts` — **feito**
- Mappers de adaptação em `src/services/mappers.ts` — **feito**
- Nenhum mock é removido ainda

### Fase 1 — Autenticação 🔑 ✅
- `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `GET /auth/me`
- Reescrever `AppContext`: `user` real vindo de `/auth/me`, token no localStorage
- **Remove:** login fake em `Login.tsx`, `MOCK_USER` como fonte do usuário
- **Valida:** fluxo completo login → sessão → logout

### Fase 2 — Usuários 👤
- `GET /usuarios/me`, `GET /usuarios/{id}`, `GET /usuarios/me/interesses`, `GET /usuarios/me/eventos`
- Perfil próprio + perfil público em `Profile.tsx`
- **Remove:** `mockService.getUser()`, uso de `mockPeople` no Profile

### Fase 3 — Eventos 🎪
- `GET /eventos`, `GET /eventos/destaques`, `GET /eventos/proximos`, `GET /eventos/{id}`, participação
- `EventsDashboard.tsx` + `EventLayout.tsx` com React Query
- **Remove:** `mockEvents`, `mockService.getEvents()`

### Fase 4 — Conexões 🤝
- Todas as 9 rotas de conexão (§2.6)
- `Profile.tsx`, `People.tsx`, sino em `EventsDashboard.tsx`
- **Remove:** `mocks/connections.ts`, métodos de conexão no `mockService`

### Fase 5 — Posts, Curtidas e Feed 📰
- `/post/*`, `/post/{id}/curtir`, `/comentarios/*`
- `Feed.tsx`, `CreatePost`, `PostCard`
- **Remove:** `mockPosts`, `mocks/posts.ts`

### Fase 6 — Agenda 📅
- `/agenda?eventoId=`
- `Agenda.tsx`
- **Remove:** `mockAgenda`, `mocks/agenda.ts`

### Fase 7 — Pessoas do Evento 👥
- `GET /eventos/{id}/participantes` + `GET /usuarios/{id}/conexao` (status)
- `People.tsx`
- **Remove:** `mockPeople`, `mocks/people.ts`

---

## 5. Adaptação de Tipos (back → front)

Os DTOs do backend usam campos diferentes dos tipos do front. Criar mappers em `src/services/`:

| Front (atual) | Backend DTO | Mapeamento a fazer |
|---|---|---|
| `User.avatar` / `.age` / `.university` / `.level` / `.xp` / `.badges` | `UsuarioResponse` (nome, email, bio, fotoPerfil, cidade, estado, dataNascimento, genero…) | `fotoPerfil→avatar`; `dataNascimento→age` (calcular); demais campos **não existem** → omitir |
| `Event.title` / `.image` / `.date` / `.category` / `.participants` / `.highlights` / `.organizers` | `EventoResponse` (nome, descricao, banner, cidade, estado, endereco, latitude, longitude, inicio, fim, capacidade, privado, status) | `nome→title`; `banner→image`; `inicio→date`; `capacidade→maxParticipants`; **category/price/highlights não existem** |
| `Post.userName` / `.userAvatar` / `.content` / `.likes` / `.comments` / `.shares` | `PostResponse` (autor: UsuarioResumo, texto, imagemUrl, tipo, visibilidade, curtidasCount, curtido, ativo) | `texto→content`; `autor→userName/userAvatar`; `curtidasCount→likes`; `curtido→liked`; **comments/shares não existem** → derivar |
| `AgendaItem.time` / `.title` / `.favorited` | `AgendaResponse` (eventoId, titulo, descricao, categoria, local, inicio, fim, ativo) | `inicio→time`; `titulo→title`; `favorited` **não existe** |
| `Connection.usuario` / `.eventosComuns` / `.eventoOrigem` | `ConexaoResponse` (usuarioOrigem, usuarioDestino, status) | `usuarioDestino→usuario`; **eventosComuns/interessesComuns não existem** |

---

## 6. Tracker de Remoção de Mocks

| Mock | Arquivos | Fase | Endpoint real |
|---|---|---|---|
| `mockEvents` | `mocks/events.ts` | 3 | `GET /eventos` |
| `mockPosts` | `mocks/posts.ts` | 5 | `GET /post/eventos/{id}` |
| `mockPeople` | `mocks/people.ts` | 2/7 | `GET /usuarios/{id}` + `/eventos/{id}/participantes` |
| `mockAgenda` | `mocks/agenda.ts` | 6 | `GET /agenda?eventoId=` |
| `mockGroups` | `mocks/groups.ts` | ⏳ sem backend | — |
| `mockConnections` | `mocks/connections.ts` | 4 | `/conexoes` (9 rotas) |
| `MOCK_USER` | `constants/index.ts` | 1/2 | `GET /auth/me` + `/usuarios/me` |
| `AnnouncementCard` inline | `components/AnnouncementCard.tsx` | ⏳ sem backend | `POST tipo=ANUNCIO` (futuro) |
| `mockService` | `services/mockService.ts` | 1→7 | deletado ao final |

---

## 7. Próximo passo imediato

> **Fase 0 + Fase 1 (Auth):** corrigir `baseURL`, implementar `refresh-token`, conectar `Login.tsx` ao `POST /auth/login` e `GET /auth/me`. Valida o fluxo ponta-a-ponta antes de migrar os demais domínios.