//
// npx create-react-app my-app
// cd my-app
// npm start
//
//rafce <<<<______USE THIS TO GENERATE ARROW FUNCTIONS E7 addon
//
//npm install react-icons
//npm i react-router-dom
//Using Json server: npm run server

import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useState, useEffect } from "react";

const apiUrl = "http://localhost:5000/tasks";
function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []);

  //Fetch all tasks
  const fetchTasks = async () => {
    const res = await fetch(apiUrl);
    const data = await res.json();
    console.log(data);
    return data;
  };

  //Fetch one task
  const fetchSingleTask = async (id) => {
    const res = await fetch(apiUrl + `/${id}`);
    const data = await res.json();
    console.log(data);
    return data;
  };

  const [showAddTask, setShowAddTask] = useState(false);

  const addTask = async (task) => {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    console.log(data);
    setTasks([...tasks, data]);
  };

  const deleteTask = async (id) => {
    await fetch(apiUrl + `/${id}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleReminder = async (id) => {
    console.log(id);
    const taskToToggle = await fetchSingleTask(id);
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
    const res = await fetch(apiUrl + `/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTask),
    });
    const data = await res.json();

    console.log(id);
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />

        <Routes>
          <Route
            path="/"
            exact
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  "No Tasks to show"
                )}
              </>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>

        <Footer />
      </div>
      |
    </Router>
  );
}

export default App;
