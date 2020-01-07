import {FILTER_TYPE} from "../constants";
import {getTasksByFilter} from "../utils/filter";
import FilterComponent from '../components/filter.js';
import {render, replace} from '../utils/render.js';

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._activeFilterType = FILTER_TYPE.ALL;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._tasksModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getTasksAll();
    const filters = Object.values(FILTER_TYPE).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
// console.log(88, filters);

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent.getElement())
    }
  }

  _onFilterChange(filterType) {
    this._tasksModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
