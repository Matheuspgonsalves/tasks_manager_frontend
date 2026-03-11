# Gerenciador de Usuários e Tarefas - Frontend
Aplicação web desenvolvida em **React** com **Vite**, utilizando **Tailwind CSS** e **Chakra UI** para a interface.  
Este projeto consome a API RESTful do sistema de gerenciamento de usuários e tarefas.

---

## 🚀 Tecnologias

- React
- Vite
- TypeScript
- Tailwind CSS
- Chakra UI
- Emotion
- Framer Motion

---

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone git@github.com:Matheuspgonsalves/tasks_manager_frontend.git
   cd tasks_manager_frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **(Opcional) Crie o arquivo .env**
   - Caso vá consumir a API com variável de ambiente:
     ```bash
     cp .env.example .env
     ```

---

## ⚙️ Configuração da API

Para conectar com o backend em produção, configure a URL da API no arquivo `.env`:

```env
VITE_API_URL="https://your-backend-domain.example.com"
```

> Se `VITE_API_URL` não estiver definida, o frontend usa `/api` por padrão.
> Em desenvolvimento, `/api` usa proxy do Vite para `http://localhost:3000`.
> Na Vercel, defina `VITE_API_URL` nas Environment Variables com a URL pública do backend.

---

## ▲ Deploy na Vercel

- O projeto já inclui `vercel.json` com rewrite SPA para que rotas como `/dashboard` e `/create-task` carreguem o `index.html`.
- O projeto fixa Node 20 via `package.json` e `.nvmrc`, compatível com o Vite 7.
- Na Vercel, configure a variável:
  ```env
  VITE_API_URL=https://your-backend-domain.example.com
  ```

---

## ▶️ Execute a Aplicação

- **Modo desenvolvimento:**
  ```bash
  npm run dev
  ```

- **Build de produção:**
  ```bash
  npm run build
  ```

- **Visualizar build local:**
  ```bash
  npm run preview
  ```

---

## 🧱 Estrutura Inicial

- `src/components` → componentes reutilizáveis
- `src/pages` → páginas da aplicação
- `src/services` → integração com API
- `src/assets` → imagens e arquivos estáticos

---

## 👨‍💻 Autor
**Matheus Pereira Gonsalves**  
Desenvolvedor Backend/Frontend • Node.js | TypeScript | React  
[🔗 LinkedIn](https://linkedin.com/in/matheuspgonsalves) • [💻 GitHub](https://github.com/Matheuspgonsalves)
