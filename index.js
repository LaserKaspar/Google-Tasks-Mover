import { fail } from 'assert';
import { scopes, requestRefreshToken, authenticate, getMyLists, getTasksOfList, moveTask } from './google.cjs';

// TODO: Get tasks of list, get list by name

requestRefreshToken(scopes).then(token => {
    authenticate(token)
        .then(async () => {
            // Step 1: Obtain Lists
            // const lists = (await getMyLists()).data.items;
            // console.log(lists);

            // TODO: Let user select list
            const sourceList = { title: "Schule", id: "MDQ3NDQ5MTk0MjkwNDE5MTMwNjQ6MDow" };
            const targetList = { title: "Target", id: "LXQ5SmNRZVlQcXdlNDNHXw" };
            const swapNames = false;
            const swapLists = false; // TODO: Support

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
                while (true) {
                    let fails = 0;
                    try {
                        fails++;
                        await moveTask(item, sourceList.id, targetList.id);
                        console.log(`Moved ${index + 1}/${items.length} tasks.`);
                        break;
                    }
                    catch {
                        console.log("Ratelimited. Waiting...");
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