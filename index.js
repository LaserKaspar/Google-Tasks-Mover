import { scopes, requestRefreshToken, authenticate, getMyLists } from './google.cjs';

// TODO: Get tasks of list, get list by name

requestRefreshToken(scopes).then(token => {
    authenticate(token)
        .then(async () => {
            const lists = (await getMyLists()).data.items;
            console.log(lists);

            //TODO: Let user select list
        })
        .catch(console.error);
});

console.log("INIT");