-- Address table creation
CREATE TABLE dbo.address (
	id BIGINT PRIMARY KEY IDENTITY(0, 1),
	country VARCHAR(30) NOT NULL,
	zipcode VARCHAR(8) NOT NULL,
	city VARCHAR(40) NULL,
	address VARCHAR(100) NULL
);

-- Billing table creation
CREATE TABLE dbo.billing (
	id BIGINT PRIMARY KEY IDENTITY(0, 1),
	number CHAR(16) NULL,
	crypto CHAR(3) NULL,
	owner VARCHAR(255) NULL
);

-- User table creation
CREATE TABLE dbo.users (
	id BIGINT PRIMARY KEY IDENTITY(0, 1),
	username VARCHAR(255) NOT NULL,
	usertype TINYINT NOT NULL,	-- 0: Admin, 1: Commercial, 2: Technique, 3: Restaurateur, 4: Livreur, 5: User, 6: Developpeur
	email VARCHAR(100) NOT NULL,
	password VARCHAR(255) NOT NULL,
	firstname VARCHAR(50) NULL,
	lastname VARCHAR(50) NULL
);

-- User Address table creation
CREATE TABLE dbo.useraddress (
	userid BIGINT NOT NULL,
	addressid BIGINT NOT NULL,

    CONSTRAINT pk_userid_adressid PRIMARY KEY CLUSTERED (userid, addressid),
	
	CONSTRAINT fk_address_userid FOREIGN KEY (userid) REFERENCES dbo.users(id),
	CONSTRAINT fk_address_addressid FOREIGN KEY (addressid) REFERENCES dbo.address(id)
);

-- User Billing table creation
CREATE TABLE dbo.userbilling (
	userid BIGINT NOT NULL,
	billingid BIGINT NOT NULL,

    CONSTRAINT pk_userid_billingid PRIMARY KEY CLUSTERED (userid, billingid),
	
	CONSTRAINT fk_billing_userid FOREIGN KEY (userid) REFERENCES dbo.users(id),
	CONSTRAINT fk_billing_billingid FOREIGN KEY (billingid) REFERENCES dbo.billing(id)
);
-- Restaurants table creation
CREATE TABLE dbo.restaurants (
    id INT PRIMARY KEY IDENTITY(1, 1),
    name VARCHAR(255) NOT NULL,
    userId BIGINT NOT NULL,
    CONSTRAINT fk_restaurants_users FOREIGN KEY (userId) REFERENCES dbo.users(id)
);