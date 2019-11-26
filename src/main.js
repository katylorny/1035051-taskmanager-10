import {createLoadMoreButton} from './components/load-more-button.js';
import {createTaskEditTemplate} from './components/edit-task.js';
import {createTaskTemplate} from './components/create-task.js';
import {createBoardTemplate} from './components/board.js';
import {createFilterTemplate} from './components/filter.js';
import {createMenuTemplate} from './components/menu.js';

const TASK_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);

render(siteHeaderElement, createMenuTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createBoardTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
render(taskListElement, createTaskEditTemplate(), `afterbegin`);

new Array(TASK_COUNT)
  .fill(``)
  .forEach(
      () => render(taskListElement, createTaskTemplate())
  );

const boardContainerElement = document.querySelector(`.board`);
render(boardContainerElement, createLoadMoreButton());
