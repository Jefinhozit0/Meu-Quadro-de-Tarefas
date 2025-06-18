# Gerenciador de Tarefas Estilo Kanban

![Badge de Licença](https://img.shields.io/badge/license-MIT-blue.svg)

Um gerenciador de tarefas full-stack com uma interface moderna de quadro Kanban, construído com Flask para o back-end e JavaScript puro para o front-end.

## Demonstração Visual



![Imagem da Aplicação](../task_manager_web/static/imagem.png)

## Funcionalidades

-   **Quadro Kanban:** Organize tarefas em três colunas: "Pendente", "Em Andamento" e "Concluída".
-   **Arrastar e Soltar (Drag and Drop):** Mude o status de uma tarefa de forma intuitiva, arrastando-a entre as colunas.
-   **CRUD Completo de Tarefas:** Crie, edite e exclua tarefas através de um modal moderno.
-   **Prioridades e Prazos:** Atribua níveis de prioridade (baixa, média, alta) e datas de vencimento para cada tarefa.
-   **Indicadores de Prazo Inteligentes:** A interface exibe visualmente se uma tarefa está **Atrasada**, **Vence Hoje** ou **Vence Amanhã**.
-   **Interface Limpa:** Prazos são automaticamente ocultados para tarefas na coluna "Concluída".
-   **Busca e Filtro:** Pesquise tarefas por título e filtre a visualização por nível de prioridade.
-   **Tema Escuro (Dark Mode):** Alterne entre os temas claro e escuro para melhor conforto visual. A preferência é salva no navegador.
-   **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela.

## Tecnologias Utilizadas

#### **Back-end**

-   **Python 3**
-   **Flask:** Microframework web para a criação da API.
-   **Flask-SQLAlchemy:** ORM para interação com o banco de dados.
-   **SQLite:** Banco de dados relacional leve baseado em arquivo.

#### **Front-end**

-   **HTML5**
-   **CSS3:** (Variáveis CSS, Flexbox, Grid)
-   **JavaScript (ES6+):** Manipulação do DOM e lógica da interface.
-   **Sortable.js:** Biblioteca para a funcionalidade de arrastar e soltar.

## Como Executar o Projeto

Siga os passos abaixo para executar o projeto em sua máquina local.

### Pré-requisitos

-   Python 3.8 ou superior
-   `pip` (gerenciador de pacotes do Python)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Jefinhozit0/Meu-Quadro-de-Tarefas.git](https://github.com/Jefinhozit0/Meu-Quadro-de-Tarefas.git)
    cd nome-do-repositorio
    ```

2.  **Crie e ative um ambiente virtual:**
    ```bash
    # Para Windows
    python -m venv .venv
    .\.venv\Scripts\activate

    # Para macOS/Linux
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Instale as dependências:**
    O arquivo `requirements.txt` contém todas as bibliotecas Python necessárias.
    ```bash
    pip install -r requirements.txt
    ```

4.  **Execute o servidor Flask:**
    ```bash
    python app.py
    ```
    O servidor será iniciado em modo de depuração.

5.  **Acesse a aplicação:**
    Abra seu navegador e acesse [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Estrutura de Arquivos

```
.
├── static/
│   ├── style.css
│   └── script.js
├── templates/
│   └── index.html
├── .venv/
├── app.py
├── requirements.txt
├── tasks.db
└── README.md
```

## Endpoints da API

-   `GET /tasks`: Retorna todas as tarefas.
-   `POST /tasks`: Cria uma nova tarefa.
-   `GET /tasks/<id>`: Retorna uma tarefa específica.
-   `PUT / PATCH /tasks/<id>`: Atualiza uma tarefa existente.
-   `DELETE /tasks/<id>`: Deleta uma tarefa.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

**[Seu Nome]**

-   GitHub: [@Jefinhozito0](https://github.com/Jefinhozito0)
-   LinkedIn: [Jefferson Silva](www.linkedin.com/in/jefferson-silva-de-almeida)