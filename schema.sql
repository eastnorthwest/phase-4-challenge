CREATE TABLE albums (
  id SERIAL,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY, 
  session VARCHAR(255), 
  name VARCHAR(255) NOT NULL, 
  email VARCHAR(255) NOT NULL, 
  password VARCHAR(255) NOT NULL, 
  datetime TIMESTAMP
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY, 
  text VARCHAR(255) NOT NULL, 
  datetime TIMESTAMP
);

CREATE TABLE users_reviews (
  user_id INTEGER REFERENCES users (id), 
  album_id INTEGER REFERENCES albums (id),
  review_id INTEGER REFERENCES reviews (id)
);

