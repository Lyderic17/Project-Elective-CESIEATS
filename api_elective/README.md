# api_elective

## Database access
### MongoDB [NoSQL]
```
mongodb+srv://cluster-elective.n6ixa.mongodb.net/elective?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority
mongodb+srv://cluster0corbeille.j2rawlj.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority
```
```
mongodb+srv://access:<password>@cluster-elective.n6ixa.mongodb.net/elective?retryWrites=true&w=majority
```

### Microsoft SQL Server [SQL]
```
Driver=<ODBC Driver 13 for SQL Server>;Server=tcp:elective-sql-database.database.windows.net,1433;Database=SQL-Elective;Uid=rubis;Pwd=<password>;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;
Driver={ODBC Driver 17 for SQL Server};Server=PC-LYDERIC;Database=master;Uid=PC-LYDERIC\lyderic;Trusted_Connection=yes;
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
