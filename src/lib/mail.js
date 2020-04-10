'use strict';

const nodemailer = require('nodemailer');

async function main(attachment) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp-relay.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'no-reply@incomestore.com',
            privateKey:
                '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDYIXdUQVno2Ju1\n75u0av+CyI2EKSAuO+AMSa5AlwkWNob4vgcxLBOABMBjdRNbBavDFNIGny9j364s\nrk3L6WNL0W5vQyyhZ2NIbtM4V67IGPFQEMA67lylvX4C0b05RjCJ+lA/K5dLIU53\nnBQKqr4aNPCQrORHBzzusHlCaONpAyiCk2ozyNlQe3dr5UwQzac1TJfc+PhJ7t4o\nl1nBj/VKFDtyBXTdAoTaxsUFs6vX8Oj7h3W6ekKwHlRE0fDzG275quitu7D4XWGB\nZPsHn7FBC6wQ2JlyDhw+hktRIn6/Y4CaR2cVcWlFUa4qP3HhMus4NYCq+IlFeTBW\ncTQ/s3vLAgMBAAECggEAH5uxWGygSgnXp+Fta5LUYFuVOrVLBAf0qcdiyQZtqUZ7\nMciUw6+3AFtxiXoXRRIMvyB94MMKCritP9KUBRTSVUXBOVthHQ/CONcgY9aK9K+V\nJwj0HAo9GW4fjij/W+90bNFjSAHHhBDQaXS1h6PV3n5MilQGpI6d7ih362rsizBK\nwFIUBCA8ofEltmvJqhYJSfPjo4EldynS1W8YNCr8EW4rVX1xAezBpbd+NkMUX+Y8\nAw7qhf/B6Oa+JoAN37/YXfkh3RwQEa0udgrwznYony7BQtNzsSGG6HrCc64BBHYV\n/ulpFLiq6SXqICsqlTLG0pJFQVrsAXvaJcLTLsqMTQKBgQDsx6B8KNLRwT5pvWW7\n1Knv0F6o6xrs1twvCtrQ4zVjOgBtjUzBvl6MYJ/dhZTCJVAXFNWnvzF/ShOIJ5lI\nTRVrWoNcj3OiHoCF+h40+TxVHMmYzEET8QCzaREd3lyZJwItSzATKdf9IWlLmdvS\n9mUsuPSz7E3XFzpbJhG0LlBqNQKBgQDprL5vpYmHBviUKeJY6LFZMGnIxBevbQ45\nPS0Bgnr9bNIeKlwjEGI/zm5UA/qtahFxsrFIFnDKU1dcC/YZ8X/f3LUL/CX4ty/N\nFfZ5hZuztsO9TOEsW6O0V5ws+BwH2foGxaiMlOSG3ksY2ysz9iHkjJsESNGFvPJA\nlgSU5gEN/wKBgQCcw7ZvPaAGm8i0vV6jszMnwW9Kqw3SjJaO1sL01dk87uPlpE2T\nYHS8wCRXx98rgwS5o2Opgh5FRkgUNxN3GQH7Z5vdJmTKiyNQkL57GCBnwX1/movj\npgZuwjtA6T2pcHgygLs9lNCZmQtbsGwoClYF/BaXIPaQV6KdQmEqSBeZmQKBgFJx\nQdb+HmFnUjhj9pnLrxZ6gDf3Byw7W7NSJBjOQjo7NH60D0HHvAIrAL3fkYexTmpA\n009Nq4mWkdHF3pQUojsHEVEjKvpvFwxSXV1OiDqFltWo1CDkTAOKjW1INAuJGi9d\neTPwLBhxQSmJ2dpBUn/iI6cFUfbPTOEAjKlD5MddAoGBAJ5tEER2Jmp7MTgtlEaz\ndGEIkrJ2edhkJa0Fa9U/5uX2VcGJeCUNDaHjjcN9fw/KDIGMd2sbCn7cLyQUX7v0\neNQmsddJ4Kjeg76Ckajsc2J8vuos4lfzGYqYnVz59vILNOBRXerWJ6YUchOx1fwQ\nMn/Pb7TkfUJhP/xKvRGNw3XW\n-----END PRIVATE KEY-----\n',
            serviceClient: '106660000598764720914'
        }
    });

    transporter.on('token', token => {
        console.log('A new access token was generated');
        console.log('User: %s', token.user);
        console.log('Access Token: %s', token.accessToken);
        console.log('Expires: %s', new Date(token.expires));
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <no-reply@incomestore.com>', // sender address
        to: 'jzearfoss@incomestore.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>', // html body
        attachments: [
            {   // utf-8 string as an attachment
                filename: 'test.csv',
                content: attachment
            }
        ]
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
