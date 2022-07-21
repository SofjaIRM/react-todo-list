import React, { Component } from 'react';
import './TodoList.css';

class TodoList extends Component {
  constructor(props){
    super(props);
    this.state = {
      tasks:[],
      tasksDone:[],
      currentTask: "",
      done: false,
      date: new Date().toISOString().slice(0, 10),
      alert: "",
      show_alert: "hidden_alert",
      tasksDoneClassName: 'show',
      buttonShowHide: "Hide finished tasks",
      taskEditing: -1
    };

    this.handleInputTextChange = this.handleInputTextChange.bind(this);
    this.handleInputDateChange = this.handleInputDateChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleHideTasksDone = this.handleHideTasksDone.bind(this);
  };

  componentWillMount (){
    this.getLocalTasks();
    this.getLocalDone()
  }
  componentDidMount (){
    this.currentTask.focus()
  }

  shouldComponentUpdate (){
    return true;
  }

  // add new task
  handleSubmitForm(e){
    e.preventDefault()
    // check if task and date are filled
    if(this.state.currentTask && this.state.date !== ""){
      this.state.tasks.push({
        text: this.state.currentTask,
        date: this.state.date,
        done: this.state.done === "not_done" ? true : false,
      })

      // restart input after add new task
      this.setState({
        tasks: this.state.tasks,
        currentTask: "",
        date: ""
      })
      // hide alert messages
      this.setState({
        show_alert: "hidden"
      })
      // save tasks locally
      this.setLocalTasks(this.state.tasks)
      this.currentTask.focus()
    }
    // alert, task not filled
    else if(this.state.currentTask === ""){
      this.setState({
        alert: "You must insert a task",
        show_alert: "show_alert"
      })
    }
    // alert, date no filled
    else if(this.state.currentTask !== ""){
      this.setState({
        alert: "You must insert a date",
        show_alert: "show_alert"
      })
    }
  }

  // input name
  handleInputTextChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  // input date
  handleInputDateChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  // switch task (checked)
  handleToggleDone(taskIndex, e){
    let tasks = this.state.tasks
    let tasksDone = this.state.tasksDone
    tasks[taskIndex].done = !this.state.tasks[taskIndex].done
    tasksDone.unshift(this.state.tasks[taskIndex])
    tasks.splice(taskIndex, 1)
    this.setState({tasksDone})
    this.setLocalTasks(this.state.tasks)
    this.setLocalDone(this.state.tasksDone)
  }
  //switch task (unchecked)
  handleToggleNotDone(taskIndex, e){
    let tasksDone = this.state.tasksDone
    let tasks = this.state.tasks
    tasksDone[taskIndex].done = !this.state.tasksDone[taskIndex].done
    tasks.unshift(this.state.tasksDone[taskIndex])
    tasksDone.splice(taskIndex, 1)
    this.setState({
      tasks: this.state.tasks,
      tasksDone: this.state.tasksDone
    })
    this.setLocalTasks(this.state.tasks)
    this.setLocalDone(this.state.tasksDone)
  }
  // enable edit task
  handleEdit(taskIndex, e){
    this.setState({
      taskEditing: this.state.taskEditing === taskIndex ? null : taskIndex
    })
  }
  // edit task input
  handleChangeTaskName(taskIndex, e){
    let tasks = this.state.tasks
    tasks[taskIndex].text = e.target.value
    this.setState({
      tasks
    })
    this.setLocalTasks(this.state.tasks)
    this.setLocalDone(this.state.tasksDone)
  }

  // edit date input
  handleChangeTaskDate(taskIndex, e){
    let tasks = this.state.tasks
    tasks[taskIndex].date = e.target.value
    this.setState({
      tasks: this.state.tasks
    })
    this.setLocalTasks(this.state.tasks)
    this.setLocalDone(this.state.tasksDone)
  }

  // remove task (unchecked)
  handleRemove(taskIndex, e){
    this.state.tasks.splice(taskIndex, 1)
    this.setState({tasks: this.state.tasks})
    this.setLocalTasks(this.state.tasks)
    this.setLocalDone(this.state.tasksDone)
  }
  // remove task (checked)
  handleRemoveDone(taskIndex, e){
    this.state.tasksDone.splice(taskIndex, 1)
    this.setState({tasksDone: this.state.tasksDone})
    this.setLocalTasks(this.state.tasks)
    this.setLocalDone(this.state.tasksDone)
  }
  // show hide finished task
  handleHideTasksDone(){
    if(this.state.tasksDoneClassName === "show"){
      this.setState({
        tasksDoneClassName: "hidden",
        buttonShowHide: "Show finished tasks"
      })
    } else {
      this.setState({
        tasksDoneClassName: "show",
        buttonShowHide: "Hide finished tasks"
      })
    }
  }
  // save tasks locally
  setLocalTasks(tasks){
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }

  // save finished tasks locally
  setLocalDone(tasks){
    localStorage.setItem("tasksDone", JSON.stringify(tasks))
  }

  // get finished tasks locally
  getLocalTasks(){
    let tasks = localStorage.getItem("tasks")
    if(tasks === null){
      tasks = [];
    }else{
      tasks = JSON.parse(tasks)
    }
    this.setState({tasks})
  }

  // get finished tasks saved locally
  getLocalDone(){
    let tasksDone = localStorage.getItem("tasksDone")
    if(tasksDone === null) {
      tasksDone = [];
    } else {
      tasksDone = JSON.parse(tasksDone)
    }
    this.setState({tasksDone})
  }

  render() {
    return (
      <div className="TodoList">
        <div>
          <header><h1>Todo List</h1></header>
        </div>
        <div className="wrapper-input">
          <form onSubmit={this.handleSubmitForm}>
            <input
              type="text" name="currentTask"
              placeholder="Add a new task..."
              value={this.state.currentTask}
              onChange={this.handleInputTextChange}
              ref={(el) => {this.currentTask = el}}
            />
            <input
              type="date"
              value={this.state.date}
              name="date"
              min={Date.now()}
              onChange={this.handleInputDateChange}
            />
            <button
              className="add-task"
              type="submit"
              value={this.state.currentTask}
            >
              Add Task
            </button>
          </form>
          <span className={this.state.show_alert}>{this.state.alert}</span>
        </div>
        <button className="showHide-done"
                onClick={this.handleHideTasksDone}>
                {this.state.buttonShowHide}
        </button>
        <div className="wrapper_tasks">
          <ul>
            {this.state.tasks.map((item, index) => {
                this.isEditing = this.state.taskEditing === index;
                console.log(this.state.taskEditing);

                return <li key={"task" + index} className="not_done">
                  <button
                    className="far fa-square fa-lg task-uncheck"
                    onClick={this.handleToggleDone.bind(this, index)}
                  />
                  {
                    (this.isEditing)
                    ? <>
                        <input
                          onChange={this.handleChangeTaskName.bind(this, index)}
                          value={item.text}
                        />
                        <input
                          type="date"
                          onChange={this.handleChangeTaskDate.bind(this, index)}
                          value={item.date}
                        />
                      </>
                    : <>
                        <span>{item.text}</span>
                        <input type="date"
                          readOnly={true}
                          onChange={this.handleChangeTaskDate.bind(this, index)}
                          value={item.date}
                        />
                      </>
                  }
                  <button
                    className={(this.isEditing)
                      ? "fas fa-save fa-lg task-save"
                      : "fas fa-edit fa-lg task-edit"}
                      onClick={this.handleEdit.bind(this, index)}
                  />
                  <button
                    className="fas fa-trash-alt fa-lg task-delete"
                    onClick={this.handleRemove.bind(this, index)}
                  />
                </li>
            })}
          </ul>
        </div>
        <div className="wrapper_tasks_done show">
          <ul className={this.state.tasksDoneClassName}>
            {
              this.state.tasksDone.map((item, index) => {
                return (
                  <li key={"task" + index} className="done">
                    <button
                      className="far fa-check-square fa-lg task-uncheck"
                      onClick={this.handleToggleNotDone.bind(this, index)}
                    />
                    <span>{item.text}</span>
                    <button
                      className="fas fa-trash-alt fa-lg task-delete"
                      onClick={this.handleRemoveDone.bind(this, index)}
                    />
                  </li>
                )
              })
            }
          </ul>
        </div>

      </div>
    );
  }
}

export default TodoList;
