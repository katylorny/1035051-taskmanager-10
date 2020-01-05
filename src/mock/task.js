
import {COLORS} from "../constants";


const DESCRIPTION = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const REPEATING_DAYS = {
  'mo': false,
  'tu': false,
  'we': false,
  'th': false,
  'fr': false,
  'sa': false,
  'su': false
};

const TAGS = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`
];

const generateTags = (tags) => { // !!!!!
  return tags
    .filter(() => Math.random() > 0.5)
    .slice(0, 3);
};

const getRandomNumber = (min, max) => {
  return min + Math.floor((max - min) * Math.random());
};

const getRandomArrayElement = (arr) => {
  const element = getRandomNumber(0, arr.length);
  return arr[element];
};

const getRandomDate = () => { // разобраться
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateRepeatingDays = () => {
  return Object.assign({}, REPEATING_DAYS, {
    'mo': Math.random() > 0.5,
  });
};

// ------------------------------------------------------

const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    id: String(new Date() + Math.random()),
    description: getRandomArrayElement(DESCRIPTION),
    dueDate,
    repeatingDays: dueDate ? REPEATING_DAYS : generateRepeatingDays(),
    tags: new Set(generateTags(TAGS)),
    color: getRandomArrayElement(COLORS),
    isFavorite: Math.random() > 0.5,
    isArchive: Math.random() > 0.5
  };
};

export const generateTasks = () => {
  return new Array(1)
    .fill(``)
    .map(generateTask);
};
