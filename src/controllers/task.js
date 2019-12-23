import {render, RENDER_POSITION, replace} from "../utils/render";
import TaskComponent from "../components/create-task";
import TaskEditComponent from "../components/edit-task";

const MODE = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class TaskController {

  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = MODE.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    // this.setDefaultView = this.setDefaultView.bind(this)  //////////////////////////////////////////////////////////////
  }

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);


    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });


    if (oldTaskEditComponent && oldTaskComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent.getElement(), RENDER_POSITION.BEFOREEND);

    }
  }

  setDefaultView() {
    if (this._mode !== MODE.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceTaskToEdit() {
    this._onViewChange(); // ??

    replace(this._taskEditComponent, this._taskComponent);
    this._mode = MODE.EDIT;
  }

  _replaceEditToTask() {
    this._taskEditComponent.reset1();

    replace(this._taskComponent, this._taskEditComponent);
    this._mode = MODE.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}


//
// import TaskComponent from '../components/create-task.js';
// import TaskEditComponent from '../components/edit-task.js';
// import {render, replace, RENDER_POSITION} from '../utils/render.js';
//
// const Mode = {
//   DEFAULT: `default`,
//   EDIT: `edit`,
// };
//
// export default class TaskController {
//   constructor(container, onDataChange, onViewChange) {
//     this._container = container;
//     this._onDataChange = onDataChange;
//     this._onViewChange = onViewChange;
//
//     this._mode = Mode.DEFAULT;
//
//     this._taskComponent = null;
//     this._taskEditComponent = null;
//
//     this._onEscKeyDown = this._onEscKeyDown.bind(this);
//   }
//
//   render(task) {
//     const oldTaskComponent = this._taskComponent;
//     const oldTaskEditComponent = this._taskEditComponent;
//
//     this._taskComponent = new TaskComponent(task);
//     this._taskEditComponent = new TaskEditComponent(task);
//
//     this._taskComponent.setEditButtonClickHandler(() => {
//       this._replaceTaskToEdit();
//       document.addEventListener(`keydown`, this._onEscKeyDown);
//     });
//
//     this._taskComponent.setArchiveButtonClickHandler(() => {
//       this._onDataChange(this, task, Object.assign({}, task, {
//         isArchive: !task.isArchive,
//       }));
//     });
//
//     this._taskComponent.setFavoritesButtonClickHandler(() => {
//       this._onDataChange(this, task, Object.assign({}, task, {
//         isFavorite: !task.isFavorite,
//       }));
//     });
//
//     this._taskEditComponent.setSubmitHandler(() => this._replaceEditToTask());
//
//     if (oldTaskEditComponent && oldTaskComponent) {
//       replace(this._taskComponent, oldTaskComponent);
//       replace(this._taskEditComponent, oldTaskEditComponent);
//     } else {
//       console.log(11, this._container)
//       render(this._container, this._taskComponent.getElement(), RENDER_POSITION.BEFOREEND);
//     }
//   }
//
//   setDefaultView() {
//     if (this._mode !== Mode.DEFAULT) {
//       this._replaceEditToTask();
//     }
//   }
//
//   _replaceEditToTask() {
//     // this._taskEditComponent.getElement().reset();
//     console.log(55, this._taskEditComponent);
//
//     replace(this._taskComponent, this._taskEditComponent);
//     this._mode = Mode.DEFAULT;
//   }
//
//   _replaceTaskToEdit() {
//     this._onViewChange();
//
//     replace(this._taskEditComponent, this._taskComponent);
//     this._mode = Mode.EDIT;
//   }
//
//   _onEscKeyDown(evt) {
//     const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
//
//     if (isEscKey) {
//       this._replaceEditToTask();
//       document.removeEventListener(`keydown`, this._onEscKeyDown);
//     }
//   }
// }
