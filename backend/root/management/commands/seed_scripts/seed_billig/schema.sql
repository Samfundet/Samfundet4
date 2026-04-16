/*
    Generates a billig dummy database schema for local development

    This schema should be identical to the schema for billig on the ITK servers
    for all fields used by the billig models (see queries in samfundet/models/billig.py).
*/

/* Drop Tables */
DROP VIEW IF EXISTS "billig.event_lim_web";
DROP TABLE IF EXISTS "billig.ticket";
DROP TABLE IF EXISTS "billig.payment_error_price_group";
DROP TABLE IF EXISTS "billig.price_group";
DROP TABLE IF EXISTS "billig.purchase";
DROP TABLE IF EXISTS "billig.ticket_card";
DROP TABLE IF EXISTS "billig.ticket_group";
DROP TABLE IF EXISTS "billig.payment_error";
DROP TABLE IF EXISTS "billig.event";

/* Billig Event */
CREATE TABLE "billig.event" (
    event int NOT NULL,
    event_name varchar(140) NOT NULL,
    event_location varchar(255),
    event_note text,
    event_time timestamp,
    event_type varchar(255),
    external_id int,
    organisation int,
    a4_ticket_layout int,
    receipt_ticket_layout int,
    tp_ticket_layout int,
    dave_id int,
    dave_time_id int,
    sale_from timestamp NOT NULL,
    sale_to timestamp NOT NULL,
    hidden boolean NOT NULL,
    PRIMARY KEY (event)
);

CREATE VIEW "billig.event_lim_web" AS
SELECT
    event,
    event_name,
    event_location,
    event_note,
    event_time,
    event_type,
    external_id,
    organisation,
    a4_ticket_layout,
    receipt_ticket_layout,
    tp_ticket_layout,
    dave_id,
    dave_time_id,
    sale_from,
    sale_to,
    hidden
FROM "billig.event";

/* Ticket Group */
CREATE TABLE "billig.ticket_group" (
    ticket_group int NOT NULL,
    event int NOT NULL,
    ticket_group_name varchar(140) NOT NULL,
    is_theater_ticket_group boolean NOT NULL DEFAULT FALSE,
    ticket_limit int,
    num_sold int NOT NULL,
    num int NOT NULL,
    PRIMARY KEY (ticket_group),
    FOREIGN KEY (event) REFERENCES "billig.event"(event)
);

/* Price Group */
CREATE TABLE "billig.price_group" (
    price_group int NOT NULL,
    ticket_group int NOT NULL,
    price_group_name varchar(140) NOT NULL,
    membership_needed boolean NOT NULL,
    can_be_put_on_card boolean NOT NULL,
    netsale boolean NOT NULL,
    price int NOT NULL,
    PRIMARY KEY (price_group),
    FOREIGN KEY (ticket_group) REFERENCES "billig.ticket_group"(ticket_group)
);

/* Purchase */
CREATE TABLE "billig.purchase" (
    purchase int NOT NULL,
    owner_member_id int,
    owner_email varchar(254),
    PRIMARY KEY (purchase)
);

/* Ticket Card */
CREATE TABLE "billig.ticket_card" (
    card bigint NOT NULL,
    owner_member_id int,
    membership_ends date,
    PRIMARY KEY (card)
);

/* Ticket */
CREATE TABLE "billig.ticket" (
    ticket int NOT NULL,
    price_group int NOT NULL,
    purchase int NOT NULL,
    used timestamp,
    refunded timestamp,
    on_card boolean NOT NULL,
    refunder text,
    point_of_refund int,
    PRIMARY KEY (ticket),
    FOREIGN KEY (price_group) REFERENCES "billig.price_group"(price_group),
    FOREIGN KEY (purchase) REFERENCES "billig.purchase"(purchase)
);

/* Payment Error */
CREATE TABLE "billig.payment_error" (
    error varchar(64) NOT NULL,
    failed timestamp,
    owner_cardno varchar(140),
    owner_email varchar(254),
    message text NOT NULL,
    PRIMARY KEY (error)
);

/* Payment Error Price Group */
CREATE TABLE "billig.payment_error_price_group" (
    error varchar(64) NOT NULL,
    price_group int NOT NULL,
    number_of_tickets int NOT NULL,
    FOREIGN KEY (error) REFERENCES "billig.payment_error"(error)
);
