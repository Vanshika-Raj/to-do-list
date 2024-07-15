document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    const pendingTasksList = document.getElementById('pending-tasks');
    const completedTasksList = document.getElementById('completed-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = () => {
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.dataset.id = task.id;
            li.innerHTML = `
                <span>${task.text}</span>
                <div class="actions">
                    <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            if (task.completed) {
                completedTasksList.appendChild(li);
            } else {
                pendingTasksList.appendChild(li);
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const addTask = (text) => {
        const task = {
            id: Date.now(),
            text,
            completed: false,
        };
        tasks.push(task);
        renderTasks();
    };

    const completeTask = (id) => {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        renderTasks();
    };

    const editTask = (id) => {
        const newText = prompt('Edit task:');
        if (newText) {
            tasks = tasks.map(task =>
                task.id === id ? { ...task, text: newText } : task
            );
            renderTasks();
        }
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    };

    addTaskBtn.addEventListener('click', () => {
        const text = newTaskInput.value.trim();
        if (text) {
            addTask(text);
            newTaskInput.value = '';
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('complete-btn')) {
            const id = parseInt(e.target.closest('li').dataset.id, 10);
            completeTask(id);
        } else if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.closest('li').dataset.id, 10);
            editTask(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.closest('li').dataset.id, 10);
            deleteTask(id);
        }
    });

    renderTasks();
});
