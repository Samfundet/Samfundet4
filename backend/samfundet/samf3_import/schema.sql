-- The Samf3 tables the import reads, for local development and tests.
-- Based on Samf3's schema (pg_dump --schema-only), simplified to use bigserial.
-- Add a table here when you add an importer that reads it.

CREATE TABLE IF NOT EXISTS everything_closed_periods (
    id bigserial PRIMARY KEY,
    message_no text,
    closed_from timestamp(6) without time zone,
    closed_to timestamp(6) without time zone,
    message_en text,
    event_message_no text,
    event_message_en text
);
