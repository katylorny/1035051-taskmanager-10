import {remove, render, RENDER_POSITION} from "../utils/render";

import TasksComponent from "../components/tasks";
import SortComponent, {SortType} from "../components/sort";
import LoadMoreButtonComponent from "../components/load-more-button";
import NoTasksComponent from "../components/no-tasks";
import TaskController, {MODE as TaskControllerMode, EmptyTask} from "./task";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;


const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task, TaskControllerMode.DEFAULT);

    return taskController;
  });
};

export default class BoardController {
  constructor(container, tasksModel) {
    this._container = container;

    this._tasksModel = tasksModel;

    this._showedTaskControllers = [];
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._creatingTask = null;

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange); // ?
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);

  }

  render() {
    console.log("board render") //////////////////////////////
    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RENDER_POSITION.BEFOREEND);
      return;
    }

    render(container, this._sortComponent.getElement(), RENDER_POSITION.BEFOREEND);
    render(container, this._tasksComponent.getElement(), RENDER_POSITION.BEFOREEND);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton();
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }
    const taskListElement = this._tasksComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    // console.log(TaskControllerMode.ADDING)
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent); //TODO: шо ето?

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }
    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent.getElement(), RENDER_POSITION.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _onDataChange(taskController, oldData, newData) {
    console.log("board onDataChange") ///////////////////////
    if (oldData === EmptyTask) {
      console.log(1)  /////////////////////////
      this._creatingTask = null;
      if (newData === null) {
        console.log(2)  /////////////////////////
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        console.log(3)  /////////////////////////
        this._tasksModel.addTask(newData);
        taskController.render(newData, TaskControllerMode.DEFAULT);

        const destroyedTask = this._showedTaskControllers.pop();
        destroyedTask.destroy();

        this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
        this._showingTasksCount = this._showedTaskControllers.length;
      }
    } else if (newData === null) {
      console.log(4)  /////////////////////////
      this._tasksModel.removeTask(oldData.id);
      this._updateTasks(this._showingTasksCount);
    } else {
      console.log(5)  /////////////////////////
      const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

      if (isSuccess) {
        console.log(6)  /////////////////////////
        taskController.render(newData, TaskControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];
    const tasks = this._tasksModel.getTasks();

    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = tasks.slice(0, this._showingTasksCount);
        break;
    }

    this._removeTasks();
    this._renderTasks(sortedTasks);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }

  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;
    const tasks = this._tasksModel.getTasks();

    this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    this._renderTasks(tasks.slice(prevTasksCount, this._showingTasksCount));

    if (this._showingTasksCount >= tasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onFilterChange() { // TODO: туть
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }

  _removeTasks() {
    console.log("board removeTasks")
    // const taskListElement = this._tasksComponent.getElement();
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    // taskListElement.innerHTML = ``;
    this._showedTaskControllers = [];
  }

  _updateTasks(count) {
    console.log("board updateTasks")
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }
}
