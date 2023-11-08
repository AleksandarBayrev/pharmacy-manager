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
* OR you can use `pharmacymanager.tar` file to restore the structure in PostgreSQL

## Build notes
* For Linux you can build the application with the publish-linux shell script.

## Running the application
* !!! IMPORTANT !!! - run only ONE instance of the application simultaneously, since it uses an in memory cache to store data and there can be data discrepancies if you try to run two instances. A future release will probably extract the data into a separate cache application if such case for multiple web server instances needed.