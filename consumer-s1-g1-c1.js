// producer-s1-p1.js

const { exec } = require('child_process');
const npmInstallCommand = 'npm i memphis-dev --save';

exec(npmInstallCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }

  // Print the output of the command
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

// Load environment variables from .env file
require('dotenv').config();

// Access environment variables
const AccountID = process.env.AccountID;
const Host = process.env.Host;
const User = process.env.User;
const Pass = process.env.Pass;

const { memphis } = require('memphis-dev');

(async function () {
    let memphisConnection;

    try {
        memphisConnection = await memphis.connect({
            host: Host,
            username: User,
            password: Pass,
            accountId: AccountID
        });

        const consumer = await memphisConnection.consumer({
            stationName: 'eventlog-1',
            consumerName: 'consumer-NJS-Barak-1',
            consumerGroup: "NJS-Gido-1",
        });

        consumer.setContext({ key: "value" });
        consumer.on('message', (message, context) => {
            console.log(message.getData().toString());
            message.ack();
        });

        consumer.on('error', (error) => {});
    } catch (ex) {
        console.log(ex);
        if (memphisConnection) memphisConnection.close();
    }
})();
        