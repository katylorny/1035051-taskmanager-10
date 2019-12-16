import {remove, render, RENDER_POSITION, replace} from "../utils/render";
import TaskEditComponent from "../components/edit-task";
import TaskComponent from "../components/create-task";
import TasksComponent from "../components/tasks";
import SortComponent, {SortType} from "../components/sort";
import LoadMoreButtonComponent from "../components/load-more-button";
import NoTasksComponent from "../components/no-tasks";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;


const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
    }
  };


  const replaceTaskToEdit = () => { // открытие формы редактирования
    replace(taskEditComponent, taskComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  taskComponent.setEditButtonClickHandler(replaceTaskToEdit); // событие нажатия на кнопку edit

  const replaceEditToTask = () => { // закрытие формы редактирования
    replace(taskComponent, taskEditComponent);
  };

  taskEditComponent.setSubmitHandler(replaceEditToTask); // событие отправки формы

  render(taskListElement, taskComponent.getElement(), RENDER_POSITION.BEFOREEND);
};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {

    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      render(container, this._loadMoreButtonComponent.getElement(), RENDER_POSITION.BEFOREEND);


      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

        tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => renderTask(taskListElement, task));

        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    };

    const container = this._container.getElement();

    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RENDER_POSITION.BEFOREEND);
      return;
    }

    render(container, this._sortComponent.getElement(), RENDER_POSITION.BEFOREEND);
    render(container, this._tasksComponent.getElement(), RENDER_POSITION.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));

    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedTasks = [];
      switch (sortType) {
        case SortType.DATE_UP:
          sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
          break;
        case SortType.DATE_DOWN:
          sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
          break;
        case SortType.DEFAULT:
          sortedTasks = tasks.slice(0, showingTasksCount);
          break;
      }

      taskListElement.innerHTML = ``;
      renderTasks(taskListElement, sortedTasks);
      if (sortType === SortType.DEFAULT) {
        renderLoadMoreButton();
      } else {
        remove(this._loadMoreButtonComponent);
      }
    });

  }
}
