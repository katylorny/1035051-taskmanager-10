import {remove, render, RENDER_POSITION} from "../utils/render";

import TasksComponent from "../components/tasks";
import SortComponent, {SortType} from "../components/sort";
import LoadMoreButtonComponent from "../components/load-more-button";
import NoTasksComponent from "../components/no-tasks";
import TaskController from "./task";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;


const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);

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

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange); // ?
  }

  render() {

    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RENDER_POSITION.BEFOREEND);
      return;
    }

    render(container, this._sortComponent.getElement(), RENDER_POSITION.BEFOREEND);
    render(container, this._tasksComponent.getElement(), RENDER_POSITION.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    // let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const newTasks = renderTasks(taskListElement, tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);


    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }
    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent.getElement(), RENDER_POSITION.BEFOREEND);


    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;
      const taskListElement = this._tasksComponent.getElement();

      const tasks = this._tasksModel.getTasks(); // почему тут

      this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      const newTasks = renderTasks(taskListElement, tasks.slice(prevTasksCount, this._showingTasksCount), this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _onDataChange(taskController, oldData, newData) {

    const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

    if (isSuccess) {
      taskController.render(newData);
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

    const taskListElement = this._tasksComponent.getElement();

    taskListElement.innerHTML = ``;
    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
    // console.log(55, newTasks);
    this._showedTaskControllers = newTasks;
    // console.log(22, this._showedTaskControllers);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }

  }


}


// import LoadMoreButtonComponent from '../components/load-more-button.js';
// import TasksComponent from '../components/tasks.js';
// import SortComponent, {SortType} from '../components/sort.js';
// import NoTasksComponent from '../components/no-tasks.js';
// import {render, remove, RENDER_POSITION} from '../utils/render.js';
// import TaskController from './task.js';
//
// const SHOWING_TASKS_COUNT_ON_START = 8;
// const SHOWING_TASKS_COUNT_BY_BUTTON = 8;
//
// const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
//   return tasks.map((task) => {
//     const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
//     // console.log(22, taskController)
//     taskController.render(task);
//
//     return taskController;
//   });
// };
//
// export default class BoardController {
//   constructor(container) {
//     this._container = container;
//
//     this._tasks = [];
//     this._showedTaskControllers = [];
//     this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
//     this._noTasksComponent = new NoTasksComponent();
//     this._sortComponent = new SortComponent();
//     this._tasksComponent = new TasksComponent();
//     this._loadMoreButtonComponent = new LoadMoreButtonComponent();
//
//     this._onDataChange = this._onDataChange.bind(this);
//     this._onSortTypeChange = this._onSortTypeChange.bind(this);
//     this._onViewChange = this._onViewChange.bind(this);
//
//     this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
//   }
//
//   render(tasks) {
//     this._tasks = tasks;
//
//     const container = this._container.getElement();
//     const isAllTasksArchived = this._tasks.every((task) => task.isArchive);
//
//     if (isAllTasksArchived) {
//       render(container, this._noTasksComponent, RENDER_POSITION.BEFOREEND);
//       return;
//     }
//
//     render(container, this._sortComponent.getElement(), RENDER_POSITION.BEFOREEND);
//     render(container, this._tasksComponent.getElement(), RENDER_POSITION.BEFOREEND);
//
//     const taskListElement = this._tasksComponent.getElement();
//
//     const newTasks = renderTasks(taskListElement, this._tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
//     console.log(33, this._showedTaskControllers);
//     this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
//     console.log(44, this._showedTaskControllers);
//     this._renderLoadMoreButton();
//   }
//
//   _renderLoadMoreButton() {
//     if (this._showingTasksCount >= this._tasks.length) {
//       return;
//     }
//
//     const container = this._container.getElement();
//     render(container, this._loadMoreButtonComponent.getElement(), RENDER_POSITION.BEFOREEND);
//
//     this._loadMoreButtonComponent.setClickHandler(() => {
//       const prevTasksCount = this._showingTasksCount;
//       const taskListElement = this._tasksComponent.getElement();
//
//       this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;
//
//       const newTasks = renderTasks(taskListElement, this._tasks.slice(prevTasksCount, this._showingTasksCount), this._onDataChange, this._onViewChange);
//       this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
//
//       if (this._showingTasksCount >= this._tasks.length) {
//         remove(this._loadMoreButtonComponent);
//       }
//     });
//   }
//
//   _onDataChange(taskController, oldData, newData) {
//     const index = this._tasks.findIndex((it) => it === oldData);
//
//     if (index === -1) {
//       return;
//     }
//
//     this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));
//
//     taskController.render(this._tasks[index]);
//   }
//
//   _onViewChange() {
//     this._showedTaskControllers.forEach((it) => it.setDefaultView());
//   }
//
//   _onSortTypeChange(sortType) {
//     let sortedTasks = [];
//
//     switch (sortType) {
//       case SortType.DATE_UP:
//         sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
//         break;
//       case SortType.DATE_DOWN:
//         sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
//         break;
//       case SortType.DEFAULT:
//         sortedTasks = this._tasks.slice(0, this._showingTasksCount);
//         break;
//     }
//
//     const taskListElement = this._tasksComponent.getElement();
//
//     taskListElement.innerHTML = ``;
//
//     const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
//     this._showedTaskControllers = newTasks;
//
//     if (sortType === SortType.DEFAULT) {
//       this._renderLoadMoreButton();
//     } else {
//       remove(this._loadMoreButtonComponent);
//     }
//   }
// }
