import moment from 'moment';
import counterFormat from '@/utils/formatted-counter-text';

export default date => {
    return moment(date).format('DD.MM.YYYY');
};

export function getDateString(date) {

    let dateString = '';
    let dateMoment = moment(date);

    switch (true) {
      case Math.abs(dateMoment.diff(moment(), 'years')) >= 1:
        dateString = `${getDateWithFormattedCounter(dateMoment, 'years', ['год', 'года', 'лет'])} назад`;
        break;
      case Math.abs(dateMoment.diff(moment(), 'months')) >= 1:
        dateString = `${getDateWithFormattedCounter(dateMoment, 'months', ['месяц', 'месяца', 'месяцев'])} назад`;
        break;
      case Math.abs(dateMoment.diff(moment(), 'weeks')) >= 1:
        dateString = `${getDateWithFormattedCounter(dateMoment, 'weeks', ['неделя', 'недели'])} назад`;
        break;
      case Math.abs(dateMoment.diff(moment(), 'days')) >= 3:
        dateString = `${getDateWithFormattedCounter(dateMoment, 'days', ['день', 'дня', 'дней'])} назад`;
        break;
      case Math.abs(dateMoment.diff(moment(), 'days')) >= 2:
        dateString = 'Позавчера';
        break;
      case Math.abs(dateMoment.diff(moment(), 'days')) >= 1:
        dateString = 'Вчера';
        break;
      case Math.abs(dateMoment.diff(moment(), 'hours')) >= 1:
        dateString = `${getDateWithFormattedCounter(dateMoment, 'hours', ['час', 'часа', 'часов'])} назад`;
        break;
      default:
        dateString = `${getDateWithFormattedCounter(dateMoment, 'minutes', ['минуту', 'минуты', 'минут'])} назад`;
        break;
    }

    return dateString;
}

function getDateWithFormattedCounter(dateMoment, unit, titles) {
  let units = Math.abs(Math.round(dateMoment.diff(moment(), unit)));

  return `${units} ${counterFormat(units, titles)}`;
}
