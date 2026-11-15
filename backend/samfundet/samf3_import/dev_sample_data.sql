-- Sample Samf3 rows for local development, loaded by `import_samf3 --create-dev-schema`.
-- Not loaded in tests. The image files are in dev_upload/, the default SAMF3_UPLOAD_ROOT.

INSERT INTO images (id, title, image_file_file_name, image_file_content_type) VALUES
    (1, 'Konsert', 'konsert.jpg', 'image/jpeg'),
    -- Large enough for Samf4 to create the smaller sizes.
    (2, 'Lørdagsfest', 'lordagsfest.jpg', 'image/jpeg'),
    -- No file in dev_upload/, like most old Samf3 images, so importing it is skipped.
    (3, 'Mangler fil', 'mangler.jpg', 'image/jpeg')
ON CONFLICT (id) DO NOTHING;
