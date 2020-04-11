'use strict';

const nodemailer = require('nodemailer');
const _ = require('lodash');
const { emailAddress } = require('../../config');
const { clientId, clientSecret } = require('../../credentials.json');
const { accessToken, refreshToken, expiry_date } = require('../../token.json');

module.exports = sendOmnisendEmail;

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

    // send mail with defined transport object
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

    return ('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

}
