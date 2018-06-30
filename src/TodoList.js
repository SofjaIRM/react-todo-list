import React, { Component } from 'react';
import './TodoList.css';

class TodoList extends Component {
  constructor(props){
    super(props);
    this.state = {
      tarefas:[],
      tarefas_done:[],
      tarefa_adicionar: "",
      estado_tarefa: "",
      data_tarefa: "",
      alerta_tarefa: "",
      show_alert: "hidden_alert",
      wrapper_tarefas_done: "show",
      buttonShowHide: "Ocultar tarefas concluidas"
    };

    this.handleInputTextChange = this.handleInputTextChange.bind(this);
    this.handleInputDateChange = this.handleInputDateChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleHideTarefasDone = this.handleHideTarefasDone.bind(this);

  };

  componentWillMount (){
    this.getLocalTarefas();
    this.getLocalDone()
    //this.setLocalTarefas([]);
    //this.setLocalDone([]);
  }
  componentDidMount (){
    this.tarefa_adicionar.focus()
  }
  
  shouldComponentUpdate (){
    return true;
  }

  //adicionar nova tarefa
  handleSubmitForm(e){
    e.preventDefault()
    //verifica se a tarefa e a data estão preenchidas
    if(this.state.tarefa_adicionar && this.state.data_tarefa !== ""){
      this.state.tarefas.push({
        text: this.state.tarefa_adicionar,
        date: this.state.data_tarefa,
        done: this.state.estado_tarefa === "not_done" ? true : false,
      })
      //reinicializa input após inserir tarefa
      this.setState({
        tarefas: this.state.tarefas,
        tarefa_adicionar: "",
        data_tarefa: ""
      })
      //oculta pussíveis mensagens de alerta
      this.setState({
        show_alert: "hidden"
      })
      //guarda tarefas localmente
      this.setLocalTarefas(this.state.tarefas)
      this.tarefa_adicionar.focus()
    }
    //alerta, tarefa não inserida
    else if(this.state.tarefa_adicionar === "" && this.state.data_tarefa !== ""){
      this.setState({
        alerta_tarefa: "Insira uma tarefa",
        show_alert: "show_alert"
      })
    }
    //alerta, data não inserida
    else if(this.state.tarefa_adicionar !== "" && this.state.data_tarefa === ""){
      this.setState({
        alerta_tarefa: "Insira uma data",
        show_alert: "show_alert"
      })
    }
  }

  //input nome da tarefa
  handleInputTextChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  //input data da tarefa
  handleInputDateChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  //switch tarefa (checked)
  handleToggleDone(tarefaIndex, e){
    let tarefas = this.state.tarefas
    let tarefas_done = this.state.tarefas_done
    tarefas[tarefaIndex].done = !this.state.tarefas[tarefaIndex].done
    tarefas_done.unshift(this.state.tarefas[tarefaIndex])
    tarefas.splice(tarefaIndex, 1)
    this.setState({tarefas_done})
    this.setLocalTarefas(this.state.tarefas)
    this.setLocalDone(this.state.tarefas_done)
  }
  //switch tarefa (unchecked)
  handleToggleNotDone(tarefaIndex, e){
    let tarefas_done = this.state.tarefas_done
    let tarefas = this.state.tarefas
    tarefas_done[tarefaIndex].done = !this.state.tarefas_done[tarefaIndex].done
    tarefas.unshift(this.state.tarefas_done[tarefaIndex])
    tarefas_done.splice(tarefaIndex, 1)
    this.setState({
      tarefas: this.state.tarefas, 
      tarefas_done: this.state.tarefas_done
    })
    this.setLocalTarefas(this.state.tarefas)
    this.setLocalDone(this.state.tarefas_done)
  }
  //ativar edição de tarefa
  handleEdit(tarefaIndex, e){
    this.setState({
      tarefa_editing: this.state.tarefa_editing === tarefaIndex ? null : tarefaIndex
    })
  }
  //input editar tarefa
  handleChangeTarefaName(tarefaIndex, e){
    let tarefas = this.state.tarefas
    tarefas[tarefaIndex].text = e.target.value
    this.setState({
      tarefas
    })
    this.setLocalTarefas(this.state.tarefas)
    this.setLocalDone(this.state.tarefas_done)
  }
  //input editar data
  handleChangeTarefaDate(tarefaIndex, e){
    let tarefas = this.state.tarefas
    tarefas[tarefaIndex].date = e.target.value
    this.setState({
      tarefas: this.state.tarefas
    })
    this.setLocalTarefas(this.state.tarefas)
    this.setLocalDone(this.state.tarefas_done)
  }
  //remover tarefas (unchecked)
  handleRemove(tarefaIndex, e){
    this.state.tarefas.splice(tarefaIndex, 1)
    this.setState({tarefas: this.state.tarefas})
    this.setLocalTarefas(this.state.tarefas)
    this.setLocalDone(this.state.tarefas_done)
  }
  //remover tarefas (checked)
  handleRemoveDone(tarefaIndex, e){
    this.state.tarefas_done.splice(tarefaIndex, 1)
    this.setState({tarefas_done: this.state.tarefas_done})
    this.setLocalTarefas(this.state.tarefas)
    this.setLocalDone(this.state.tarefas_done)
  }
  //show hide tarefas done
  handleHideTarefasDone(){
    if(this.state.wrapper_tarefas_done === "show"){
      this.setState({
        wrapper_tarefas_done: "hidden",
        buttonShowHide: "Mostrar tarefas concluidas"
      })
    }else{
      this.setState({
        wrapper_tarefas_done: "show",
        buttonShowHide: "Ocultar tarefas concluidas"
      })
    }
  }
  //guardar tarefas localmente
  setLocalTarefas(tarefas){
    localStorage.setItem("tarefas", JSON.stringify(tarefas))
  }

  //guarda tarefas_done localmente
  setLocalDone(tarefas){
    localStorage.setItem("tarefas_done", JSON.stringify(tarefas))
  }

  //receber tarefas guardadas localmente
  getLocalTarefas(){
    let tarefas = localStorage.getItem("tarefas")
    if(tarefas === null){
      tarefas = [];
    }else{
      tarefas = JSON.parse(tarefas)
    }
    this.setState({tarefas})
  }

  //recebe tarefas_done guardadas localmente
  getLocalDone(){
    let tarefas_done = localStorage.getItem("tarefas_done")
    if(tarefas_done === null){
      tarefas_done = [];
    }else{
      tarefas_done = JSON.parse(tarefas_done)
    }
    this.setState({tarefas_done})
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
              type="text" name="tarefa_adicionar"
              placeholder="Insira uma tarefa..."
              value={this.state.tarefa_adicionar}
              onChange={this.handleInputTextChange}
              ref={(el) => {this.tarefa_adicionar = el}}
            />
            <input type="date"
                   value={this.state.data_tarefa}
                   name="data_tarefa"
                   min={new Date()}
                   onChange={this.handleInputDateChange}/>
            <button className="adicionar-tarefa"
                    type="submit"
                    value={this.state.tarefa_adicionar}>
                    Adicionar Tarefa
            </button>
          </form>
          <span className={this.state.show_alert}>{this.state.alerta_tarefa}</span>
        </div>
        <button className="showHide-done"
                onClick={this.handleHideTarefasDone}>
                {this.state.buttonShowHide}
        </button>
        <div className="wrapper_tarefas">
          <ul>
            {this.state.tarefas.map((item, index) => {
              return (
                <li key={"tarefa" + index} className="not_done">
                  <button className="far fa-square fa-lg tarefa-uncheck"
                          onClick={this.handleToggleDone.bind(this, index)}/>
                  {
                    (this.state.tarefa_editing === index)
                    ? <input onChange={this.handleChangeTarefaName.bind(this, index)} 
                              value={item.text}/>
                    : <span>{item.text}</span>
                  }
                  {
                    (this.state.tarefa_editing === index)
                    ? <input type="date" 
                              onChange={this.handleChangeTarefaDate.bind(this, index)} 
                              value={item.date}/>
                    : <input type="date" 
                              readOnly={true} 
                              onChange={this.handleChangeTarefaDate.bind(this, index)} 
                              value={item.date}/>
                  }
                  <button className={(this.state.tarefa_editing === index) 
                                      ? "fas fa-save fa-lg tarefa-guardar"
                                      : "fas fa-edit fa-lg tarefa-edit"}
                          onClick={this.handleEdit.bind(this, index)}/>
                  <button className="fas fa-trash-alt fa-lg tarefa-delete"
                          onClick={this.handleRemove.bind(this, index)}
                          disabled={(!isNaN (this.state.tarefa_editing) && this.state.tarefa_editing !== null) 
                                      ? "disabled" 
                                      : ""}/>
                </li>
                )
            })}
          </ul>
        </div>
        <div className="wrapper_tarefas_done">
          <ul className={this.state.wrapper_tarefas_done}>
            {
              this.state.tarefas_done.map((item, index) => {
                return (
                  <li key={"tarefa" + index} className="done">
                    <button className="far fa-check-square fa-lg tarefa-uncheck"
                            onClick={this.handleToggleNotDone.bind(this, index)}/>
                    <span>{item.text}</span>
                    <button className="fas fa-trash-alt fa-lg tarefa-delete"
                            onClick={this.handleRemoveDone.bind(this, index)}/>
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
