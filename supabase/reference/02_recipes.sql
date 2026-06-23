CREATE TABLE public.recipes (
    id           BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title        VARCHAR(100)  NOT NULL,
    category     VARCHAR(100)  NOT NULL,
    cuisine      VARCHAR(100)  NOT NULL,
    ingredients  TEXT,
    instructions TEXT,
    created_at   TIMESTAMPTZ   DEFAULT now(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.recipes.title        IS 'recipe name';
COMMENT ON COLUMN public.recipes.category     IS 'e.g chicken, vegetarian, dessert';
COMMENT ON COLUMN public.recipes.cuisine      IS 'e.g. Italian, Mexican, Fusion';
COMMENT ON COLUMN public.recipes.ingredients  IS 'list of ingredients';
COMMENT ON COLUMN public.recipes.instructions IS 'cooking instructions';
COMMENT ON COLUMN public.recipes.created_at   IS 'set on insert';
COMMENT ON COLUMN public.recipes.updated_at   IS 'set on edit';
