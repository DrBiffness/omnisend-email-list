'use strict';

module.exports = {
    emailAddress: 'email address to be used to send messages',
    scopes: 'array of strings containing permissions needed from google',
    spreadsheetId: 'id of google sheet',
    tableRange: '<sheetName>!<cellRange ex. A2:B>',
    dateRange: {
        startDate: 'Date or moment object',
        endDate: 'Date or moment object'
    }
};
