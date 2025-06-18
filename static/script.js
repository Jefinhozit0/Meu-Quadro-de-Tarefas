document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:5000/tasks';

    // --- SEÇÃO: CONTROLE DE TEMA ---
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleButton.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleButton.textContent = '🌙';
        }
    };

    const currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);

    themeToggleButton.addEventListener('click', () => {
        let newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- SELETORES DE ELEMENTOS ---
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const closeModalBtn = document.querySelector('.close-modal');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskForm = document.getElementById('task-form');
    const taskIdInput = document.getElementById('task-id');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskPriorityInput = document.getElementById('task-priority');
    const deleteTaskBtn = document.getElementById('delete-task-btn');

    const taskColumns = {
        pending: document.getElementById('pending-tasks'),
        inprogress: document.getElementById('inprogress-tasks'),
        completed: document.getElementById('completed-tasks')
    };

    const searchInput = document.getElementById('search-input');
    const priorityFilters = document.querySelectorAll('.filter-btn[data-priority]');
    
    let currentTasks = [];
    let currentPriorityFilter = 'all';

    // --- FUNÇÕES DO MODAL ---
    const openModal = (task = null) => {
        taskForm.reset();
        if (task) {
            modalTitle.textContent = 'Editar Tarefa';
            taskIdInput.value = task.id;
            taskTitleInput.value = task.title;
            taskDescriptionInput.value = task.description || '';
            taskDueDateInput.value = task.due_date ? task.due_date.split('T')[0] : '';
            taskPriorityInput.value = task.priority || 'medium';
            deleteTaskBtn.style.display = 'block';
        } else {
            modalTitle.textContent = 'Adicionar Nova Tarefa';
            taskIdInput.value = '';
            deleteTaskBtn.style.display = 'none';
        }
        modal.classList.add('visible');
    };

    const closeModal = () => {
        modal.classList.remove('visible');
    };

    addTaskBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- FUNÇÃO AUXILIAR PARA DATAS ---
    const getDueDateInfo = (dueDateString) => {
        if (!dueDateString) {
            return { text: '', cssClass: '' };
        }
        const today = new Date();
        const dueDate = new Date(dueDateString + 'T00:00:00');
        today.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: 'Atrasado', cssClass: 'overdue' };
        }
        if (diffDays === 0) {
            return { text: 'Vence Hoje', cssClass: 'due-today' };
        }
        if (diffDays === 1) {
            return { text: 'Vence Amanhã', cssClass: 'due-soon' };
        }
        return { text: `Vence em ${dueDate.toLocaleDateString('pt-BR')}`, cssClass: 'due-future' };
    };

    // --- RENDERIZAÇÃO DAS TAREFAS ---
    const createTaskCard = (task) => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.dataset.taskId = task.id;
        
        let dueDateHtml = '';
        // *** ESTA É A MUDANÇA PRINCIPAL ***
        // Só exibe a informação de prazo se a tarefa NÃO estiver concluída.
        if (task.status !== 'completed') {
            const dueDateInfo = getDueDateInfo(task.due_date);
            if (dueDateInfo.text) {
                dueDateHtml = `<span class="due-date ${dueDateInfo.cssClass}">📅 ${dueDateInfo.text}</span>`;
            }
        }

        card.innerHTML = `
            <h3 class="task-title">${task.title}</h3>
            <div class="task-meta">
                ${dueDateHtml}
                <span class="priority-badge ${task.priority}">${task.priority}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            const taskDetails = currentTasks.find(t => t.id == task.id);
            if(taskDetails) openModal(taskDetails);
        });

        return card;
    };

    const renderTasks = () => {
        Object.values(taskColumns).forEach(column => column.innerHTML = '');
        
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = currentTasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm);
            const matchesPriority = currentPriorityFilter === 'all' || task.priority === currentPriorityFilter;
            return matchesSearch && matchesPriority;
        });

        filteredTasks.forEach(task => {
            const column = taskColumns[task.status];
            if (column) {
                const taskCard = createTaskCard(task);
                column.appendChild(taskCard);
            }
        });
    };

    // --- LÓGICA DA API (CRUD) ---
    const fetchAllTasks = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Erro na rede ao buscar tarefas.');
            currentTasks = await response.json();
            renderTasks();
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            alert('Não foi possível carregar as tarefas.');
        }
    };

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = taskIdInput.value;
        if (!taskTitleInput.value.trim()) {
            alert('O título da tarefa é obrigatório.');
            return;
        }
        const taskData = {
            title: taskTitleInput.value.trim(),
            description: taskDescriptionInput.value.trim(),
            due_date: taskDueDateInput.value || null,
            priority: taskPriorityInput.value,
        };
        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PUT' : 'POST';
        if (id) {
            const existingTask = currentTasks.find(t => t.id == id);
            taskData.status = existingTask.status;
        }
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskData) });
            if (!response.ok) throw new Error('Falha ao salvar a tarefa.');
            await fetchAllTasks();
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error);
            alert('Não foi possível salvar a tarefa.');
        }
    });

    deleteTaskBtn.addEventListener('click', async () => {
        const id = taskIdInput.value;
        if (!id || !confirm('Tem certeza que deseja excluir esta tarefa?')) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Falha ao excluir a tarefa.');
            await fetchAllTasks();
            closeModal();
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            alert('Não foi possível excluir a tarefa.');
        }
    });

    // --- FILTROS ---
    searchInput.addEventListener('input', renderTasks);
    priorityFilters.forEach(button => {
        button.addEventListener('click', () => {
            priorityFilters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentPriorityFilter = button.dataset.priority;
            renderTasks();
        });
    });

    // --- DRAG AND DROP ---
    Object.keys(taskColumns).forEach(status => {
        new Sortable(taskColumns[status], {
            group: 'kanban',
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: async (evt) => {
                const taskId = evt.item.dataset.taskId;
                const newStatus = evt.to.parentElement.dataset.status;
                const task = currentTasks.find(t => t.id == taskId);
                if (task && task.status !== newStatus) {
                    task.status = newStatus;
                    renderTasks();
                    try {
                        await fetch(`${API_URL}/${taskId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: newStatus })
                        });
                    } catch (error) {
                        console.error('Erro ao atualizar status:', error);
                        fetchAllTasks(); 
                        alert('Não foi possível atualizar o status da tarefa.');
                    }
                }
            },
        });
    });

    // --- INICIALIZAÇÃO ---
    fetchAllTasks();
});