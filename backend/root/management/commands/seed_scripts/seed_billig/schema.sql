/*
    Generates a billig dummy database schema for local development

    This schema should be identical to the schema for billig on the ITK servers
    for all fields used by the billig models (see queries in samfundet/models/billig.py).
*/


/* Billig Event */
DROP TABLE IF EXISTS [billig.event];
CREATE TABLE [billig.event] (
    event int NOT NULL,
    event_name varchar(140) NOT NULL,
    sale_from datetime NOT NULL,
    sale_to datetime NOT NULL,
    hidden boolean NOT NULL,
    PRIMARY KEY (event)
);

/* Ticket Group */
DROP TABLE IF EXISTS [billig.ticket_group];
CREATE TABLE [billig.ticket_group] (
    ticket_group int NOT NULL,
    event int NOT NULL,
    ticket_group_name varchar(140) NOT NULL,
    num_sold int NOT NULL,
    num int NOT NULL,
    PRIMARY KEY (ticket_group),
    FOREIGN KEY (event) REFERENCES [billig.event](event)
);

/* Price Group */
DROP TABLE IF EXISTS [billig.price_group];
CREATE TABLE [billig.price_group] (
    price_group int NOT NULL,
    ticket_group int NOT NULL,
    price_group_name varchar(140) NOT NULL,
    membership_needed boolean NOT NULL,
    can_be_put_on_card boolean NOT NULL,
    netsale boolean NOT NULL,
    price int NOT NULL,
    PRIMARY KEY (price_group),
    FOREIGN KEY (ticket_group) REFERENCES [billig.ticket_group](ticket_group)
);
