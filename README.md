# omnisend-email-list

A project that I worked on while at Income Store to retrieve weekly email subscriber counts and email them to employees.

### Disclaimer!

This code does not work properly any longer due to its reliance on **request** and **request-promise-native**
which have been deprecated and entered into maintenance mode. The **Omnisend API** has also been updated and returns
data in a different format than is the case in this tool. Since the tool is no longer used, no updating to the code will be performed.

### Dependencies

Use of this package requires:

-   config.js containing valid values for all fields found in config.template.js (_descriptions within_)
-   s3 bucket containing credentials.json from google and token.json containing oAuth2 tokens
-   AWS lambda function requires read/write permissions to s3
-   AWS cloudwatch event that passes array of email addresses (recipients) to lambda

### Usage

Set entry point on AWS lambda to `src/handler.js` and configure read/write permissions to S3
Configure dependencies and schedule task to run with Cloudwatch
That's it! You're done
