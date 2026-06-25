I want you to look at the following files for context:

1. current supabase schema: @./references/curr_db_schema.sql
2. test entry data for my schema: @./references/test-data

I have tested the current database schema from my Supabase project with my application to ensure it works. As of now, there are no issues.

I would like you to implement authentication for my users and i would like you to conduct the following:

- Alter the users table to represent an authenticated user.
- Alter RLS rules so saved and created recipes can only be seen by the authenticated users attached through the many-to-one relationship.

You should know my current tables have the test data provided currently inserted into them.

Do you have any questions before completing this action?