**Personal Task Manager Web Application**
A simple yet powerful task management web app that allows users to create, view, update, and delete tasks. Built with HTML, CSS, JavaScript for the frontend and Node.js, Express.js, MySQL for the backend, it provides a clean UI and persistent storage.

🚀 Features
Add tasks with title and description.
Edit existing tasks easily.
Delete tasks you no longer need.
Mark tasks as completed.
Data persistence using MySQL database.

🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MySQL

⚙️ Installation & Setup
Clone the repository
git clone https://github.com/Ujwalanerella/Personal_Task_Manager.git.git
cd <Personal_Task_Manager>

Install dependencies
npm install
Setup MySQL Database
Create a database in MySQL:
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending'
);
Update server.js with your MySQL username and password.

Run the server
npm start
Open in browser
http://localhost:3000