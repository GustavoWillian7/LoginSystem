# Login System API

Documentação da API de sistema de login com autenticação JWT, segurança de senha utilizando hash com bcrypt e persistência de dados com mongoDB.

## Endpoints

### 1. Registro de Usuário
- **Endpoint**: `/users/register`
- **Método**: `POST`
- **Descrição**: Cria um novo usuário.
- **Tags**: Users
- **Corpo da Requisição**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "phone": "string"
  }

- **Respostas**:
- `200`: Usuário criado com sucesso.
- `422`: Erro de validação.

### 2. Autenticação de Usuário
- **Endpoint**: `/users/login`
- **Método**: `POST`
- **Descrição**: Autentica um usuário.
- **Tags**: Users
- **Corpo da Requisição**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
- **Respostas**:
  - `200`: Usuário criado com sucesso.
  - `422`: Erro de validação.

### 3. Verificação de Usuário
- **Endpoint**: `/users/checkuser`
- **Método**: `GET`
- **Descrição**: Verifica o usuário usando token.
- **Tags**: Users
- **Respostas**:
  - `200`: Usuário atual.

### 4. Obtenção de Informações do Usuário por ID
- **Endpoint**: `/users/{id}`
- **Método**: `GET`
- **Descrição**: Obtém informações do usuário por ID.
- **Tags**: Users
- **Parâmetros**:
  - `id` (path, obrigatório): ID do usuário.
- **Respostas**:
  - `200`: Informações do usuário.
  - `422`: Usuário não encontrado.

### 5. Edição de Informações do Usuário
- **Endpoint**: `/users/edit/{id}`
- **Método**: `PATCH`
- **Descrição**: Edita as informações do usuário.
- **Tags**: Users
- **Parâmetros**:
  - `id` (path, obrigatório): ID do usuário.
- **Corpo da Requisição**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "password": "string",
    "confirmpassword": "string",
    "image": "string (binary)"
  }
- **Respostas**:
  - `200`: Usuário atualizado com sucesso.
  - `422`: Erro de validação.

## Componentes

### Schemas

#### User
- **Tipo**: `object`
- **Propriedades**:
  - `name` (string): Nome do usuário.
  - `email` (string): Email do usuário.
  - `password` (string): Senha do usuário.
  - `phone` (string): Número de telefone do usuário.
- **Propriedades Obrigatórias**: `name`, `email`, `password`, `phone`.