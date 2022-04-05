begin transaction;

create table if not exists document (
    id VARCHAR(16),
    public VARCHAR(2048),
    "private" VARCHAR(2048),
    ownedBy VARCHAR(32),
    createdAt BIGINT
);

commit;