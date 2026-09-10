# 📚 Gitbook

> **Plataforma colaborativa para escrita, versionamento e gerenciamento de livros baseada nos conceitos do Git.**

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)  
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)  
[![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)  
[![Maven](https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)](https://maven.apache.org/)  
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)  
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)  
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)  
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)  
[![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📖 Sobre o Projeto

O **Gitbook** é uma plataforma de escrita colaborativa desenvolvida para facilitar a criação, edição, revisão e gerenciamento de livros utilizando conceitos inspirados no **Git**.

Em processos tradicionais de escrita colaborativa, diferentes autores podem acabar trabalhando sobre a mesma versão de um documento, gerando problemas como:

- Conflitos entre alterações;
    
- Perda de versões anteriores;
    
- Dificuldade para identificar quem realizou determinada alteração;
    
- Falta de rastreabilidade;
    
- Processo manual de revisão e aprovação;
    
- Dificuldade para experimentar diferentes caminhos para a obra.
    

O Gitbook propõe uma abordagem diferente.

Cada escritor pode desenvolver sua própria versão de um livro utilizando uma **branch independente**, realizando alterações por meio de **commits**. Essas alterações podem posteriormente ser revisadas e integradas à versão principal pelo **Gestor**.

### 🎯 Proposta de Valor

> **Transformar a escrita colaborativa em um processo versionado, rastreável e organizado, utilizando conceitos familiares do desenvolvimento de software.**

A plataforma permite que diferentes pessoas trabalhem paralelamente em uma mesma obra, preservando o histórico das alterações e dando ao Gestor controle sobre quais mudanças serão incorporadas à versão final.

---

## ✨ Funcionalidades Principais

### 🌿 Versionamento com Branches

Cada escritor possui uma branch própria para desenvolver sua versão da obra.

Isso permite:

- Trabalho paralelo;
    
- Isolamento das alterações;
    
- Experimentação de diferentes versões;
    
- Preservação da versão principal;
    
- Redução de conflitos durante a escrita.
    

### 📝 Commits

Cada alteração relevante pode ser registrada como um commit.

Um commit permite identificar:

- Quem realizou a alteração;
    
- Quando a alteração foi realizada;
    
- Qual conteúdo foi modificado;
    
- Qual branch recebeu a alteração.
    

Exemplo conceitual:

```text
main
 │
 ├── commit: Criação do capítulo 1
 │
 ├── writer/joao
 │    ├── commit: Adiciona capítulo 2
 │    └── commit: Corrige capítulo 2
 │
 └── writer/maria
      ├── commit: Adiciona capítulo 3
      └── commit: Desenvolve personagem principal
```

### 🔀 Merge de Branches

Após finalizar seu trabalho, o escritor pode solicitar a integração de sua branch.

O **Gestor** analisa a proposta e pode:

- Aprovar o merge;
    
- Rejeitar o merge;
    
- Solicitar alterações antes da integração.
    

### 👀 Revisões e Sugestões

Revisores podem analisar o conteúdo e realizar sugestões de alterações e correções diretamente na produção.

As sugestões podem posteriormente ser avaliadas pelo Gestor.

### 🔐 Controle de Acesso

O sistema possui diferentes níveis de permissão de acordo com o papel do usuário.

A autenticação e autorização são implementadas utilizando **Spring Security + JWT**.

### 📜 Histórico de Alterações

O histórico de commits permite acompanhar a evolução da obra ao longo do tempo.

Isso proporciona maior:

- Rastreabilidade;
    
- Transparência;
    
- Segurança;
    
- Organização.
    

### 📚 Gerenciamento de Livros

A plataforma permite organizar o processo de desenvolvimento de uma obra desde sua criação até a consolidação da versão final.

---

## 👥 Atores / Papéis do Sistema

|Papel|Responsabilidades|Principais Permissões|
|---|---|---|
|👑 **Gestor**|Responsável pela versão final da obra|Criar/gerenciar livros, aprovar ou rejeitar merges, definir versão final e aceitar sugestões|
|✍️ **Escritor**|Desenvolve uma versão da obra|Criar branch, editar conteúdo e realizar commits|
|🔎 **Revisor**|Analisa e sugere melhorias|Visualizar produção e sugerir alterações/correções|

### 👑 Gestor

O Gestor possui a maior autoridade sobre o processo editorial.

Suas principais responsabilidades são:

- Definir a versão oficial da obra;
    
- Gerenciar o processo de integração;
    
- Aprovar merges;
    
- Rejeitar merges;
    
- Avaliar sugestões dos revisores;
    
- Aceitar ou rejeitar alterações propostas;
    
- Acompanhar o histórico do livro.
    

### ✍️ Escritor

O Escritor trabalha de forma independente em uma branch.

Seu fluxo normalmente consiste em:

1. Acessar o livro;
    
2. Criar ou utilizar sua branch;
    
3. Desenvolver alterações;
    
4. Criar commits;
    
5. Solicitar integração da branch.
    

### 🔎 Revisor

O Revisor atua na análise editorial.

Pode:

- Consultar a produção;
    
- Identificar problemas;
    
- Sugerir correções;
    
- Propor melhorias;
    
- Acompanhar o resultado das alterações.
    

---

## 🔄 Fluxo de Trabalho

O fluxo do Gitbook é inspirado diretamente no modelo de desenvolvimento baseado em Git.

```text
                    ┌─────────────────┐
                    │  Criar um Livro │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Versão Principal│
                    │      (main)     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
      ┌───────────────┐             ┌───────────────┐
      │ Branch João   │             │ Branch Maria  │
      └───────┬───────┘             └───────┬───────┘
              │                             │
              ▼                             ▼
       ┌────────────┐                ┌────────────┐
       │  Commits   │                │  Commits   │
       └──────┬─────┘                └──────┬─────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Solicitação de  │
                    │      Merge      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Gestor      │
                    │     Analisa     │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
              ┌──────────┐      ┌──────────┐
              │  Aceita  │      │ Rejeita  │
              └────┬─────┘      └────┬─────┘
                   │                 │
                   ▼                 ▼
             ┌───────────┐      ┌─────────────┐
             │ Merge na  │      │ Alterações  │
             │   main    │      │ necessárias │
             └─────┬─────┘      └─────────────┘
                   │
                   ▼
          ┌───────────────────┐
          │ Versão consolidada│
          └───────────────────┘
```

### 1. 📕 Criação do Livro

O Gestor cria um novo livro na plataforma.

O sistema estabelece a versão principal da obra:

```text
main
```

Essa branch representa a versão oficial do livro.

### 2. 🌿 Criação das Branches

Os escritores criam branches independentes para trabalhar.

Exemplo:

```text
main
├── writer/joao
├── writer/maria
└── writer/carlos
```

### 3. ✍️ Desenvolvimento

Cada escritor realiza suas alterações na própria branch.

Exemplo:

```text
writer/joao

commit 1 → Criar capítulo 2
commit 2 → Desenvolver personagem
commit 3 → Corrigir capítulo 2
```

### 4. 🔍 Revisão

Os Revisores analisam a produção e podem sugerir melhorias.

As sugestões ficam disponíveis para avaliação e posterior aplicação.

### 5. 🔀 Solicitação de Merge

Quando o Escritor considera sua versão pronta, solicita um merge para a branch principal.

```text
writer/joao
      │
      │ Merge Request
      ▼
     main
```

### 6. 👑 Avaliação do Gestor

O Gestor analisa as alterações.

Existem dois caminhos principais:

**Aprovação:**

```text
Branch do escritor
       │
       ▼
    Revisão
       │
       ▼
    Aprovado
       │
       ▼
   Merge → main
```

**Rejeição:**

```text
Branch do escritor
       │
       ▼
    Revisão
       │
       ▼
   Rejeitado
       │
       ▼
Escritor realiza ajustes
```

### 7. 📚 Consolidação

Após a aprovação, as alterações passam a fazer parte da versão principal.

A `main` representa sempre a versão consolidada da obra.

---

## 🏗️ Arquitetura da Aplicação

O projeto utiliza uma arquitetura separando responsabilidades entre frontend, backend e banco de dados.

```text
┌──────────────────────────────────────────┐
│                  CLIENTE                 │
│                                          │
│        React + TypeScript + Vite         │
│              / Next.js                   │
└────────────────────┬─────────────────────┘
                     │
                     │ HTTP / REST
                     ▼
┌──────────────────────────────────────────┐
│                 BACKEND                  │
│                                          │
│              Spring Boot                 │
│                                          │
│ ┌────────────┐ ┌──────────┐ ┌─────────┐ │
│ │ Controllers│ │ Services │ │ Security│ │
│ └────────────┘ └──────────┘ └─────────┘ │
│                       │                  │
│                  JWT / Auth              │
└───────────────────────┬──────────────────┘
                        │
                        │ JPA / Hibernate
                        ▼
┌──────────────────────────────────────────┐
│                DATABASE                  │
│                                          │
│               PostgreSQL                 │
└──────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias e Ferramentas

### Backend

|Tecnologia|Finalidade|
|---|---|
|![Java](https://img.shields.io/badge/Java-17+-ED8B00?logo=openjdk&logoColor=white)|Linguagem principal|
|![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot&logoColor=white)|Framework backend|
|![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-6DB33F?logo=springsecurity&logoColor=white)|Autenticação e autorização|
|![Maven](https://img.shields.io/badge/Maven-C71A36?logo=apachemaven&logoColor=white)|Gerenciamento de dependências e build|

### Frontend

|Tecnologia|Finalidade|
|---|---|
|![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)|Tipagem e desenvolvimento|
|![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)|Interface da aplicação|
|![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)|Build e desenvolvimento|
|![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)|Framework React, quando utilizado|

> **Nota:** Vite e Next.js representam alternativas para a camada frontend. A implementação definitiva deve utilizar uma delas como padrão do projeto.

### Banco de Dados

|Tecnologia|Finalidade|
|---|---|
|![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)|Persistência dos dados|
|![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)|Ambiente de execução e infraestrutura|

---

## 📁 Estrutura do Projeto

Uma possível organização do projeto é:

```text
gitbook/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/gitbook/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── model/
│   │   │   │       ├── dto/
│   │   │   │       ├── security/
│   │   │   │       └── config/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 🚀 Como Executar o Projeto

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de possuir as seguintes ferramentas instaladas:

- **Java 17 ou superior**
    
- **Maven 3.8+**
    
- **Node.js 18+**
    
- **npm ou Yarn**
    
- **Docker e Docker Compose**
    
- **PostgreSQL**, caso não seja utilizado via Docker
    
- **Git**
    

Verifique as versões:

```bash
java -version
mvn -version
node -v
npm -v
docker --version
git --version
```

---

## 🐘 Configurando o PostgreSQL

### Opção 1 — Docker

Caso o projeto possua um `docker-compose.yml`, execute:

```bash
docker compose up -d
```

Verifique os containers:

```bash
docker compose ps
```

Para visualizar os logs:

```bash
docker compose logs -f
```

### Opção 2 — PostgreSQL Local

Crie um banco de dados:

```sql
CREATE DATABASE gitbook;
```

Configure as credenciais no arquivo de configuração da aplicação.

Exemplo:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/gitbook
    username: postgres
    password: sua_senha
```

> **Importante:** não versione senhas ou outras credenciais reais no repositório. Prefira variáveis de ambiente ou arquivos locais não versionados.

---

# ☕ Executando o Backend

Entre no diretório do backend:

```bash
cd backend
```

Instale as dependências e compile o projeto:

```bash
mvn clean install
```

Execute a aplicação:

```bash
mvn spring-boot:run
```

Por padrão, a API estará disponível em:

```text
http://localhost:8080
```

### Executando os testes

```bash
mvn test
```

### Gerando o build

```bash
mvn clean package
```

O arquivo `.jar` será gerado no diretório:

```text
target/
```

Para executar diretamente:

```bash
java -jar target/*.jar
```

---

# ⚛️ Executando o Frontend

Entre no diretório:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível no endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

### Build de produção

```bash
npm run build
```

### Preview do build

```bash
npm run preview
```

---

# 🔐 Autenticação

O Gitbook utiliza **JWT (JSON Web Token)** para autenticação e autorização.

Fluxo simplificado:

```text
┌────────────┐
│   Usuário  │
└──────┬─────┘
       │
       │ Login
       ▼
┌──────────────┐
│ Spring Boot  │
└──────┬───────┘
       │
       │ JWT
       ▼
┌──────────────┐
│    Cliente   │
└──────┬───────┘
       │
       │ Authorization: Bearer <token>
       ▼
┌──────────────┐
│ API protegida│
└──────────────┘
```

As permissões são determinadas pelo papel associado ao usuário.

Exemplo:

```text
ROLE_GESTOR
ROLE_ESCRITOR
ROLE_REVISOR
```

---

# 🌿 Estratégia de Versionamento

O versionamento das obras segue conceitos semelhantes aos utilizados pelo Git.

### Branch principal

```text
main
```

Representa a versão oficial/consolidada do livro.

### Branches de escritores

```text
writer/<nome>
```

Exemplos:

```text
writer/joao
writer/maria
writer/carlos
```

### Commits

Os commits devem representar alterações objetivas.

Exemplos:

```text
feat: adiciona capítulo 3
fix: corrige inconsistências no capítulo 2
refactor: reorganiza estrutura do livro
docs: atualiza informações da obra
```

---

# 🧩 Modelo Conceitual

Uma possível relação entre as principais entidades é:

```text
                 ┌─────────────┐
                 │    User     │
                 └──────┬──────┘
                        │
             ┌──────────┼──────────┐
             │          │          │
             ▼          ▼          ▼
          Gestor     Escritor   Revisor
             │          │
             │          ▼
             │       Branch
             │          │
             │          ▼
             │        Commit
             │
             ▼
           Livro
             │
             ▼
       Versão Principal
```

Entidades que podem compor o domínio:

- `User`
    
- `Role`
    
- `Book`
    
- `Branch`
    
- `Commit`
    
- `MergeRequest`
    
- `Review`
    
- `Suggestion`
    
- `BookVersion`
    

---

# 🔌 API

A aplicação pode disponibilizar uma API REST organizada por recursos.

Exemplo conceitual:

|Método|Endpoint|Descrição|
|---|---|---|
|`POST`|`/api/auth/login`|Autenticação|
|`POST`|`/api/auth/register`|Cadastro|
|`GET`|`/api/books`|Lista livros|
|`POST`|`/api/books`|Cria livro|
|`GET`|`/api/books/{id}`|Consulta livro|
|`GET`|`/api/books/{id}/branches`|Lista branches|
|`POST`|`/api/books/{id}/branches`|Cria branch|
|`GET`|`/api/branches/{id}/commits`|Lista commits|
|`POST`|`/api/branches/{id}/commits`|Cria commit|
|`POST`|`/api/branches/{id}/merge`|Solicita merge|
|`PATCH`|`/api/merges/{id}/approve`|Aprova merge|
|`PATCH`|`/api/merges/{id}/reject`|Rejeita merge|
|`POST`|`/api/books/{id}/suggestions`|Cria sugestão|
|`PATCH`|`/api/suggestions/{id}`|Avalia sugestão|

> Os endpoints apresentados são uma referência arquitetural e devem ser ajustados de acordo com a implementação real da API.

---

# 🧪 Testes

O projeto deve possuir testes automatizados para garantir a confiabilidade das principais regras de negócio.

### Backend

Executar:

```bash
mvn test
```

Recomenda-se cobrir:

- Autenticação;
    
- Autorização;
    
- Criação de livros;
    
- Criação de branches;
    
- Commits;
    
- Solicitações de merge;
    
- Aprovação/rejeição;
    
- Sugestões dos revisores;
    
- Regras de permissão.
    

### Frontend

Executar, conforme os scripts definidos no projeto:

```bash
npm test
```

---

# 🐳 Docker

O projeto pode ser executado utilizando containers para padronizar o ambiente de desenvolvimento.

Exemplo:

```bash
docker compose up -d
```

Para interromper os serviços:

```bash
docker compose down
```

Para reconstruir as imagens:

```bash
docker compose up -d --build
```

---

# 🔒 Segurança

Algumas boas práticas recomendadas:

- Utilizar JWT com tempo de expiração adequado;
    
- Armazenar secrets em variáveis de ambiente;
    
- Nunca versionar senhas;
    
- Aplicar autorização no backend;
    
- Validar todas as entradas recebidas pela API;
    
- Utilizar HTTPS em ambientes de produção;
    
- Aplicar princípio do menor privilégio;
    
- Manter dependências atualizadas.
    

---

# 🤝 Contribuição

Contribuições são bem-vindas!

Para contribuir:

### 1. Faça um fork

```bash
git fork
```

Ou utilize a opção **Fork** disponível no GitHub.

### 2. Clone o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd gitbook
```

### 3. Crie uma branch

```bash
git checkout -b feature/minha-feature
```

### 4. Faça suas alterações

Implemente a funcionalidade ou correção.

### 5. Execute os testes

```bash
cd backend
mvn test
```

E, quando aplicável:

```bash
cd frontend
npm test
```

### 6. Faça o commit

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

### 7. Envie sua branch

```bash
git push origin feature/minha-feature
```

### 8. Abra um Pull Request

Descreva:

- O que foi alterado;
    
- Qual problema foi resolvido;
    
- Como testar;
    
- Possíveis impactos ou observações.
    

---

# 📐 Convenção de Commits

Recomenda-se utilizar **Conventional Commits**.

|Tipo|Uso|
|---|---|
|`feat`|Nova funcionalidade|
|`fix`|Correção de bug|
|`docs`|Documentação|
|`refactor`|Refatoração|
|`test`|Testes|
|`chore`|Manutenção|
|`style`|Alterações de estilo|
|`perf`|Melhoria de performance|

Exemplos:

```bash
git commit -m "feat: adiciona criação de branches"
```

```bash
git commit -m "fix: corrige validação de merge"
```

```bash
git commit -m "docs: atualiza documentação da API"
```

---

# 🗺️ Roadmap

Possíveis evoluções futuras:

-  Sistema completo de comentários;
    
-  Comparação visual entre versões;
    
-  Detecção automática de conflitos;
    
-  Histórico visual de alterações;
    
-  Notificações;
    
-  Sistema de permissões mais granular;
    
-  Busca dentro dos livros;
    
-  Exportação para PDF/ePub;
    
-  Dashboard de gerenciamento;
    
-  Colaboração em tempo real;
    
-  Auditoria completa de alterações;
    
-  Integração com serviços externos de armazenamento.
    

---

# 📄 Licença

Este projeto está disponível sob a licença definida no arquivo [`LICENSE`](https://chatgpt.com/c/LICENSE).

Caso o arquivo de licença ainda não exista, recomenda-se definir uma licença antes de publicar o projeto em produção ou disponibilizá-lo publicamente.

---

# 👨‍💻 Desenvolvimento

O **Gitbook** foi concebido como uma plataforma que aproxima os processos de **engenharia de software** e **produção editorial**, aplicando conceitos como:

```text
Git
 │
 ├── Branches
 ├── Commits
 ├── Merge
 ├── Histórico
 └── Controle de acesso
          │
          ▼
     ┌───────────┐
     │  Gitbook  │
     └───────────┘
          │
          ▼
     Produção
      Literária
```

A ideia central é permitir que a escrita colaborativa tenha a mesma rastreabilidade e flexibilidade encontrada em fluxos modernos de desenvolvimento de software.

---