'use strict';
const aws = require('aws-sdk');
const readline = require('readline-promise').default;
const { google } = require('googleapis');
const fs = require('fs-extra');
const s3 = new aws.S3();
const {
    spreadsheetId,
    tableRange,
    scopes,
    tokenPath
} = require('../../config');

module.exports = getApiList;

async function getApiList() {
    try {
        let credentials = await s3
            .getObject({
                Bucket: 'test',
                Key: 'credentials.json'
            })
            .promise();
        credentials = JSON.parse(credentials.toString());
        //
        const auth = await authorize(credentials);
        return await listApis(auth, spreadsheetId, tableRange);
    } catch (err) {
        console.log('Error loading client secret file:', err);
        return [];
    }
}

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
    await s3
        .putObject({
            Body: Buffer.from(JSON.stringify(tokens)),
            Bucket: 'test',
            Key: 'token.json'
        })
        .promise();
}

async function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    try {
        let token = await s3
            .getObject({
                Bucket: 'test',
                Key: 'token.json'
            })
            .promise();
        token = JSON.parse(token.toString());
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    } catch (err) {
        return await getNewToken(oAuth2Client);
    }
}

async function listApis(auth, spreadsheetId, range) {
    const sheets = google.sheets({ version: 'v4', auth });
    const result = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range
    });
    let rows = result.data.values;
    if (rows.length) {
        // // Print columns A and E, which correspond to indices 0 and 4.

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
