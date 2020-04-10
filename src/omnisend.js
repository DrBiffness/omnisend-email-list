'use strict';

const fs = require('fs-extra');
const readline = require('readline-promise').default;
const { google } = require('googleapis');
const rp = require('request-promise-native');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

//TODO: Need moved somewhere else
const apiKey =
    '5c5de6ee8653ed7d78a06d6d-eLFe60k4CLlVuzhBkC3oHC2xQdzBnTFTv5vo1p2V1I7CxFOQYN';
//

module.exports = getOmnisendData;

async function getOmnisendData(apiList) {

    const data = [];

    for (const { siteName, apiKey } of apiList) {
        const subscriberCount = filterAndCountContacts(await fetchEmailContacts(apiKey));
        data.push({ siteName, subscriberCount })
    }

    return data;
}

async function fetchEmailContacts(apiKey) {

    const auth = {
        headers: {
            'x-api-key': apiKey
        }
    };

    const contacts = [];

    let results = await rp({
        uri: 'https://api.omnisend.com/v3/contacts',
        qs: {
            status: 'subscribed',
            limit: 1000,
            offset: 0
        },
        json: true,
        ...auth
    });

    contacts.push(...results.contacts);

    while (results.paging && results.paging.next) {
        const url = results.paging.next;
        results = await rp(url, { ...auth, json: true });
        contacts.push(...results.contacts);
    }

    return contacts;


}

function filterAndCountContacts(contacts) {
    const subscribedContacts = contacts.filter(({ status, createdAt }) => status === 'subscribed' && validateDateRange(createdAt));

    return (subscribedContacts.length);
}

function validateDateRange(targetDate, startDate, endDate) {
    if (!targetDate) {
        console.log('Function validateDateRange requires targetDate parameter.')
        return null;
    }

    const range = moment.range(
        startDate ? moment(startDate).startOf('day') : moment().startOf('day').subtract(7, 'days'),
        endDate ? moment(endDate).endOf('day') : moment().endOf('day')
    )
    return (range.contains(moment(targetDate)));
}
