✨ TaskFlow: A Glassmorphism To-Do List App
TaskFlow is a dynamic, front-end task manager built with vanilla HTML, CSS, and JavaScript. It features a stunning, responsive, glassmorphism-inspired UI and provides full CRUD functionality for tasks, complete with user authentication and data persistence using localStorage.

🚀 Features
User Authentication: Secure sign-up and login system to manage personal to-do lists.

Persistent Storage: All users and tasks are saved in the browser's localStorage, ensuring your data is available across sessions.

Full CRUD Functionality: Easily Create, Read, Update, and Delete your tasks.

Create: Add new tasks with names, descriptions, and due dates.

Read: View all tasks on a clean dashboard interface.

Update: Mark tasks as complete or flag them as important.

Delete: Remove tasks with a confirmation modal to prevent accidental deletion.

Smart Filtering: Organize and view your tasks with different filters:

Dashboard: See all your tasks at a glance.

Important: View only the tasks you've marked with a star.

Calendar: See tasks sorted by their due date.

Modern UI/UX: A beautiful glassmorphism design that is fully responsive and intuitive to use.

🛠️ Tech Stack
This project is built using only front-end technologies, making it lightweight and easy to deploy.

HTML5: For the structure and content of the web pages.

CSS3: For the glassmorphism styling, animations, and responsive design.

Vanilla JavaScript (ES6): For all the client-side logic, including DOM manipulation, event handling, routing, and localStorage management.

📂 Project Structure
The project is organized into separate files for clarity and maintainability.

.
├── 📄 index.html          # The main task dashboard
├── 📄 login.html          # The user login page
├── 📄 signup.html         # The user registration page
├── 📄 addtask.html        # The page for adding a new task
│
├── 🎨 style.css           # Styles for the dashboard (index.html)
├── 🎨 auth.css            # Styles for login & signup pages
├── 🎨 task-style.css      # Styles for the add task page
│
└── ⚙️ script.js           # Single JS file containing all application logic
🏁 Getting Started
To run this project locally, simply follow these steps. No complex setup is required!

Clone the repository:

Bash

git clone https://github.com/your-username/your-repo-name.git

Navigate to the project directory:

Bash

cd your-repo-name

Open in your browser: Open the signup.html or login.html file in your preferred web browser to begin. That's it!

💡 How It Works
The entire application logic is contained within script.js.

Authentication: When a user signs up, their credentials are stored in a users array in localStorage. A corresponding empty task list is also created for them. Logging in checks credentials against this stored data and sets a currentUser key.

Auth Guard: The script checks if a currentUser is set. If not, any attempts to access index.html or addtask.html are redirected to the login page.

Task Management: Tasks are stored in localStorage as an object where keys are usernames. All task operations (add, delete, update) modify this object and then re-render the task list on the dashboard.

Dynamic Rendering: The renderTasks function dynamically generates the HTML for the task list based on the current user and the selected filter ('dashboard', 'important', 'calendar').
