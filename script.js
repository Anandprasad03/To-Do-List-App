// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTIONS ---
    // These functions help get and save data from localStorage.
    const getFromStorage = (key, defaultValue) => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    };

    const saveToStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    // --- PAGE-SPECIFIC LOGIC ---
    // We determine which page is currently active by checking its filename.
    const currentPage = window.location.pathname.split("/").pop();

    // --- AUTHENTICATION GUARD ---
    // If the user tries to access the main app or add task page without being logged in, redirect them to the login page.
    const currentUser = getFromStorage('currentUser', null);
    if ((currentPage === 'index.html' || currentPage === 'addtask.html') && !currentUser) {
        window.location.href = 'login.html';
        return; // Stop script execution if not logged in
    }


    // --- SIGN UP PAGE LOGIC (signup.html) ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent form from submitting the default way

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = getFromStorage('users', []);

            // Check if username already exists
            const userExists = users.some(user => user.username === username);

            if (userExists) {
                alert('Username already taken. Please choose another one.');
            } else {
                users.push({ username, email, password });
                saveToStorage('users', users);
                // Automatically create an empty task list for the new user
                const tasks = getFromStorage('tasks', {});
                tasks[username] = [];
                saveToStorage('tasks', tasks);

                alert('Sign up successful! Please log in.');
                window.location.href = 'login.html';
            }
        });
    }


    // --- LOGIN PAGE LOGIC (login.html) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const users = getFromStorage('users', []);
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                saveToStorage('currentUser', user.username);
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password.');
            }
        });
    }

    // --- DASHBOARD PAGE LOGIC (index.html) ---
    if (currentPage === 'index.html' && currentUser) {
        const users = getFromStorage('users', []);
        const user = users.find(u => u.username === currentUser);
        let currentFilter = 'dashboard'; // 'dashboard', 'calendar', 'important'

        // Display user's name and email
        const displayName = document.getElementById('displayName');
        const displayEmail = document.querySelector('.emailname');
        if (user) {
            if (displayName) displayName.textContent = user.username;
            if (displayEmail) displayEmail.textContent = user.email;
        }

        const tasksContainer = document.getElementById('tasksContainer');
        const menuLinks = document.querySelectorAll('.menu a');

        const renderTasks = () => {
            tasksContainer.innerHTML = ''; // Clear existing tasks
            const allTasks = getFromStorage('tasks', {});
            let userTasks = allTasks[currentUser] || [];
            let filteredTasks = [];

            // Filter tasks based on the current view
            if (currentFilter === 'dashboard') {
                filteredTasks = userTasks;
            } else if (currentFilter === 'important') {
                filteredTasks = userTasks.filter(task => task.important);
            } else if (currentFilter === 'calendar') {
                filteredTasks = userTasks.filter(task => task.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            }


            if (filteredTasks.length === 0) {
                let message = "You have no tasks yet. Add one to get started!";
                if (currentFilter === 'important') message = "You have no important tasks.";
                if (currentFilter === 'calendar') message = "No tasks with a due date.";
                tasksContainer.innerHTML = `<p class="no-tasks-message">${message}</p>`;
                return;
            }

            filteredTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                if (task.completed) {
                    taskElement.classList.add('completed');
                }

                const uniqueId = `task-${task.id}`;

                taskElement.innerHTML = `
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="${uniqueId}" class="input" ${task.completed ? 'checked' : ''}>
                        <label for="${uniqueId}" class="checkbox" title="Mark as done">
                            <svg width="18" height="18" viewBox="0 0 18 18">
                                <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                                <polyline points="1 9 7 14 15 4"></polyline>
                            </svg>
                        </label>
                        <label for="${uniqueId}" class="label">${task.name} ${task.dueDate ? `<span class="due-date">(${task.dueDate})</span>` : ''}</label>
                    </div>
                    <div class="task-actions">
                        <button class="star-btn ${task.important ? 'active' : ''}" title="Mark as important">${task.important ? '★' : '☆'}</button>
                        <button class="delete-btn" title="Delete task">🗑</button>
                    </div>
                `;

                taskElement.querySelector('.input').addEventListener('change', () => toggleTaskCompletion(task.id));
                taskElement.querySelector('.delete-btn').addEventListener('click', () => showDeleteConfirmModal(task.id));
                taskElement.querySelector('.star-btn').addEventListener('click', () => toggleTaskImportance(task.id));

                tasksContainer.appendChild(taskElement);
            });
        };

        const toggleTaskCompletion = (taskId) => {
            const allTasks = getFromStorage('tasks', {});
            const task = allTasks[currentUser].find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                saveToStorage('tasks', allTasks);
                renderTasks();
            }
        };

        const toggleTaskImportance = (taskId) => {
            const allTasks = getFromStorage('tasks', {});
            const task = allTasks[currentUser].find(t => t.id === taskId);
            if (task) {
                task.important = !task.important;
                saveToStorage('tasks', allTasks);
                renderTasks();
            }
        };

        const deleteTask = (taskId) => {
            const allTasks = getFromStorage('tasks', {});
            allTasks[currentUser] = allTasks[currentUser].filter(t => t.id !== taskId);
            saveToStorage('tasks', allTasks);
            renderTasks();
        };

        // --- CUSTOM CONFIRM MODAL for Deletion ---
        const showDeleteConfirmModal = (taskId) => {
            // Create modal elements
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';

            modalContent.innerHTML = `
                <h3 style="margin-bottom: 15px;">Confirm Deletion</h3>
                <p style="margin-bottom: 25px; opacity: 0.8;">Are you sure you want to delete this task?</p>
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button class="cancel-btn">Cancel</button>
                    <button class="save-btn">Delete</button>
                </div>
            `;

            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            // Show the modal
            modalOverlay.style.display = 'flex';

            // Event listeners for modal buttons
            modalContent.querySelector('.save-btn').onclick = () => {
                deleteTask(taskId);
                document.body.removeChild(modalOverlay);
            };

            const closeModal = () => document.body.removeChild(modalOverlay);
            modalContent.querySelector('.cancel-btn').onclick = closeModal;
            modalOverlay.onclick = (e) => {
                if (e.target === modalOverlay) closeModal();
            };
        };

        // --- SIDEBAR NAVIGATION ---
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't do anything for settings or logout
                const linkText = e.target.textContent.toLowerCase();
                if (linkText.includes('settings') || linkText.includes('logout')) return;

                e.preventDefault();
                menuLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                if (linkText.includes('dashboard')) currentFilter = 'dashboard';
                else if (linkText.includes('calendar')) currentFilter = 'calendar';
                else if (linkText.includes('important')) currentFilter = 'important';

                renderTasks();
            });
        });

        // Initial render of tasks
        renderTasks();

        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });

        // Add Task button
        document.getElementById('addTaskBtn')?.addEventListener('click', () => {
            window.location.href = 'addtask.html';
        });
    }


    // --- ADD TASK PAGE LOGIC (addtask.html) ---
    const addTaskForm = document.getElementById('addTaskForm');
    if (addTaskForm && currentUser) {
        addTaskForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const taskName = document.getElementById('taskName').value;
            const taskDescription = document.getElementById('taskDescription').value;
            const dueDate = document.getElementById('dueDate').value;

            if (!taskName) {
                alert('Task name is required.');
                return;
            }

            const newTask = {
                id: Date.now(), // Use timestamp for a unique ID
                name: taskName,
                description: taskDescription,
                dueDate: dueDate,
                completed: false,
                important: false
            };

            const allTasks = getFromStorage('tasks', {});
            if (!allTasks[currentUser]) {
                allTasks[currentUser] = [];
            }
            allTasks[currentUser].push(newTask);
            saveToStorage('tasks', allTasks);

            window.location.href = 'index.html';
        });
    }
});

