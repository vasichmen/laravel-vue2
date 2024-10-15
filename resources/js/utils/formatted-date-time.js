import moment from 'moment';

export default dateTime => {
    return moment(dateTime).format('DD.MM.YYYY, HH:mm');
}
