-- The Samf3 tables the import reads, for local development and tests.
-- Based on Samf3's schema (db/schema.rb in the Samfundet repo), simplified to use bigserial.
-- created_at/updated_at default to now() here so sample and test rows can leave them out; Rails sets them in Samf3.
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

CREATE TABLE IF NOT EXISTS images (
    id bigserial PRIMARY KEY,
    title character varying,
    uploader_id integer,
    image_file_file_name character varying,
    image_file_content_type character varying,
    image_file_file_size integer,
    image_file_updated_at timestamp(6) without time zone,
    created_at timestamp(6) without time zone NOT NULL DEFAULT now(),
    updated_at timestamp(6) without time zone NOT NULL DEFAULT now()
);
