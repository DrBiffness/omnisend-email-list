'use strict';
const aws = require('aws-sdk');
const s3 = new aws.S3();

module.exports = {
    getCredentials,
    getTokens,
    putTokens
};

async function getCredentials() {
    const credentials = await s3
        .getObject({
            Bucket: 'test',
            Key: 'credentials.json'
        })
        .promise();
    return JSON.parse(credentials.toString());
}

async function getTokens() {
    const token = await s3
        .getObject({
            Bucket: 'test',
            Key: 'token.json'
        })
        .promise();
    return JSON.parse(token.toString());
}

async function putTokens(tokens) {
    await s3
        .putObject({
            Body: Buffer.from(JSON.stringify(tokens)),
            Bucket: 'test',
            Key: 'token.json'
        })
        .promise();
}
