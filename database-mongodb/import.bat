:: Import the menus
::mongoimport --uri "mongodb+srv://cluster-elective.n6ixa.mongodb.net/elective?authSource=%%24external&authMechanism=MONGODB-X509" --ssl --sslPEMKeyFile "..\X509-cert-1119002791897168537.pem" --collection menus --file "menu.json"

:: Import the restaurants
::mongoimport --uri "mongodb+srv://cluster-elective.n6ixa.mongodb.net/elective?authSource=%%24external&authMechanism=MONGODB-X509" --ssl --sslPEMKeyFile "..\X509-cert-1119002791897168537.pem" --collection restaurants --file "restaurant.json"

:: Import the orders
::mongoimport --uri "mongodb+srv://cluster-elective.n6ixa.mongodb.net/elective?authSource=%%24external&authMechanism=MONGODB-X509" --ssl --sslPEMKeyFile "..\X509-cert-1119002791897168537.pem" --collection orders --file "order.json"



mongoimport --uri "mongodb+srv://lyderic12@cluster0corbeille.j2rawlj.mongodb.net/Elective?authSource=%%24external" --ssl --sslPEMKeyFile "..\X509-cert-1119002791897168537.pem" --authenticationDatabase "$external" --authenticationMechanism "MONGODB-X509" --collection menus --file "menu.json"
mongoimport --uri "mongodb+srv://lyderic12@cluster0corbeille.j2rawlj.mongodb.net/Elective?authSource=%%24external" --ssl --sslPEMKeyFile "..\X509-cert-1119002791897168537.pem" --authenticationDatabase "$external" --authenticationMechanism "MONGODB-X509" --collection restaurants --file "restaurant.json"

mongoimport --uri "mongodb+srv://lyderic12@cluster0corbeille.j2rawlj.mongodb.net/Elective?authSource=%%24external" --ssl --sslPEMKeyFile "..\X509-cert-1119002791897168537.pem" --authenticationDatabase "$external" --authenticationMechanism "MONGODB-X509" --collection orders --file "order.json" 