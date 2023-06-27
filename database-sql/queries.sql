-- Select user by ID
SELECT 
    "name", 
    "lastname", 
    "mail", 
    "password", 
    "phone", 
    "referer", 
    "nb_referer", 
    "role", 
    "rating", 
    "address", 
    "crea_date"
FROM dbo.users
WHERE dbo.users.user_ID = 0;
