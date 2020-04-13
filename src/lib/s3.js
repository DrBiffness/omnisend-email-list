'use strict';
const aws = require('aws-sdk');
const s3 = new aws.S3();

// contains common functions to get and store data in s3

module.exports = {
    getCredentials,
    getTokens,
    putTokens
};

// returns credentials from s3 in a JS object
async function getCredentials() {
    const credentials = await s3
        .getObject({
            Bucket: 'test',
            Key: 'credentials.json'
        })
        .promise();
    return JSON.parse(credentials.toString());
}

// returns tokens from s3 in a JS object
async function getTokens() {
    const token = await s3
        .getObject({
            Bucket: 'test',
            Key: 'token.json'
        })
        .promise();
    return JSON.parse(token.toString());
}

// writes tokens as JSON in s3
async function putTokens(tokens) {
    await s3
        .putObject({
            Body: Buffer.from(JSON.stringify(tokens)),
            Bucket: 'test',
            Key: 'token.json'
        })
        .promise();
}
