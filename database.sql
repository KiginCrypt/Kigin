begin transaction;

create table if not exists notes (
    id VARCHAR(16),
    title VARCHAR(128),
    body VARCHAR(2048),
    ownedBy VARCHAR(32),
    createdAt BIGINT
);

commit;