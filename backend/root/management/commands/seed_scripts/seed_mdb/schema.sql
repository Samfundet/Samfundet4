/*
    Generates a mdb dummy database schema for local development

    This schema should be identical to the schema for mdb on the ITK servers
    for all fields used by the mdb models (see queries in samfundet/models/mdb.py).
*/

DROP TABLE IF EXISTS "lim_medlemsinfo";

CREATE TABLE "lim_medlemsinfo" (
    medlem_id int NOT NULL,
    fornavn varchar(512) DEFAULT NULL,
    etternavn varchar(512) DEFAULT NULL,
    fodselsdato date DEFAULT NULL,
    telefon varchar(32) DEFAULT NULL,
    mail varchar(512) DEFAULT NULL,
    skole varchar(128) DEFAULT NULL,
    studie varchar(128) DEFAULT NULL,
    brukernavn varchar(14) NOT NULL,
    PRIMARY KEY (medlem_id)
);
