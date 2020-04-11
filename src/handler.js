'use strict';
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const getOmnisendData = require('./omnisend');
const getApiList = require('./lib/google');
const sendOmnisendEmail = require('./lib/mail');
let { startDate, endDate } = require('../config').dateRange;

exports.handler = async function (event) {
    startDate = startDate.format('YYYY-MM-DD');
    endDate = endDate.format('YYYY-MM-DD');

    const data = await getOmnisendData(await getApiList());

    const csvStringifier = createCsvStringifier({
        header: [
            { id: 'siteName', title: 'SITE NAME' },
            { id: 'subscriberCount', title: 'SUBSCRIBER COUNT' }
        ]
    });

    const csvString = `${csvStringifier.getHeaderString()}${csvStringifier.stringifyRecords(data)}`;

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
}

