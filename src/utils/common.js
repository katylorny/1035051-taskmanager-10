// const castTimeFormat = (value) => {
//   return value < 10 ? `0${value}` : String(value);
// };

// export const formatTime = (date) => {
//   const hours = castTimeFormat(date.getHours() % 12);
//   const minutes = castTimeFormat(date.getMinutes());
//
//   const interval = date.getHours() > 11 ? `pm` : `am`;
//
//   return `${hours}:${minutes} ${interval}`;
// };
import moment from 'moment';

export const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};
