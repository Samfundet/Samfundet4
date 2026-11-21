-- Sample Samf3 rows for local development, loaded by `import_samf3 --create-dev-schema`.
-- Not loaded in tests. The image files are in dev_upload/, the default SAMF3_UPLOAD_ROOT.

INSERT INTO images (id, title, image_file_file_name, image_file_content_type) VALUES
    (1, 'Konsert', 'konsert.jpg', 'image/jpeg'),
    -- Large enough for Samf4 to create the smaller sizes.
    (2, 'Lørdagsfest', 'lordagsfest.jpg', 'image/jpeg'),
    -- No file in dev_upload/, like most old Samf3 images, so importing it is skipped.
    (3, 'Mangler fil', 'mangler.jpg', 'image/jpeg')
ON CONFLICT (id) DO NOTHING;

-- Times are UTC, like Rails stores them. Far in the future, so the boxes are still showing.
INSERT INTO info_boxes (id, title_no, title_en, body_no, body_en, link_no, link_en, image_id, image_state, color, start_time, end_time, position) VALUES
    (1, 'Konsert i Storsalen', 'Concert in Storsalen', 'Kjøp billett nå!', 'Buy a ticket now!', '/arrangement', NULL, 1, true, 'red', '2026-01-01 00:00', '2099-01-01 00:00', 1),
    (2, 'Bli frivillig', 'Volunteer', 'Søk opptak hos oss.', 'Apply to join us.', NULL, 'https://opptak.samfundet.no', 2, true, 'blue', '2026-01-01 00:00', '2099-01-01 00:00', 2),
    -- image_state is false, so the image isn't used.
    (3, 'Åpningstider', 'Opening hours', 'Se når vi har åpent.', 'See when we are open.', 'samfundet.no/apningstider', NULL, 1, false, 'white', '2026-01-01 00:00', '2099-01-01 00:00', 3),
    -- Its image file is missing, so the box is skipped.
    (4, 'Mangler bilde', 'Missing image', 'Denne hoppes over.', 'This one is skipped.', NULL, NULL, 3, true, 'green', '2026-01-01 00:00', '2099-01-01 00:00', 4),
    -- Ended, so it isn't imported.
    (5, 'Gammel boks', 'Old box', 'Ikke lenger vist.', 'No longer shown.', NULL, NULL, NULL, false, 'black', '2020-01-01 00:00', '2020-02-01 00:00', 5)
ON CONFLICT (id) DO NOTHING;
