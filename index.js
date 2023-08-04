import { fail } from 'assert';
import { scopes, requestRefreshToken, authenticate, getMyLists, getTasksOfList, moveTask } from './google.cjs';

import dotenv from 'dotenv'
dotenv.config();

requestRefreshToken(scopes).then(token => {
    authenticate(token)
        .then(async () => {
            if(!(process.env.SOURCE_NAME && process.env.SOURCE_ID && process.env.TARGET_NAME && process.env.TARGET_ID)) {
                console.log("Please configure your .env file.")
                // Step 1: Obtain Lists
                const lists = (await getMyLists()).data.items;
                console.log(lists.map(list => {return { title: list.title, id: list.id }}));
                return;
            }

            const sourceList = { title: process.env.SOURCE_NAME, id: process.env.SOURCE_ID };
            const targetList = { title: process.env.TARGET_NAME, id: process.env.TARGET_ID };

            // Step 2: Get Tasks of Lists
            console.log("Fetching tasks of list", sourceList.title);
            let items = [];
            let data;
            do {
                data = (await getTasksOfList(sourceList.id, 100, data?.nextPageToken)).data;
                items = items.concat(data.items);
            } while (data?.nextPageToken);

            console.log(`Found ${items.length} tasks.`);

            // Step 3: Move Tasks
            console.log("Start moving tasks to list", targetList.title);

            for (const [index, item] of items.entries()) {
                let fails = 0;
                while (true) {
                    try {
                        await moveTask(item, sourceList.id, targetList.id);
                        console.log(`Moved ${index + 1}/${items.length} tasks.`);
                        break;
                    }
                    catch {
                        fails++;
                        console.log(`Ratelimited. Waiting... (x${fails})`);
                        await timeout(1000 * fails); // Google API Rate Limiting
                    }
                }
            }

            console.log("Moving done");
        })
        .catch(console.error);
});

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log("INIT");