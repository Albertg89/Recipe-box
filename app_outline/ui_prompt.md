I want to implement supabase authentication for my application users. With that said, I want you to use the following resources for context before executing this task:

- user journey: @./skeleton/user_journey.md
- db schema: @./skeleton/db_schema.sql

The user should be able to conduct the following actions:

- A new user should be capable of registering an account. Upon registration, they should be logged in and routed to the home page.
- A returning user should be able to log in and be routed to the homepage on success.
- Failure to authenticate upon submitting either for registration and/or log in, the user should be advised of the errors and allowed to re-attempt log in and/or registration.
- An authenticated user should only be able to view, create, edit, and delete their own recipes and saved favorites. They should never have access to another user's data.
- Upon refresh, an authenticated user should remain authenticated and be routed to their last visited page prior to refresh
- An authenticated user should be able to log out of the application and be returned to the log in page, NOT the sign up page.

I want you to generate the actions above where each action represents a phase, verify each phase by using the playwright mcp to walk through the user journey as if you were the user and confirm the action was build correctly.

Do you have any questions before executing this task?