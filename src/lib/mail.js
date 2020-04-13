'use strict';

const nodemailer = require('nodemailer');
const _ = require('lodash');
const { emailAddress } = require('../../config');
const { clientId, clientSecret } = require('../../credentials.json');
const { accessToken, refreshToken, expiry_date } = require('../../token.json');

// contains the function to send an email using nodemailer

module.exports = sendOmnisendEmail;

// sendOmnisendEmail expects an object containing the contents of an email
// message and then creates the transport using the credentials for
// the gmail address in config.js and will send the email with all the necessary
// oAuth2 data
async function sendOmnisendEmail({ recipient, subject, text, attachments }) {
    if (!recipient || !subject || !text) {
        console.log('Recipient, subject, and text are required fields');
        return;
    }

    if (!_.isArray(attachments)) {
        console.log('Attachments must be array of objects');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            clientId,
            clientSecret
        }
    });

    const info = transporter.sendMail({
        from: emailAddress,
        to: recipient,
        subject,
        text,
        attachments,
        auth: {
            user: emailAddress,
            refreshToken,
            accessToken,
            expires: expiry_date
        }
    });

    return 'Message sent: %s', info.messageId;
}
