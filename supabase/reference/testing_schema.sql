CREATE TABLE "users"(
    "id" UUID NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "user_name" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
CREATE TABLE "recipes"(
    "id" BIGINT NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "cuisine" VARCHAR(100) NOT NULL,
    "ingredients" TEXT NULL,
    "instructions" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "recipes" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "recipes"."title" IS 'recipe name';
COMMENT
ON COLUMN
    "recipes"."category" IS 'e.g chicken, vegetarian, dessert';
COMMENT
ON COLUMN
    "recipes"."cuisine" IS 'e.g. Italian, Mexican, Fusion';
COMMENT
ON COLUMN
    "recipes"."ingredients" IS 'list of ingredients';
COMMENT
ON COLUMN
    "recipes"."instructions" IS 'cooking instructions';
COMMENT
ON COLUMN
    "recipes"."created_at" IS 'on created now';
COMMENT
ON COLUMN
    "recipes"."updated_at" IS 'on edit at';
CREATE TABLE "favorites"(
    "id" BIGINT NOT NULL,
    "user_id" UUID NOT NULL,
    "mealdb_id" VARCHAR(255) NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "saved_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);
ALTER TABLE
    "favorites" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "favorites"."mealdb_id" IS 'The MealDB recipe ID from the API';
COMMENT
ON COLUMN
    "favorites"."saved_at" IS 'when recipe was saved';
ALTER TABLE
    "favorites" ADD CONSTRAINT "favorites_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "recipes" ADD CONSTRAINT "recipes_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");