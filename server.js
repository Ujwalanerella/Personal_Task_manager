const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YOUR_ROOT_PASSWORD",
  database: "taskdb",
  port: 3307, 
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL");
});

// Your routes here
app.post("/tasks", (req, res) => {
  const { title, description, priority, status } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  db.query(
    "INSERT INTO tasks (title, description, priority, status) VALUES (?, ?, ?, ?)",
    [title, description || "", priority || "Medium", status || "Pending"],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: results.insertId, title, description, priority, status });
    }
  );
});



app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const { title, description, priority, status } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  db.query(
    "UPDATE tasks SET title=?, description=?, priority=?, status=? WHERE id=?",
    [title, description || "", priority || "Medium", status || "Pending", taskId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Task updated" });
    }
  );
});

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Delete a task by ID
app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  db.query("DELETE FROM tasks WHERE id = ?", [taskId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task deleted" });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
