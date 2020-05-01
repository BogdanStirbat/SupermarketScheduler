CREATE TABLE app_user (
  id SERIAL,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  role varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

-- USER
-- non-encrypted passwords:
-- regular.user@test.com:regular
-- manager.user@test.com:manager
INSERT INTO app_user (username, password, role) VALUES ('regular.user@test.com', '$2a$10$TKloylsuFftdsXM7E8BAB.o556UTDTYKWwmgSaPyS4QE1zY8BI/tC', 'REGULAR_USER');
INSERT INTO app_user (username, password, role) VALUES ('manager.user@test.com', '$2a$10$65v6zXWZll9zIUgXhp4kQ.nfmrKi5NeWXEfEEKi.0woWvYPRtEeQi', 'MANAGER_USER');

CREATE TABLE supermarket (
  id SERIAL,
  name varchar(255) NOT NULL,
  address text NOT NULL,
  PRIMARY KEY (id)
);