'use strict';
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const getOmnisendData = require('./omnisend');
const getApiList = require('./lib/google');
const sendOmnisendEmail = require('./lib/mail');
let { startDate, endDate } = require('../config').dateRange;

// handler function for lambda which will expect an array of recipients
// in the event param (configured in AWS cloudwatch events). this is
// the main program flow as it will use the omnisend lib to get data, then
// parse into a csv string which will be attached to the email sent by the
// mail lib to all recipients from event param
exports.handler = async function(event) {
    startDate = startDate.format('YYYY-MM-DD');
    endDate = endDate.format('YYYY-MM-DD');

    const data = await getOmnisendData(await getApiList());

    const csvStringifier = createCsvStringifier({
        header: [
            { id: 'siteName', title: 'SITE NAME' },
            { id: 'subscriberCount', title: 'SUBSCRIBER COUNT' }
        ]
    });

    const csvString = `${csvStringifier.getHeaderString()}${csvStringifier.stringifyRecords(
        data
    )}`;

    for (const recipient of event.recipients) {
        await sendOmnisendEmail({
            recipient,
            subject: `Omnisend Figures for Period: ${startDate} - ${endDate}`,
            text: `The attached document shows the subscriber counts for the period: ${startDate} - ${endDate}`,
            attachments: [
                {
                    filename: `omnisend_${endDate}.csv`,
                    content: csvString
                }
            ]
        }).catch(err => console.error(err));
    }
};
