'use strict';

const readline = require('readline-promise').default;
const { google } = require('googleapis');
const { getCredentials, getTokens, putTokens } = require('./s3');
const { spreadsheetId, tableRange, scopes } = require('../../config');

module.exports = getApiList;

// this google library contains all code for accessing the google sheet
// which contains the list of site and api keys needed for the omnisend
// mailing list

async function getApiList() {
    try {
        const credentials = await getCredentials();
        const auth = await authorize(credentials);
        return await listApis(auth, spreadsheetId, tableRange);
    } catch (err) {
        console.log('Error loading client secret file:', err);
        return [];
    }
}

// getNewToken is the fallback to update the tokens in s3 if they are no longer valid
async function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const code = await rl.questionAsync('Enter the code from that page here: ');
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await putTokens(tokens);
}

// authorize will take credentials from s3 bucket and use them to create an oAuth2 object
// and then fetchs tokens from s3. if the tokens aren't valid the function falls back on the
// getNewToken function to update the s3 bucket
async function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    try {
        const token = await getTokens();
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    } catch (err) {
        return await getNewToken(oAuth2Client);
    }
}

// listApis will get data from a google sheet and return as an array of objects
async function listApis(auth, spreadsheetId, range) {
    const sheets = google.sheets({ version: 'v4', auth });
    const result = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range
    });
    let rows = result.data.values;
    if (rows.length) {
        rows = rows.map(row => ({
            siteName: row[0],
            apiKey: row[1]
        }));

        return rows;
    } else {
        console.log('No data found.');
        return [];
    }
}
