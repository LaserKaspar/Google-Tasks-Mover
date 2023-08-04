# Google Tasks - Mover

A tool to move your Google Tasks between lists in bulk. Due to API limitations it is really slow <1 Task / Second.

This makes it possible to change the default list for Google Assistant. (You can just swap the two lists)

I hope this helps someone until Google finally adds a feature to change Google Assistants default Tasklist. 

## Usage

Configure [Google API Access](https://console.cloud.google.com/apis/dashboard) at [this Website](https://console.cloud.google.com/apis/dashboard) and place the ``oauth2.keys.json`` file in this directory. You can obtain this file in Credentails -> OAuth 2.0 -> Download Client -> Download JSON. It will look something like this:
```json
{
    "web": {
        "client_id":"*.apps.googleusercontent.com",
        "project_id":"*",
        "auth_uri":"https://accounts.google.com/o/oauth2/auth",
        "token_uri":"https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
        "client_secret":"*",
        "redirect_uris":["http://localhost:3000/oauth2callback"]
    }
}
```

Next you need to install all dependencies and run index.js via ``npm install && node .``.

This will open a browser window for you to authenticate your app and allow it to edit your Google Tasks via the API.

You will now see your lists in the console outputs. Copy the IDs of your list in your ``.env`` file like this:
```
SOURCE_NAME="My Source List"
SOURCE_ID="kJDbGjEiMSPdKXZMexRl"
TARGET_NAME="My Target List"
TARGET_ID="tawronHPZPBkWehAGIZp"
```

Lastly you need to run ``node .`` again and authenticate once more. This will then start the moving process.

## GAPI Docs

[Google Tasks Rest-API Docs](https://developers.google.com/tasks/reference/rest)

## TODO:

- Don't just move one to the other - instead swap the lists completely
- automatically swap the name of the lists