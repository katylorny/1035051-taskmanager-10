import {isOneDay, isOverdueDate, isRepeating} from "./common";
import {FILTER_TYPE} from "../constants";

export const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

export const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

export const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

export const getTasksWithHashtags = (tasks) => {
  return tasks.filter((task) => task.tags.size); // TODO: почему не length???????
};

export const getTasksInOneDay = (tasks, date) => {
  return tasks.filter((task) => isOneDay(task.dueDate, date));
};

export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FILTER_TYPE.ALL:
      return getNotArchiveTasks(tasks);
    case FILTER_TYPE.ARCHIVE:
      return getArchiveTasks(tasks);
    case FILTER_TYPE.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(tasks));
    case FILTER_TYPE.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks), nowDate);
    case FILTER_TYPE.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));
    case FILTER_TYPE.TAGS:
      return getTasksWithHashtags(getNotArchiveTasks(tasks));
    case FILTER_TYPE.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks), nowDate);
  }
  // console.log(tasks);
  return tasks;
};
