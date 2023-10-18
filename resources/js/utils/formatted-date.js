import moment from 'moment';


export default date => {
    return moment(date).format('DD.MM.YYYY');
};

export function getDateTime(date) {
    return moment(date).format('HH:mm');
}

export function getDateTimeElastic(date) {
    return moment(date).format('YYYY-MM-DD');
}

export function getDateAndTime(date) {
    return moment(date).format('DD.MM.YYYY, HH:mm');
}
