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

const { memphis } = require("memphis-dev");

(async function () {
    let memphisConnection

    try {
        memphisConnection = await memphis.connect({
            host: Host,
            username: User,
            password: Pass,
            accountId: AccountID
        });

        const producer = await memphisConnection.producer({
            stationName: 'eventlog-1',
            producerName: 'producer-NJS-Barak-1'
        });

        var payload = {
            fname: "Barak",
            lname: "Gido",
        };

		const headers = memphis.headers()
		headers.add("age", "33")
		headers.add("city", "Tel Aviv")

        // Infinite loop for producing messages
        while (true) {
            await producer.produce({
                message: payload,
                headers: headers,
                asyncProduce: true
            });
            await new Promise(resolve => setTimeout(resolve, 5000)); // 1 second delay
        }

        memphisConnection.close();
    } catch (ex) {
        console.log(ex);
        if (memphisConnection) memphisConnection.close();
    }
})();
        