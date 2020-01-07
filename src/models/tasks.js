import {getTasksByFilter} from "../utils/filter";
import {FILTER_TYPE} from "../constants";

export default class Tasks {
  constructor() {
    this._tasks = [];
    this._activeFilterType = FILTER_TYPE.ALL;
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getTasks() {
    return getTasksByFilter(this._tasks, this._activeFilterType);
  }

  getTasksAll() {
    return this._tasks;
  }

  setTasks(tasks) {
    this._tasks = Array.from(tasks);
  }

  updateTask(id, task) {
    console.log("tasks  updateTask")  /////////////////////////
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));
    console.log(`tasks this._tasks`, this._tasks)

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removeTask(id) {
    console.log("tasks removeTask")  ///////////////////////////
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
    // console.log(111111, this._filterChangeHandlers)
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  addTask(task) {
    console.log("tasks addTask")  ///////////////////////////
    this._tasks = [].concat(task, this._tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  _callHandlers(handlers) {
    console.log("tasks callHandlers", handlers)  ///////////////////////////
    handlers.forEach((handler) => handler());
  }
}





// import {getTasksByFilter} from '../utils/filter.js';
// import {FILTER_TYPE} from '../constants.js';
//
//
// export default class Tasks {
//   constructor() {
//     this._tasks = [];
//     this._activeFilterType = FILTER_TYPE.ALL;
//
//     this._dataChangeHandlers = [];
//     this._filterChangeHandlers = [];
//   }
//
//   getTasks() {
//     return getTasksByFilter(this._tasks, this._activeFilterType);
//   }
//
//   getTasksAll() {
//     return this._tasks;
//   }
//
//   setTasks(tasks) {
//     this._tasks = Array.from(tasks);
//   }
//
//   setFilter(filterType) {
//     this._activeFilterType = filterType;
//     this._callHandlers(this._filterChangeHandlers);
//   }
//   removeTask(id) {
//     const index = this._tasks.findIndex((it) => it.id === id);
//
//     if (index === -1) {
//       return false;
//     }
//
//     this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));
//
//     this._callHandlers(this._dataChangeHandlers);
//
//     return true;
//   }
//
//   updateTask(id, task) {
//     const index = this._tasks.findIndex((it) => it.id === id);
//
//     if (index === -1) {
//       return false;
//     }
//
//     this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));
//
//     this._callHandlers(this._dataChangeHandlers);
//
//     return true;
//   }
//
//   addTask(task) {
//     this._tasks = [].concat(task, this._tasks);
//     this._callHandlers(this._dataChangeHandlers);
//   }
//
//   setFilterChangeHandler(handler) {
//     this._filterChangeHandlers.push(handler);
//   }
//
//   setDataChangeHandler(handler) {
//     this._dataChangeHandlers.push(handler);
//   }
//
//   _callHandlers(handlers) {
//     handlers.forEach((handler) => handler());
//   }
// }
