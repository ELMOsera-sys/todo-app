
import { useState,useEffect } from 'react';

function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  type Todo = {
    id: number|string;
    text: string;
    completed: boolean;
  };

  const iniTodo: Todo[] = [
    { id: 1, text: "Complete online JavaScript course", completed: true },
    { id: 2, text: "Jog around the park 3x", completed: false },
    { id: 3, text: "10 minutes meditation", completed: false },
    { id: 4, text: "Read for 1 hour", completed: false },
    { id: 5, text: "Pick up groceries", completed: false },
    { id: 6, text: "Complete Todo App on Frontend Mentor", completed: false },
  ];

  const [todos, setTodos] = useState<Todo[]>(() => {
     const saved = localStorage.getItem("todos");
     return saved ? (JSON.parse(saved) as Todo[]) : iniTodo;
});
  const [newTodo, setNewTodo] = useState<string>("");

  useEffect(() => {
  localStorage.setItem("todos", JSON.stringify(todos));
}, [todos]);

   const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const handleChecked=(id:(number|string)):void=>{
    setTodos(todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    }));
  }

  const handleDelete=(id:(number|string)):void=>{
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  type Filter = "all" | "active" | "completed";

  const [filter, setFilter] = useState<Filter>("all"); 

  const filteredTodos = todos.filter((todo) => {
  if (filter === "active") return !todo.completed;
  if (filter === "completed") return todo.completed;
  return true; 
});

const handleDeleteCompleted = ():void => {
  setTodos(todos.filter((todo) => !todo.completed));
};


  return (
    <>
      <main className={`${
  theme === "dark"
    ? "bg-[url(/images/bg-mobile-dark.jpg)] md:bg-[url(/images/bg-desktop-dark.jpg)]"
    : "bg-[url(/images/bg-mobile-light.jpg)] md:bg-[url(/images/bg-desktop-light.jpg)]"
} bg-no-repeat bg-cover bg-top h-50 md:h-60 flex flex-col gap-7` }>

        <div className='flex md:w-[70%] md:mx-auto justify-between items-center pt-10 px-5'>
          <h1 className="text-white text-3xl font-bold tracking-widest">TODO</h1>
          <button aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`${theme === "dark" ? 
            "  mask-[url(/images/icon-sun.svg)] " :" mask-[url(/images/icon-moon.svg)]"} 
            mask-contain mask-no-repeat mask-center
              size-8 md:size-12 bg-white cursor-pointer`}
          ></button>
        </div>

        <div className=" md:w-[70%] mx-auto ">
          <form className='flex justify-center items-center ' onSubmit={addTodo}>
            <label htmlFor="task" className='sr-only'>Task</label>
            <p className='bg-surface px-5 py-4 rounded-l-lg block'>
              <span className="inline-block size-4  shrink-0 
            rounded-full border border-(--border)
             cursor-pointer bg-surface"></span>
            </p>
            <input type="text" name="task" id="task" value={newTodo}
            placeholder='Create a todo...' onChange={e=>setNewTodo(e.target.value)}
            className='w-[70%] px-5 py-4  block 
            rounded-r-lg bg-surface text-todo-text focus:outline-none ' />
          </form>

          <div className='bg-surface w-[80%] md:w-[60%] mx-auto mt-6 shadow-md shadow-surface'>
            
            {
              filteredTodos.map(todo=>(
              <div key={todo.id} className='flex justify-between items-center rounded-lg px-5 py-4 border-b '>
              <input type="checkbox" onChange={handleChecked(todo.id)}
               id={todo.id.toString()} checked={todo.completed}
              className="appearance-none size-5 shrink-0 cursor-pointer rounded-full  border-2 border-gray-600 
                focus-visible:outline-2 focus-visible:outline-blue-500
                not-checked:hover:border-transparent 
                not-checked:hover:[background:linear-gradient(var(--surface),var(--surface))_padding-box,var(--check-gradient)_border-box]
                checked:border-transparent
                checked:bg-[url(/images/icon-check.svg),var(--check-gradient)] 
               checked:bg-no-repeat checked:bg-center checked:bg-origin-border "
               />
              <label htmlFor={todo.id.toString()} className={`${todo.completed ? "line-through text-gray-600 " : ""} mr-auto ml-4`}>{todo.text}</label>
              <button onClick={handleDelete.bind(todo.id)} aria-label={`Delete ${todo.text}`}
              className="mask-[url(/images/icon-cross.svg)] mask-contain mask-no-repeat 
              mask-center size-3 bg-gray-600 cursor-pointer"></button>
            </div>
              ))
            }

            <div className='flex justify-between items-center text-gray-600 rounded-lg px-5 py-4'>
              <p className='cursor-pointer hover:font-bold '>{todos.filter((todo) => !todo.completed).length} task left</p>

              <div className='bg-surface mx-auto mt-6 shadow-md shadow-surface
          flex justify-center gap-5 items-center rounded-lg px-5 py-4
           text-gray-600 max-md:hidden'>
                <button onClick={() => setFilter("all")} 
            className={`${filter === "all" ? " text-purple-400" : ""} cursor-pointer hover:font-bold`}>All</button>
                <button onClick={() => setFilter("active")}
              className={`${filter === "active" ? " text-purple-400" : ""} cursor-pointer hover:font-bold`}>Active</button>
                <button onClick={() => setFilter("completed")}
              className={`${filter === "completed" ? " text-purple-400" : ""} cursor-pointer hover:font-bold`}>Completed</button> 
              </div>
      
              <button onClick={handleDeleteCompleted} className='cursor-pointer hover:font-bold '>clear completed</button>
            </div>

          </div>


          <div className='bg-surface w-[80%] mx-auto mt-6 shadow-md shadow-surface
          flex justify-center gap-5 items-center rounded-lg px-5 py-4 text-gray-600 md:hidden'>
            <button onClick={() => setFilter("all")} 
            className={`${filter === "all" ? " text-blue-500" : ""} cursor-pointer hover:font-bold`}>All</button>
            <button onClick={() => setFilter("active")}
              className={`${filter === "active" ? " text-blue-500" : ""} cursor-pointer hover:font-bold`}>Active</button>
            <button onClick={() => setFilter("completed")}
              className={`${filter === "completed" ? " text-blue-500" : ""} cursor-pointer hover:font-bold`}>Completed</button> 
          </div>
        </div>

      </main>
    </>
  )
}

export default App
