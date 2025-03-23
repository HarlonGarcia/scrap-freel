CREATE TABLE tb_freelance (
    id UUID NOT NULL
        CONSTRAINT pk_freelance
        PRIMARY KEY DEFAULT (gen_random_uuid()),
    title VARCHAR(255) NOT NULL,
    budget FLOAT NOT NULL,
    currency VARCHAR(3) NOT NULL,
    originSiteName VARCHAR(255) NOT NULL,
    originUrl TEXT NOT NULL UNIQUE,
    publicated_at TIMESTAMP DEFAULT (now())
);