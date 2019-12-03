const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

import {createLoadMoreButton} from './components/load-more-button.js';
import {createTaskEditTemplate} from './components/edit-task.js';
import {createTaskTemplate} from './components/create-task.js';
import {createBoardTemplate} from './components/board.js';
import {createFilterTemplate} from './components/filter.js';
import {createMenuTemplate} from './components/menu.js';

import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';


const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);

const filters = generateFilters();
render(siteMainElement, createFilterTemplate(filters), `beforeend`);
render(siteHeaderElement, createMenuTemplate());
// render(siteMainElement, createFilterTemplate());
render(siteMainElement, createBoardTemplate());


const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);
render(taskListElement, createTaskEditTemplate((tasks[0]), `afterbegin`));
tasks.slice(1).forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

const boardContainerElement = document.querySelector(`.board`);
render(boardContainerElement, createLoadMoreButton());

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));
const loadMoreButton = boardContainerElement.querySelector(`.load-more`);
loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
