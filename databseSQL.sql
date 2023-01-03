
CREATE TABLE client (
  noClient CHAR(11) PRIMARY KEY,
  nomClient VARCHAR(30) NOT NULL,
  adresse VARCHAR(50),
  facebook VARCHAR(20),
  instagram VARCHAR(20),
  email VARCHAR(30) NOT NULL,
  signupDate DATE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  CHECK (noClient LIKE '__-___-____')
);

DELIMITER //
CREATE TRIGGER generate_no_client
BEFORE INSERT ON client
FOR EACH ROW
BEGIN
  DECLARE count INT DEFAULT 0;
  DECLARE prefix CHAR(7);

  SET prefix = CONCAT(RIGHT(CONCAT('0', DAYOFMONTH(NOW())), 2), '-', LEFT(UPPER(MONTHNAME(NOW())), 3));
  SELECT COUNT(*) INTO count FROM client WHERE noClient LIKE CONCAT(prefix, '-%');
  SET NEW.noClient = CONCAT(
    prefix,
    '-',
    LPAD(count + 1, 4, '0')
  );
END//
DELIMITER ;


DELIMITER //
CREATE TRIGGER set_signup_date
BEFORE INSERT ON client
FOR EACH ROW
BEGIN
  SET NEW.signupDate = NOW();
END//
DELIMITER ;



CREATE TABLE membership (
  idMembership INT PRIMARY KEY,
  nomMembership ENUM('none', 'silver', 'gold', 'platinum', 'ultimate') NOT NULL
);

CREATE TABLE clientMembership (
  noClient CHAR(11) PRIMARY KEY,
  idMembership INT NOT NULL,
  points INT NOT NULL DEFAULT 0,
  expiryDate DATE,
  FOREIGN KEY (noClient) REFERENCES client(noClient),
  FOREIGN KEY (idMembership) REFERENCES membership(idMembership)
);



CREATE TABLE article (
  noArticle CHAR(13) PRIMARY KEY,
  designation VARCHAR(50) NOT NULL,
  qteStock INT NOT NULL DEFAULT 0,
  prixAchat DECIMAL(10,2) NOT NULL,
  prixVente DECIMAL(10,2) NOT NULL,
  stockStatus ENUM('in stock', 'available', 'not available', 'out of stock') NOT NULL
);

CREATE TABLE commande (
  noCommande CHAR(15) PRIMARY KEY,
  date DATE NOT NULL,
  status ENUM('to buy', 'bought', 'packed', 'shipped','arrived','delivered','done'),
  dispatchedDate DATE,
  noParcel VARCHAR(255),
  arrivalDate DATE,
  totalCommande DECIMAL(10,2) NOT NULL,
  pointsGagne INT NOT NULL DEFAULT 0,
  CHECK (noCommande LIKE '______-___-C___')
);

ALTER TABLE commande
ADD noclient CHAR(11) not null,
ADD FOREIGN KEY (noclient) REFERENCES client(noclient);

DELIMITER //
CREATE TRIGGER generate_no_commande
BEFORE INSERT ON commande
FOR EACH ROW
BEGIN
  DECLARE count INT DEFAULT 0;

  SELECT COUNT(*) INTO count FROM commande WHERE noCommande LIKE CONCAT(DATE_FORMAT(NOW(), '%d%m%y'), '%-___-C%');
  SET NEW.noCommande = CONCAT(
    DATE_FORMAT(NOW(), '%d%m%y'),
    '-',
    SUBSTR(MD5(RAND()), 1, 3),
    '-C',
    LPAD(count + 1, 3, '0')
  );
END//
DELIMITER ;

CREATE TABLE commandeArticle (
  noCommande CHAR(15) ,
  noArticle CHAR(13) ,
  qteArticle INT NOT NULL,
  prixUnitaire DECIMAL(10,2) NOT NULL,
  remarque VARCHAR(200),
  articleStatus ENUM('free gift', 'packed', 'dispatched', 'arrived', 'delivered', 'other') NOT NULL,
  FOREIGN KEY (noCommande) REFERENCES commande(noCommande),
  FOREIGN KEY (noArticle) REFERENCES article(noArticle),
  primary key(noCommande,noArticle)
);

DELIMITER //
CREATE TRIGGER update_total_commande
AFTER INSERT ON commandeArticle
FOR EACH ROW
BEGIN
  UPDATE commande
  SET totalCommande = (
    SELECT SUM(qteArticle * prixUnitaire)
    FROM commandeArticle
    WHERE noCommande = NEW.noCommande
  )
  WHERE noCommande = NEW.noCommande;
END//
DELIMITER ;

CREATE TABLE facture (
  noFacture CHAR(15) PRIMARY KEY,
  dateFacture DATE NOT NULL,
  dateLastUpdate DATE,
  fraisService DECIMAL(10,2) NOT NULL,
  fraisLivraison DECIMAL(10,2) NOT NULL,
  remise DECIMAL(10,2) NOT NULL,
  depotApaye DECIMAL(10,2) NOT NULL,
  totalFacture DECIMAL(10,2) NOT NULL,
  CHECK (noFacture LIKE '______-___-F___') );
DELIMITER //
CREATE TRIGGER set_date_facture
BEFORE INSERT ON facture
FOR EACH ROW
BEGIN
  SET NEW.dateFacture = NOW();
END//
DELIMITER ;

CREATE TABLE depot (
noDepot INT PRIMARY KEY,
totalDepot DECIMAL(10,2) NOT NULL,
dateDepot DATE,
methodPaiement ENUM('cash', 'virement', 'points', 'chequesCadeau') NOT NULL,
noCommande CHAR(15),
FOREIGN KEY (noCommande) REFERENCES commande(noCommande)
);

CREATE TABLE reglement (
noReg INT PRIMARY KEY,
totalReg DECIMAL(10,2) NOT NULL,
dateReg DATE NOT NULL,
methodPaiement ENUM('cash', 'virement', 'points', 'chequesCadeau') NOT NULL,
noFacture CHAR(15),
FOREIGN KEY (noFacture) REFERENCES facture(noFacture)
);

INSERT INTO client (nomClient, adresse, facebook, instagram, email, phone)
VALUES
  ('John Smith', '123 Main Street', 'johnsmith', 'johnsmith', 'john@example.com', '555-555-1212'),
  ('Jane Doe', '456 Main Street', 'janedoe', 'janedoe', 'jane@example.com', '555-555-1213'),
  ('Bob Johnson', '789 Main Street', 'bobjohnson', 'bobjohnson', 'bob@example.com', '555-555-1214'),
  ('Alice Smith', '321 Main Street', 'alicesmith', 'alicesmith', 'alice@example.com', '555-555-1215'),
  ('John Doe', '654 Main Street', 'johndoe', 'johndoe', 'john@example.com', '555-555-1216'),
  ('Jane Smith', '987 Main Street', 'janesmith', 'janesmith', 'jane@example.com', '555-555-1217'),
  ('Bob Doe', '246 Main Street', 'bobdoe', 'bobdoe', 'bob@example.com', '555-555-1218'),
  ('Alice Johnson', '369 Main Street', 'alicejohnson', 'alicejohnson', 'alice@example.com', '555-555-1219'),
  ('John Johnson', '159 Main Street', 'johnjohnson', 'johnjohnson', 'john@example.com', '555-555-1220'),
  ('Jane Johnson', '753 Main Street', 'janejohnson', 'janejohnson', 'jane@example.com', '555-555-1221');
  
  INSERT INTO membership (idMembership, nomMembership)
VALUES
  (1, 'none'),
  (2, 'silver'),
  (3, 'gold'),
  (4, 'platinum'),
  (5, 'ultimate');
  

INSERT INTO clientMembership (noClient, idMembership, points, expiryDate)
VALUES
  ('30-DEC-0001', 1, 0, NULL),
  ('30-DEC-0002', 2, 100, '2022-12-31'),
  ('30-DEC-0003', 3, 200, '2022-12-31'),
  ('30-DEC-0004', 4, 300, '2022-12-31'),
  ('30-DEC-0005', 5, 400, '2022-12-31'),
	('30-DEC-0006', 1, 0, NULL),
  ('30-DEC-0007', 1, 0, NULL),
  ('30-DEC-0008', 1, 0, NULL),
  ('30-DEC-0009', 1, 0, NULL),
  ('30-DEC-0010', 1, 0, NULL);



INSERT INTO article (noArticle, designation, qteStock, prixAchat, prixVente, stockStatus)
VALUES
  ('ART-000000001', 'Product 1', 10, 10.00, 15.00, 'in stock'),
  ('ART-000000002', 'Product 2', 20, 20.00, 25.00, 'available'),
  ('ART-000000003', 'Product 3', 30, 30.00, 35.00, 'not available'),
  ('ART-000000004', 'Product 4', 40, 40.00, 45.00, 'in stock'),
  ('ART-000000005', 'Product 5', 50, 50.00, 55.00, 'available'),
  ('ART-000000006', 'Product 6', 60, 60.00, 65.00, 'not available'),
  ('ART-000000007', 'Product 7', 70, 70.00, 75.00, 'in stock'),
  ('ART-000000008', 'Product 8', 80, 80.00, 85.00, 'available'),
  ('ART-000000009', 'Product 9', 90, 90.00, 95.00, 'not available'),
  ('ART-000000010', 'Product 10', 100, 100.00, 105.00, 'in stock');
  
INSERT INTO commande ( date, status, dispatchedDate, noParcel, arrivalDate, totalCommande, pointsGagne, noclient)
VALUES
  ('2022-12-30', 'to buy', NULL, NULL, NULL, 0, 10, '30-DEC-0001'),
  ( '2022-12-30', 'bought', NULL, NULL, NULL, 0, 20, '30-DEC-0002'),
  ( '2022-12-30', 'packed', NULL, NULL, NULL, 0, 30, '30-DEC-0003'),
  ( '2022-12-30', 'shipped', '2022-12-31', 'PARCEL-0001', NULL, 0, 40, '30-DEC-0004'),
  ('2022-12-30', 'arrived', '2022-12-31', 'PARCEL-0002', '2022-12-31', 0, 50, '30-DEC-0005');

INSERT INTO commandeArticle (noCommande, noArticle, qteArticle, prixUnitaire, remarque, articleStatus)
VALUES
  ('301222-30b-C004', 'ART-000000001', 1, 15.00, NULL, 'free gift'),
  ('301222-37f-C001', 'ART-000000002', 2, 25.00, NULL, 'packed'),
  ('301222-1b3-C002', 'ART-000000003', 3, 35.00, NULL, 'dispatched'),
  ('301222-715-C003', 'ART-000000004', 4, 45.00, NULL, 'arrived'),
  ('301222-c5e-C005', 'ART-000000005', 5, 55.00, NULL, 'delivered'),
  ('301222-c5e-C005', 'ART-000000006', 6, 65.00, NULL, 'other'),
    ('301222-37f-C001', 'ART-000000003', 2, 25.00, NULL, 'packed');
    





