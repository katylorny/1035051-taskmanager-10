import {render, RENDER_POSITION, replace} from "../utils/render";
import TaskComponent from "../components/create-task";
import TaskEditComponent from "../components/edit-task";
import {COLOR} from "../constants";
import {remove} from "../utils/render";

export const MODE = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  tags: [],
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
};

export default class TaskController {

  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = MODE.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    // this.setDefaultView = this.setDefaultView.bind(this)  //////////////////////////////////////////////////////////////
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._mode = mode;

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
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, data); // TODO
      // this._replaceEditToTask();
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));

    switch (mode) {
      case MODE.DEFAULT:
      if (oldTaskEditComponent && oldTaskComponent) {
        replace(this._taskComponent, oldTaskComponent);
        replace(this._taskEditComponent, oldTaskEditComponent);
        this._replaceEditToTask();
      } else {
        render(this._container, this._taskComponent.getElement(), RENDER_POSITION.BEFOREEND);
      }
      break;

      case MODE.ADDING:
        if (oldTaskComponent && oldTaskEditComponent) {
          remove(oldTaskEditComponent);
          remove(oldTaskComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        // console.log(555, this._taskEditComponent);
        render(this._container, this._taskEditComponent.getElement(), RENDER_POSITION.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== MODE.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    console.log("taskcontroller destroy") ///////////////////////////////
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
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
      if (this._mode == MODE.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }

      this._replaceEditToTask();
      // document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
