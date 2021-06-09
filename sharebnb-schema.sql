CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  bio VARCHAR(120),
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  address VARCHAR(50) NOT NULL,
  unit VARCHAR(10),
  city VARCHAR(30) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip VARCHAR(10) NOT NULL,
  country VARCHAR(3) NOT NULL DEFAULT 'USA',
  owner_id INTEGER REFERENCES users NOT NULL,
  title VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  price_per_hour NUMERIC CHECK (price_per_hour >= 0) NOT NULL,
  min_hours INTEGER NOT NULL
);
-- TODO refactor to single data, not start time and start hour / startAt endAt 

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES listings NOT NULL,
  renter_id INTEGER REFERENCES users NOT NULL,
  start_date DATE NOT NULL,
  start_hour INTEGER,
  num_hours INTEGER NOT NULL,
  total_price NUMERIC NOT NULL,
  booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES listings NOT NULL,
  from_user_id INTEGER REFERENCES users NOT NULL,
  to_user_id INTEGER REFERENCES users NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tags (
  handle VARCHAR(20) PRIMARY KEY,
  description TEXT NOT NULL
);

CREATE TABLE listings_to_tags (
  listing_id INTEGER REFERENCES listings NOT NULL,
  tag VARCHAR(20) REFERENCES tags NOT NULL,
  PRIMARY KEY(listing_id, tag)
);

