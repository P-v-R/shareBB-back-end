-- both test users have the password "password"

INSERT INTO users (first_name, last_name, email, bio, password, is_admin)
VALUES ('mo',
        'enokida',
        'mo@mo.com',
        'bio test',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        FALSE),
       ('perry',
        'von',
        'perry@perry.com',
        'bio test',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        TRUE),
        ('testdelete',
        'testdelete',
        'test@test.com',
        'bio test',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        FALSE);

INSERT INTO listings (address, 
                        unit,
                        city,
                        state,
                        zip,
                        country,
                        owner_id,
                        title,
                        description,
                        photo_url,
                        price_per_hour,
                        min_hours
                        )
                        
VALUES ('123 test st', 'A', 'Los Angeles', 'CA', '90064', 'USA', 1, 'mo test listing', 'this is my listing description',
        '1.jpg', 50.50 , 2),
        ('1111 test ave', '2B', 'Los Angeles', 'CA', '90010', 'USA', 2, 'perry test listing', 'this is my listing description',
        '2.jpg', 100, 5),
        ('2222 test ave', '', 'Los Angeles', 'CA', '90010', 'USA', 2, 'perry test listing', 'this is my listing description',
        '3.jpg', 100, 5),
        ('3333 test ave', '10B', 'Los Angeles', 'CA', '90020', 'USA', 2, 'perry test listing', 'this is my listing description',
        '801c39b7-03d3-4333-9aa7-7893cc2c8085', 100, 5);


INSERT INTO bookings (listing_id, renter_id, start_date, start_hour, num_hours, total_price)
VALUES (2, 1, '2021-07-20', 1330, 4, 400),
       (2, 1, '2021-07-21', 1200, 2, 200),
       (1, 2, '2021-07-10', 1500, 1, 50.50);



INSERT INTO messages (listing_id, from_user_id, to_user_id, message)
VALUES (1, 2, 1, 'from p to m'),
       (1, 1, 2, 'from m to p yes its available'),
       (2, 1, 2, 'from m to p test');


INSERT INTO tags (handle, description)
VALUES ('pool', 'Swimming Pool'),
       ('tub', 'Hot Tub'),
       ('sauna', 'Sauna'),
       ('grill', 'BBQ/Grill'),
       ('yard', 'Yard'),
       ('firepit', 'Fire Pit'),
       ('gym', 'Gym/Workout'),
       ('trampoline', 'Trampoline'),
       ('garden', 'Garden'),
       ('studio', 'Music Studio'),
       ('patio', 'Patio');


INSERT INTO listings_to_tags (listing_id, tag)
VALUES (1, 'pool'),
        (1, 'yard'),
        (2, 'trampoline'),
        (2, 'grill')