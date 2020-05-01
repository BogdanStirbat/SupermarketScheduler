-- USER
-- non-encrypted passwords:
-- regular.user@test.com:regular
-- manager.user@test.com:manager
INSERT INTO app_user (id, username, password, role) VALUES (1, 'regular.user@test.com', '$2a$10$TKloylsuFftdsXM7E8BAB.o556UTDTYKWwmgSaPyS4QE1zY8BI/tC', 'REGULAR_USER');
INSERT INTO app_user (id, username, password, role) VALUES (2, 'manager.user@test.com', '$2a$10$65v6zXWZll9zIUgXhp4kQ.nfmrKi5NeWXEfEEKi.0woWvYPRtEeQi', 'MANAGER_USER');