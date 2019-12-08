const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;


import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import TaskEditComponent from './components/edit-task.js';
import TaskComponent from './components/create-task.js';
import MenuComponent from './components/menu.js';
import SortComponent from './components/sort';
import TasksComponent from './components/tasks.js';
import NoTasksComponent from './components/no-tasks.js';

import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {RENDER_POSITION, render} from "./utils";


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);


const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
    }
  };

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };
  editButton.addEventListener(`click`, replaceTaskToEdit);

  const editForm = taskEditComponent.getElement().querySelector(`form`);
  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };
  editForm.addEventListener(`submit`, replaceEditToTask);

  render(taskListElement, taskComponent.getElement(), RENDER_POSITION.BEFOREEND);
};

render(siteHeaderElement, new MenuComponent().getElement(), RENDER_POSITION.BEFOREEND);


const filters = generateFilters();
render(siteMainElement, new FilterComponent(filters).getElement(), RENDER_POSITION.BEFOREEND);


const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RENDER_POSITION.BEFOREEND);


const tasks = generateTasks(TASK_COUNT);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;


const isAllTasksArchived = tasks.every((task) => task.isArchive);

if (isAllTasksArchived) {
  render(boardComponent.getElement(), new NoTasksComponent().getElement(), RENDER_POSITION.BEFOREEND);
} else {

  render(boardComponent.getElement(), new SortComponent().getElement(), RENDER_POSITION.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RENDER_POSITION.BEFOREEND);
  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RENDER_POSITION.BEFOREEND);

  tasks.slice(0, showingTasksCount).forEach((task) => {
    renderTask(taskListElement, task);
  });

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
}
