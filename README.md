## Development server

First install all the depencies `npm install`

Then run `npx ng serve --open` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## To edit Open API Specification

First open the json file located in app/assests/ellenex-api.json, then make it edit on either on `[Swagger Editor](hhttps://editor.swagger.io/)` or install a extension in VSCode called "Swagger Viewer"

**<span style="color: red;">Note:</span>** Must follow the old format to make sure the tag is working, e.g.

```json
"x-tagGroups": [
    {
      "name": "Device Inventory",
      "tags": [
        "edi-v1"
      ]
    },
    {
      "name": "Alerts & Notifications",
      "tags": [
        "eara-v1",
        "edna-v1"
      ]
    },
    //...more tags can be added here
]
```

If you want to make more changes, go to the [app.component.ts](./src/app/app.component.ts) file.
