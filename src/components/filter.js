import AbstractComponent from "./abstract-component";

const FILTER_ID_PREFIX = `filter__`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};


const createFilterMarkup = ({name, count}, isChecked) => {

  return (
    `<input type="radio" id="filter__${name}" class="filter__input visually-hidden" name="filter"
        ${isChecked ? `checked` : ``}
      />
      <label for="filter__${name}" class="filter__label">
        ${name} <span class="filter__${name}-count">${count}</span>
      </label>`
  );
};

const createFilterTemplate = (filters) => {

  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.checked)).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    // console.log(77, handler);
    this.getElement().addEventListener(`change`, (evt) => {
      // console.log(666, evt.target.id)
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
