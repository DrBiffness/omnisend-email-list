'use strict';
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

(async function main(targetDate, startDate, endDate) {
    if (!targetDate) {
        console.log('targetDate must be provided for validation')
        return null;
    }
    const range = moment.range(
        startDate ? moment(startDate).startOf('day') : moment(endDate).startOf('day').subtract(7, 'days'),
        endDate ? moment(endDate).endOf('day') : moment().endOf('day')
    )
    console.log(range.contains(moment(targetDate)));
    console.log(targetDate);
    console.log(range && range.contains(moment(targetDate)));

})(new Date());