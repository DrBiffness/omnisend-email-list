'use strict';
const getOmnisendData = require('./omnisend');
const getApiList = require('./lib/google');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;


exports.handler = async function (event) {
    const data = await getOmnisendData(await getApiList());

    const csvStringifier = createCsvStringifier({
        header: [
            { id: 'siteName', title: 'SITE NAME' },
            { id: 'subscriberCount', title: 'SUBSCRIBER COUNT' }
        ]
    });

    const csvString = `${csvStringifier.getHeaderString()}${csvStringifier.stringifyRecords(data)}`;


}

