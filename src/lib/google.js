'use strict';
const { spreadsheetId, tableRange, scopes, tokenPath } = require('../../config');

module.exports = getApiList;

async function getApiList() {

    try {
        //TODO: This will turn into S3 Bucket
        const content = require('../../credentials.json');
        //
        const auth = await authorize(content);
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

    const code = await rl.questionAsync(
        'Enter the code from that page here: '
    );
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await fs.writeFile(tokenPath, JSON.stringify(tokens));

}

async function authorize(credentials) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    try {
        const token = require(tokenPath);
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

