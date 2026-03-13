class Formulario {
  constructor() {
    this.formulario = document.querySelector(".formulario");
    this.eventos();
    this.dashboard = new Dashboard();
    this.taskList = new TaskList(this.dashboard);
    this.dashboard.taskList = this.taskList;
    this.taskList.loadTasks();
  }

  eventos() {
    this.formulario.addEventListener("submit", (e) => {
      this.handleSubmit(e);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.removeErros();

    const isValidForm = this.validarCampos();
    if (isValidForm) {
      const nameTask = this.formulario.querySelector(".nameTask").value;
      const dateTask = this.formulario.querySelector(".dateTask").value;
      const statusTask = this.formulario.querySelector(".statusTask").value;
      const task = new Task(nameTask, dateTask, statusTask);
      this.taskList.addTask(task);
      this.formulario.reset();
    }
  }

  removeErros() {
    const erros = document.querySelectorAll(".error");

    for (let erro of erros) {
      erro.remove();
    }
  }

  validarCampos() {
    let valid = true;

    const campos = document.querySelectorAll(".validar");
    for (let campo of campos) {
      if (!campo.value.trim()) {
        this.createError(campo, "O campo não pode estar vazio!");
        valid = false;
      } else if (campo.classList.contains("nameTask"))
        valid = this.validarName(campo) && valid;
      else if (campo.classList.contains("dateTask"))
        valid = this.validarData(campo) && valid;
      else if (campo.classList.contains("statusTask"))
        valid = this.validarStatus(campo) && valid;
      //$$ valid garante que assim que qualquer campo falha, o valid nunca mais volta a ser true
    }

    return valid;
  }

  validarName(campo) {
    const nomeFormatado = campo.value.replace(/\s+/g, " ").trim();

    campo.value = nomeFormatado;

    if (String(nomeFormatado).length < 3 || String(nomeFormatado).length > 50) {
      this.createError(
        campo,
        "O nome da atividade deve ter entre 3 e 50 caracteres",
      );
      return false;
    }

    return true;
  }

  validarData(campo) {
    const dateTask = campo.value;

    let hoje = new Date().toISOString().split("T")[0];
    const dataLimite = new Date();
    dataLimite.setFullYear(new Date().getFullYear() + 2);
    const dateLimiteFormat = dataLimite.toISOString().split("T")[0];

    if (dateTask < hoje) {
      this.createError(campo, "A data informada não deve estar no passado!");
      return false;
    }

    if (dateTask > dateLimiteFormat) {
      this.createError(campo, "A data não pode ultrapassar 2 anos!");
      return false;
    }

    return true;
  }

  validarStatus(campo) {
    const allowValues = ["pendente", "em progresso", "concluida"];
    const test = allowValues.includes(campo.value);

    if (!test) {
      this.createError(
        campo,
        `O valor enviado é inválido! (Valor enviado: ${campo.value})`,
      );
      return false;
    }

    return true;
  }

  createError(campo, msg) {
    const grupo = campo.closest(".form-group");
    const p = document.createElement("p");
    p.className = "error";
    p.textContent = msg;
    grupo.appendChild(p);
  }
}

class Task {
  constructor(nameTask, dateTask, statusTask) {
    this.nameTask = nameTask;
    this.dateTask = dateTask;
    this.statusTask = statusTask;
  }
}

class TaskList {
  constructor(dashboard) {
    this.dashboard = dashboard;
    this.tasks = [];
    this.storage = new Storage();
  }

  loadTasks() {
    try {
      const loadTasks = JSON.parse(localStorage.getItem("tasks"));
      if (Array.isArray(loadTasks)) {
        this.tasks = loadTasks;
        this.dashboard.showTasks(loadTasks);
        console.log(this.tasks);
      }
    } catch (e) {
      this.tasks = [];
    }
  }

  addTask(task) {
    this.tasks.push(task);
    this.storage.saveTasks(this.tasks);
    this.dashboard.showTasks(this.tasks);
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.storage.saveTasks(this.tasks);
    this.dashboard.showTasks(this.tasks);
  }
}

class Storage {
  saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

class Dashboard {
  constructor() {
    this.dashboardTasks = document.querySelector(".dashboardTasks");
  }

  showTasks(tasks) {
    this.dashboardTasks.innerHTML = "";
    for (let idx = 0; idx < tasks.length; idx++) {
      const { nameTask, dateTask, statusTask } = tasks[idx];
      this.createCard(nameTask, dateTask, statusTask, idx);
    }
  }

  createCard(name, date, status, index) {
    const { div, p, button } = this.createElements();

    this.configureElements(p, button, name, date, status, index);

    this.dashboardTasks.appendChild(div);
  }
  
  createElements() {
    const div = document.createElement("div");
    const p = document.createElement("p");
    const button = document.createElement("button");

    div.classList.add("card");

    div.appendChild(p);
    div.appendChild(button);

    return { div, p, button };
  }

  configureElements(p, button, name, date, status, index) {
    p.textContent = `${name} ${date} ${status}`;

    button.textContent = "Deletar";
    button.value = index;

    button.addEventListener("click", (e) => {
      const btnValue = Number(e.target.value);
      this.taskList.deleteTask(btnValue);
    });
  }
}
new Formulario();
