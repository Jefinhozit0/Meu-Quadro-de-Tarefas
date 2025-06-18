from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

# --- Configuração do Aplicativo Flask ---
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- Modelo de Dados (Tabela do Banco de Dados) ---
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pending') # Ex: 'pending', 'inprogress', 'completed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.Date, nullable=True)
    priority = db.Column(db.String(20), default='medium')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'priority': self.priority
        }

# --- Rotas da API (Endpoints) ---

# Rota para servir a página HTML do frontend
@app.route('/')
def home():
    return render_template('index.html')

# Rota para obter todas as tarefas
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

# Rota para criar uma nova tarefa
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or 'title' not in data or not data['title'].strip():
        return jsonify({"error": "O campo 'title' é obrigatório"}), 400

    due_date_str = data.get('due_date')
    parsed_due_date = None
    if due_date_str:
        try:
            parsed_due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Formato de data de vencimento inválido. Use YYYY-MM-DD."}), 400

    new_task = Task(
        title=data['title'].strip(),
        description=data.get('description', '').strip(),
        status='pending', # Novas tarefas sempre começam como pendentes
        due_date=parsed_due_date,
        priority=data.get('priority', 'medium')
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

# Rota para obter uma tarefa específica por ID
@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = db.session.get(Task, task_id)
    if task is None:
        return jsonify({"error": "Tarefa não encontrada"}), 404
    return jsonify(task.to_dict())

# Rota para atualizar uma tarefa específica por ID
@app.route('/tasks/<int:task_id>', methods=['PUT', 'PATCH'])
def update_task(task_id):
    task = db.session.get(Task, task_id)
    if task is None:
        return jsonify({"error": "Tarefa não encontrada"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Nenhum dado fornecido para atualização"}), 400

    if 'title' in data:
        task.title = data['title'].strip()
    if 'description' in data:
        task.description = data['description'].strip()
    if 'status' in data:
        if data['status'] in ['pending', 'inprogress', 'completed']:
            task.status = data['status']
        else:
            return jsonify({"error": "Status inválido."}), 400
    if 'due_date' in data:
        due_date_str = data['due_date']
        if due_date_str:
            try:
                task.due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Formato de data de vencimento inválido. Use YYYY-MM-DD."}), 400
        else:
            task.due_date = None
    if 'priority' in data:
        task.priority = data['priority']
    
    db.session.commit()
    return jsonify(task.to_dict())

# Rota para deletar uma tarefa específica por ID
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = db.session.get(Task, task_id)
    if task is None:
        return jsonify({"error": "Tarefa não encontrada"}), 404

    db.session.delete(task)
    db.session.commit()
    return "", 204

# --- Execução do Aplicativo ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    print("Banco de dados SQLite 'tasks.db' criado/verificado.")
    print("Rodando o servidor Flask em http://127.0.0.1:5000")
    app.run(debug=True)