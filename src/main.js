import TasksModel from "./models/tasks";

const TASK_COUNT = 22;

import BoardComponent from './components/board.js';
import MenuComponent from './components/menu.js';
import {generateTasks} from './mock/task.js';
import {RENDER_POSITION, render} from "./utils/render";
import BoardController from './controllers/board';
import FilterController from "./controllers/filter";


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);
const siteMenuComponent = new MenuComponent();
console.log("main siteMenuComponent", siteMenuComponent)  /////////////////////////////////////////

siteMenuComponent.getElement().querySelector(`.control__label--new-task`)
  .addEventListener(`click`, () => {
    boardController.createTask();
  });

render(siteHeaderElement, siteMenuComponent.getElement(), RENDER_POSITION.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

console.log("main tasksModel", tasksModel) ///////////////////////////////////////////

const filterController = new FilterController(siteMainElement, tasksModel);
console.log("main filterController", filterController) ////////////////////////////////////
filterController.render();


const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RENDER_POSITION.BEFOREEND);


const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();








// import BoardComponent from './components/board.js';
// import BoardController from './controllers/board.js';
// import FilterController from './controllers/filter.js';
// import SiteMenuComponent from './components/menu.js';
// import TasksModel from './models/tasks.js';
// import {generateTasks} from './mock/task.js';
// import {render, RENDER_POSITION} from './utils/render.js';
//
// const TASK_COUNT = 22;
//
// const siteMainElement = document.querySelector(`.main`);
// const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
// const siteMenuComponent = new SiteMenuComponent();
//
// // Быстрое решение для подписки на клик по кнопке.
// // Это противоречит нашей архитектуре работы с DOM-элементами, но это временное решение.
// // Совсем скоро мы создадим полноценный компонент для работы с меню.
// siteMenuComponent.getElement().querySelector(`.control__label--new-task`)
//   .addEventListener(`click`, () => {
//     boardController.createTask();
//   });
//
// render(siteHeaderElement, siteMenuComponent.getElement(), RENDER_POSITION.BEFOREEND);
//
// const tasks = generateTasks(TASK_COUNT);
// const tasksModel = new TasksModel();
// tasksModel.setTasks(tasks);
//
// const filterController = new FilterController(siteMainElement, tasksModel);
// filterController.render();
//
// const boardComponent = new BoardComponent();
// render(siteMainElement, boardComponent.getElement(), RENDER_POSITION.BEFOREEND);
//
// const boardController = new BoardController(boardComponent, tasksModel);
// boardController.render();
