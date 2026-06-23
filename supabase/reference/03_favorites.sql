CREATE TABLE public.favorites (
    id        BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id   UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mealdb_id VARCHAR(255)  NOT NULL,
    title     VARCHAR(50)   NOT NULL,
    saved_at  TIMESTAMPTZ   DEFAULT now()
);

COMMENT ON COLUMN public.favorites.mealdb_id IS 'The MealDB recipe ID from the API';
COMMENT ON COLUMN public.favorites.saved_at  IS 'when recipe was saved';
