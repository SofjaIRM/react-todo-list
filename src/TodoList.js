import React, { useEffect, useState} from 'react';
import './TodoList.css';

function TodoList() {

  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState("hidden_alert");
  const [tasksDoneClassName, setTasksDoneClassName] = useState("show");
  const [buttonShowHide, setButtonShowHide] = useState("Hide finished tasks");
  const [taskEditing, setTaskEditing] = useState(-1);

  useEffect(() => getLocalTasks(), []);

  // add new task
  function handleSubmitForm(e){
    e.preventDefault()
    // check if task and date are filled
    if (currentTask && date !== ""){
      setTasks((prevState) => [...prevState, {
          text: currentTask,
          done: false,
          date,
          createdAt: new Date().getTime()
        }]
      )

      // restart input after add new task
      setCurrentTask("");
      setDate(new Date().toISOString().slice(0, 10));

      // hide alert messages
      setShowAlert("hidden");

      // save tasks locally
      setLocalTasks(tasks);
      //currentTask.focus()
    }
    // alert, task not filled
    if (currentTask === ""){
      setAlert("You must insert a task");
      setShowAlert("show_alert");
    }
    // alert, date no filled
    if(date === ""){
      setAlert("You must insert a date");
      setShowAlert("show_alert");
    }
  }

  // input name
  function handleInputTextChange(e){
    setCurrentTask(e.target.value);
  }
  // input date
  function handleInputDateChange(e){
    setDate(e.target.value);
  }

  // switch task (checked)
  const handleToggleDone = (index) => {
    setTasks((prevState) => {
      const newTasks = prevState.map((task, currentIndex) => (
        currentIndex === index ? { ...task, done: !task.done } : task
      ))
      setLocalTasks(tasks)
      return newTasks;
    })
  }

  // enable edit task
  function editToogle(taskIndex){
    setTaskEditing(taskEditing === taskIndex ? null : taskIndex);
  }
  // edit task input
  const handleChangeValue = (index, e) => {
    setTasks((prevState) => (
      prevState.map((task, currentIndex) => (
        currentIndex === index ? {...task, [e.target.id]: e.target.value} : task
      ))
    ))
    setLocalTasks(tasks);
  }

  // remove task (unchecked)
  function handleRemove(index){
    setTasks((prevState) => prevState
      .filter((_, currentIndex) => index !== currentIndex))
    setLocalTasks(tasks);
  }

  // show hide finished task
  function handleHideTasksDone(){
    if(tasksDoneClassName === "show"){
      setTasksDoneClassName('hidden');
      setButtonShowHide('Show finished tasks');
    } else {
      setTasksDoneClassName('show');
      setButtonShowHide('Hide finished tasks');
    }
  }
  // save tasks locally
  function setLocalTasks(tasks){
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }

  function getLocalTasks(){
    const localTasks = localStorage.getItem("tasks");
    localTasks !== null ? setTasks(JSON.parse(localTasks)) : setTasks([]);
  }

  return (
    <div className="TodoList">
      <div>
        <header><h1>Todo List</h1></header>
      </div>
      <div className="wrapper-input">
        <form onSubmit={handleSubmitForm}>
          <input
            type="text" name="currentTask"
            placeholder="Add a new task..."
            value={currentTask}
            onChange={handleInputTextChange}
            //ref={(el) => setCurrentTask(el.value)}
          />
          <input
            type="date"
            value={date}
            name="date"
            min={Date.now()}
            onChange={handleInputDateChange}
          />
          <button
            className="add-task"
            type="submit"
            value={currentTask}
          >
            Add Task
          </button>
        </form>
        <span className={showAlert}>{alert}</span>
      </div>
      <button className="showHide-done"
              onClick={handleHideTasksDone}>
              {buttonShowHide}
      </button>
      <div className="wrapper_tasks">
        <ul>
          {
            !!tasks?.length && tasks?.sort((a, b) => a.done - b.done)
            .map((item, index) => {
              const isEditing = taskEditing === index;

              return (
                <li key={"task" + index}
                    className={`${item.done ? "done " + tasksDoneClassName : "not_done"}`}>
                  <button
                    className={`far ${item.done ? "fa-check-square" : "fa-square"} fa-lg task-uncheck`}
                    onClick={(e) => handleToggleDone(index, e)}
                  />
                  {
                    (isEditing)
                      ? <>
                        <input
                          id="text"
                          onChange={(e) => handleChangeValue(index, e)}
                          value={tasks[index].text}
                        />
                        <input
                          id="date"
                          type="date"
                          onChange={(e) => handleChangeValue(index, e)}
                          value={tasks[index].date}
                        />
                      </>
                      : <>
                        <span>{item.text}</span>
                        <input type="date" readOnly={true} value={tasks[index].date}
                        />
                      </>
                  }
                  { !item.done && (
                    <button
                      className={(isEditing)
                        ? "fas fa-save fa-lg task-save"
                        : "fas fa-edit fa-lg task-edit"}
                      onClick={(e) => editToogle(index, e)}
                    />
                  )
                  }
                  <button
                    className="fas fa-trash-alt fa-lg task-delete"
                    onClick={(e) => handleRemove(index, e)}
                  />
                </li>
              )
          })}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
