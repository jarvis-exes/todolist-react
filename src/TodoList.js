import React, { useState, useEffect } from "react";
import { toastContainer, toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const TodoList = () => {
  //State Variables
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState("true");
  const [editTaskId, setEditTaskId] = useState(null);

  //Fetch initial data function call
  useEffect(() => {
    fetchTodos();
  }, []);

  //Fetch todo's from API
  const fetchTodos = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=6"
      );
      const todos = await response.json();
      setTasks(todos);
      setIsLoading(false);
    } catch (error) {
      console.log("Error Cant Fetch Todo items from API", error);
      setIsLoading(false);
    }
  };

  //Handle input function
  const handleInput = (event) => {
    setInputValue(event.target.value);
  };

  //Handle Add new task
  const handleAddTask = async () => {
    if (inputValue.trim() === "") {
      return;
    }

    const newTask = {
      title: inputValue,
      completed: false,
    };

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify(newTask),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const addedTask = await response.json();
      setTasks((prevTask) => [...prevTask, addedTask]);
      setInputValue("");
      toast.success("Task Added");
    } catch (error) {
      console.log("Error in Adding Task", error);
      toast.error("Error in Adding Task");
    }
  };

  //Handle checkbox for a task
  const handleTaskCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  //Handle Delete event
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    toast.success("Task Deleted");
  };

  //Handle Edit task
  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title);
  };

  //Handle Update task
  const handleUpdateTask = async () => {
    if (inputValue.trim() === "") return;

    const updatedTask = {
      title: inputValue,
      completed: false,
    };

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${editTaskId}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedTask),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const updatedTaskData = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId
            ? { ...task, title: updatedTaskData.title }
            : task
        )
      );
      setInputValue("");
      setEditTaskId(null);
      toast.success("Task Updated");
    } catch (error) {
      console.log("Error Updating Task:", error);
      toast.error("Error Updating Task");
    }
  };

  // Handle Mark all tasks as completed
  const handleCompleteAll = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
    );
  };

  // Handle Clear completed tasks
  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") {
      return true;
    } else if (filter === "completed") {
      return task.completed;
    } else if (filter === "uncompleted") {
      return !task.completed;
    }
    return true;
  });

  //Show Loading while fetching from API
  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  //Render the main Ui
  return (
    <div className="container">
      <ToastContainer />
      <div className="todo-app">
        <h2>
          <img
            src="https://cdn-icons-png.flaticon.com/128/7246/7246743.png"
            alt="Todo Logo"
          />
          Todo List
        </h2>
        <div className="row">
          <i className="fas fa-list-check"></i>
          <input
            type="text"
            className="add-task"
            id="add"
            placeholder="Add your todo"
            autoFocus
            value={inputValue}
            onChange={handleInput}
          />
          <button
            id="btn"
            onClick={editTaskId ? handleUpdateTask : handleAddTask}
          >
            {editTaskId ? "Update" : "Add"}
          </button>
        </div>

        <div className="filters">
          <div className="dropdown">
            <button className="dropbtn">Filter</button>
            <div className="dropdown-content">
              <a href="#" id="all" onClick={() => handleFilterChange("all")}>
                All
              </a>
              <a
                href="#"
                id="all"
                onClick={() => handleFilterChange("uncompleted")}
              >
                Pending
              </a>
              <a
                href="#"
                id="all"
                onClick={() => handleFilterChange("completed")}
              >
                Completed
              </a>
            </div>
          </div>
          <div className="completed-task">
            <p>
              Completed:{" "}
              <span id="c-count">
                {tasks.filter((task) => task.completed).length}
              </span>
            </p>
          </div>
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                Total Tasks: <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>

        <ul id="list">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                data-id={task.id}
                className="custom-checkbox"
                checked={task.completed}
                onChange={() => handleTaskCheckboxChange(task.id)}
              />
              <label htmlFor={`task-${task.id}`}>{task.title}</label>
              <div>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1057/1057097.png"
                  className="edit"
                  data-id={task.id}
                  onClick={() => handleEditTask(task.id)}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/6932/6932392.png"
                  className="delete"
                  data-id={task.id}
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mid">
          <p id="complete-all" onClick={handleCompleteAll}>
            Mark all as Completed
          </p>
          <p id="clear-all" onClick={handleClearCompleted}>
            Remove Marked
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
