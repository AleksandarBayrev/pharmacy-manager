# PharmacyManager.API
## Notes
### Database structure
* Setup your server connection in appsettings.json
* Structure for the table that will store the medicines (example for PostgreSQL, recommended database):
```t
id => uuid
manufacturer => text
name => text
description => text
manufacturingDate => date
expirationDate => date
price => numeric(30,8)
quantity => bigint
deleted => boolean
```

## Build notes
* For Linux you can build the application with the publish-linux shell script.