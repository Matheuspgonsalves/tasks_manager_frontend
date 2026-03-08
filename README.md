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

Para conectar com o backend, configure a URL da API no arquivo `.env`:

```env
VITE_API_URL="http://localhost:3000"
```

> Ajuste a porta conforme a sua API backend em execução.

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
