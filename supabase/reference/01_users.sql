CREATE TABLE public.users (
    id          UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name  VARCHAR(50)   NOT NULL,
    last_name   VARCHAR(50)   NOT NULL,
    user_name   VARCHAR(20)   NOT NULL,
    email       VARCHAR(255)  NOT NULL,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
