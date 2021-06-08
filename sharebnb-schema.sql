CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  bio TEXT,
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  address VARCHAR(50) NOT NULL,
  unit VARCHAR(10),
  city VARCHAR(30) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip INTEGER NOT NULL,
  country VARCHAR(3) NOT NULL,
  owner_id INTEGER REFERENCES users,
  title VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  price_per_hour NUMERIC CHECK (price_per_hour >= 0) NOT NULL,
  min_hours INTEGER NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES listings,
  renter_id INTEGER REFERENCES users,
  start_date DATE NOT NULL,
  num_hours INTEGER NOT NULL,
  total_price NUMERIC NOT NULL,
  booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  listing_id INTEGER REFERENCES listings,
  from_user_id INTEGER REFERENCES users,
  to_user_id INTEGER REFERENCES users,
  message TEXT NOT NULL,
  time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
  name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE listings_to_tags (
  listing_id INTEGER REFERENCES listings,
  tag VARCHAR(20) REFERENCES tags
);