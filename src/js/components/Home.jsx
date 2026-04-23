import React, { useState, useEffect } from "react";

const USERNAME = "Mauricio Sabelli";
const BASE_URL = "https://playground.4geeks.com/todo";

const Home = () => {
    const [input, setInput] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Crear usuario y cargar tareas al iniciar
    useEffect(() => {
        createUserAndLoad();
    }, []);

    const createUserAndLoad = async () => {
        // Intentamos crear el usuario (si ya existe, no pasa nada)
        await fetch(`${BASE_URL}/users/${USERNAME}`, { method: "POST" });
        // Luego cargamos las tareas
        fetchTodos();
    };

    const fetchTodos = async () => {
        const resp = await fetch(`${BASE_URL}/todos/${USERNAME}`);
        const data = await resp.json();
        setTodoList(data.todos || []);
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            if (input.trim() !== "") {
                await fetch(`${BASE_URL}/todos/${USERNAME}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ label: input, is_done: false })
                });
                setInput("");
                fetchTodos();
            } else {
                alert("El campo no puede estar vacío");
            }
        }
    };

    const handleDelete = async (id) => {
        await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
        fetchTodos();
    };

    const handleClearAll = async () => {
        await fetch(`${BASE_URL}/users/${USERNAME}`, { method: "DELETE" });
        // Recreamos el usuario vacío
        await fetch(`${BASE_URL}/users/${USERNAME}`, { method: "POST" });
        setTodoList([]);
    };

    return (
        <div className="container-fluid row m-0 p-0">
            <div className="col-sm-12 col-md-9 col-lg-6 align-content-center m-auto">
                <p className="fs-3 mt-2">Agregar tarea</p>
                <div className="d-flex">
                    <input
                        value={input}
                        className="form-control"
                        type="text"
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe la tarea y pulsa enter para añadirla a la lista"
                    />
                </div>
                <ul className="list-group">
                    <div>
                        <p className="fs-3 mt-4">Lista de Tareas</p>
                    </div>

                    {todoList.length === 0 ? (
                        <p className="text-muted text-center mt-2">
                            No hay tareas pendientes
                        </p>
                    ) : (
                        todoList.map((todo, i) => (
                            <li
                                className="list-group-item d-flex justify-content-between align-items-center shadow-sm"
                                key={todo.id}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {todo.label}
                                <div style={{ visibility: hoveredIndex === i ? "visible" : "hidden" }}>
                                    <button onClick={() => handleDelete(todo.id)} className="delete">
                                        X
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>

                {todoList.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center m-3">
                        <p className="text-muted m-0">
                            {todoList.length === 1 ? "1 tarea pendiente" : `${todoList.length} tareas pendientes`}
                        </p>
                        <button onClick={handleClearAll} className="btn btn-outline-danger btn-sm">
                            Limpiar todo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;