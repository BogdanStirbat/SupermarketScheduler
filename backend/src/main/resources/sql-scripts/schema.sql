CREATE TABLE app_user (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  role varchar(255) NOT NULL,
  PRIMARY KEY (id)
);