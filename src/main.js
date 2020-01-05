import TasksModel from "./models/tasks";

const TASK_COUNT = 22;

import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import MenuComponent from './components/menu.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {RENDER_POSITION, render} from "./utils/render";
import BoardController from './controllers/board';


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.main__control`);

render(siteHeaderElement, new MenuComponent().getElement(), RENDER_POSITION.BEFOREEND);


const filters = generateFilters();
render(siteMainElement, new FilterComponent(filters).getElement(), RENDER_POSITION.BEFOREEND);


const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RENDER_POSITION.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();


