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
console.log("menu siteMenuComponent", siteMenuComponent)  /////////////////////////////////////////

siteMenuComponent.getElement().querySelector(`.control__label--new-task`)
  .addEventListener(`click`, () => {
    boardController.createTask();
  });
render(siteHeaderElement, siteMenuComponent.getElement(), RENDER_POSITION.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

console.log("main task model", tasksModel) ///////////////////////////////////////////

const filterController = new FilterController(siteMainElement, tasksModel);
console.log("main filterController", filterController) ////////////////////////////////
filterController.render();


const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RENDER_POSITION.BEFOREEND);


const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();


