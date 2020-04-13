'use strict';

const rp = require('request-promise-native');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const { startDate, endDate } = require('../config').dateRange;

// contains functions to retrieve data from omnisend api

module.exports = getOmnisendData;

async function getOmnisendData(apiList) {
    const data = [];

    for (const { siteName, apiKey } of apiList) {
        const subscriberCount = filterAndCountContacts(
            await fetchEmailContacts(apiKey)
        );
        data.push({ siteName, subscriberCount });
    }

    return data;
}

// returns all email contacts(lifetime) from omnisend api for a given site
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

    // returned json from api can contain multiple pages
    // loop retrieves data from all pages
    while (results.paging && results.paging.next) {
        const url = results.paging.next;
        results = await rp(url, { ...auth, json: true });
        contacts.push(...results.contacts);
    }

    return contacts;
}

// returns number of email contacts that were created in a
// specified time period. define time period in config
function filterAndCountContacts(contacts) {
    const subscribedContacts = contacts.filter(
        ({ status, createdAt }) =>
            status === 'subscribed' &&
            validateDateRange(createdAt, startDate, endDate)
    );

    return subscribedContacts.length;
}

// verifies that targetDate is within specified range
function validateDateRange(targetDate, startDate, endDate) {
    if (!targetDate) {
        console.log(
            'Function validateDateRange requires targetDate parameter.'
        );
        return null;
    }

    const range = moment.range(
        startDate
            ? moment(startDate).startOf('day')
            : moment()
                  .startOf('day')
                  .subtract(7, 'days'),
        endDate ? moment(endDate).endOf('day') : moment().endOf('day')
    );
    return range.contains(moment(targetDate));
}
