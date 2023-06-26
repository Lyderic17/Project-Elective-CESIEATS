-- User creation
CREATE OR ALTER PROCEDURE dbo.createUser
    @username VARCHAR(255),
    @usertype TINYINT,
    @email VARCHAR(100),
    @password VARCHAR(255),
    @firstname VARCHAR(50),
    @lastname VARCHAR(50),
    @country VARCHAR(30),
    @zipcode VARCHAR(8),
    @city VARCHAR(40),
    @address VARCHAR(100),
    @number CHAR(16),
    @crypto CHAR(3),
    @owner VARCHAR(255),
    @restaurantId INT OUTPUT
AS
    SET NOCOUNT ON;

    -- Insertion du restaurant
    IF (@usertype = 3 AND @restaurantId IS NOT NULL)
    BEGIN
        DECLARE @restaurantName VARCHAR(255);
        DECLARE @userID BIGINT;

        -- Récupérer le nom du restaurant
        SELECT @restaurantName = name FROM dbo.restaurants WHERE id = @restaurantId;

        -- Insertion du restaurant associé à l'utilisateur
        INSERT INTO dbo.restaurants (name, userId)
        VALUES (@restaurantName, @userID);
    END

    SET NOCOUNT OFF;

    -- Declaring the variables to store the IDs
    DECLARE @addressID BIGINT;
    DECLARE @billingID BIGINT;
    DECLARE @userID BIGINT;

    -- Insert the user
    INSERT INTO dbo.users ("username", "usertype", "email", "password", "firstname", "lastname")
    VALUES (@username, @usertype, @email, @password, @firstname, @lastname);

    SET @userID = SCOPE_IDENTITY();

    -- Insert the address
    IF (NOT ((@country IS NULL OR @country = '') AND (@zipcode IS NULL OR @zipcode = '')))
    BEGIN
        INSERT INTO dbo.address ("country", "zipcode", "city", "address")
        VALUES (@country, @zipcode, @city, @address);

        SET @addressID = SCOPE_IDENTITY();

        INSERT INTO dbo.useraddress ("userid", "addressid")
        VALUES (@userID, @addressID);
    END

    -- Insert the billing
    IF (NOT ((@number IS NULL OR @number = '') OR (@crypto IS NULL OR @crypto = '') OR (@owner IS NULL OR @owner = '')))
    BEGIN
        INSERT INTO dbo.billing ("number", "crypto", "owner")
        VALUES (@number, @crypto, @owner);

        SET @billingID = SCOPE_IDENTITY();

        INSERT INTO dbo.userbilling ("userid", "billingid")
        VALUES (@userID, @billingID);
    END

    SET NOCOUNT OFF;

-- Return the user ID
RETURN @userID;
GO
