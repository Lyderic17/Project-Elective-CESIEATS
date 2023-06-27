CREATE OR ALTER PROCEDURE dbo.createUser
    @username VARCHAR(65),
    @email VARCHAR(65),
    @password VARCHAR(30),
    @phone INT,
    @referer INT,
    @nb_referer INT,
    @role VARCHAR(65),
    @address TEXT,
    @crea_date DATETIME,
    @restaurantId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Insertion du restaurant
    IF (@restaurantId IS NOT NULL)
    BEGIN
        DECLARE @restaurantName VARCHAR(50);
        DECLARE @userID INT;

        -- Récupérer le nom du restaurant
        SELECT @restaurantName = rest_name FROM restaurants WHERE restaurant_ID = @restaurantId;

        -- Insertion du restaurant associé à l'utilisateur
        INSERT INTO restaurants (owner_ID, rest_name, address, phone, crea_date, rating, status)
        VALUES (@userID, @restaurantName, @address, @phone, @crea_date, NULL, 1);
    END

    SET NOCOUNT OFF;

    -- Declaring the variables to store the IDs
    DECLARE @userID INT;

    -- Insert the user
    INSERT INTO users (name, lastname, mail, password, phone, referer, nb_referer, role, rating, address, crea_date)
    VALUES (@username, NULL, @email, @password, @phone, @referer, @nb_referer, @role, NULL, @address, @crea_date);

    SET @userID = SCOPE_IDENTITY();

    -- Return the user ID
    SET @restaurantId = @userID;
END
