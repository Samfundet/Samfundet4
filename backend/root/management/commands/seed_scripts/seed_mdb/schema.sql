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

/*
 This is a mock-function of the sett_lim_utvidet_medlemsinfo function.
 Returns medlem_id on success, otherwise no result.
 Password must be 'password'
 */
CREATE OR REPLACE FUNCTION sett_lim_utvidet_medlemsinfo(
    p_email_or_id TEXT,
    p_password TEXT
)
RETURNS SETOF INTEGER AS $$
BEGIN
    IF p_password <> 'password' THEN
        RETURN;
    END IF;

    IF p_email_or_id ~ '^\d+$' THEN
        RETURN QUERY
            SELECT medlem_id
            FROM lim_medlemsinfo
            WHERE medlem_id = p_email_or_id::INTEGER
            LIMIT 1;
    ELSIF p_email_or_id LIKE '%@%' THEN
        RETURN QUERY
            SELECT medlem_id
            FROM lim_medlemsinfo
            WHERE mail = p_email_or_id
            LIMIT 1;
    END IF;

    RETURN;
END;
$$ LANGUAGE plpgsql;
