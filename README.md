# Vistoria Uploads

Aplicacao web para organizar uploads de arquivos de vistoria diretamente no Google Drive. O usuario faz login com a conta Google, informa os dados da vistoria e envia arquivos pelo frontend. O backend cria ou reutiliza a estrutura de pastas no Drive e salva os arquivos no local correto.

## Tecnologias

- React
- Vite
- Bootstrap
- React Hook Form
- Express
- Multer
- Google APIs

## Estrutura

```txt
vistoria-uploads/
+-- backend/
|   +-- src/
|   |   +-- config/
|   |   +-- controllers/
|   |   +-- middlewares/
|   |   +-- routes/
|   |   +-- services/
|   +-- package.json
+-- frontend/
|   +-- src/
|   +-- package.json
+-- README.md
```

## Funcionalidades

- Login com Google OAuth.
- Upload de multiplos arquivos.
- Criacao automatica de pastas no Google Drive.
- Organizacao por cidade, local e item.
- Reutilizacao de pastas ja existentes quando encontradas pela API.
- Cache em memoria para reduzir buscas repetidas de ids de pastas durante a execucao do backend.

## Fluxo de pastas no Drive

O backend organiza os arquivos nesta estrutura:

```txt
Vistorias Tecnicas/
+-- Cidade/
    +-- Local/
        +-- Item/
            +-- arquivos enviados
```

A pasta raiz usada pelo projeto e `Vistorias Tecnicas`.

## Configuracao

### Frontend

Crie o arquivo `frontend/.env` com o client id do Google:

```env
VITE_GOOGLE_CLIENT_ID=seu_client_id_google
```

Esse client id deve estar configurado no Google Cloud Console para aceitar a origem do Vite em desenvolvimento:

```txt
http://localhost:5173
```

### Backend

Crie o arquivo `backend/.env`:

```env
PORT=3000
```

O backend recebe o `access_token` enviado pelo frontend no header `Authorization` e usa esse token para acessar a API do Google Drive.

## Escopos Google

O frontend solicita permissoes para acessar o Drive e identificar o email do usuario:

```txt
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/userinfo.email
```

O email e usado pelo backend para separar o cache de pastas por usuario.

## Como rodar

Instale as dependencias do backend:

```bash
cd backend
npm install
```

Inicie o backend:

```bash
npm run dev
```

Em outro terminal, instale as dependencias do frontend:

```bash
cd frontend
npm install
```

Inicie o frontend:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:5173
```

## Endpoint principal

```http
POST /upload
```

Campos enviados via `multipart/form-data`:

- `cidade`
- `local`
- `item`
- `arquivos`

Header esperado:

```http
Authorization: Bearer access_token_google
```

## Observacoes

- O Google Drive permite pastas com nomes duplicados. O projeto busca uma pasta existente pelo nome antes de criar outra.
- Pastas na lixeira sao ignoradas pela busca, pois a query usa `trashed = false`.
- O cache atual fica apenas em memoria. Ao reiniciar o backend, ele sera recriado conforme novos uploads forem feitos.
