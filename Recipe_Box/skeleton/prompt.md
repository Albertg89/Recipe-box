# Initial Prompt

I would like you to build a Front-End Single Page Application from the wire frames I have mapped out. 

The tech-stack for this application will be as follows:
- React.js + Vite
- React Router DOM with Browser Router

There will be no API interactions and all data should be retained only at the browser level, meaning if I refresh/rerender my site all of the data should reset.

I have created a series of documents and images as a reference for what I would like this application to look like and isolated everything by pages. Take a look at this folder @./skeleton and read the `user_journey.md` file to get context for the users journey through the application. Then look at the `app.png` to visualize the entire application. Finally under pages, you'll find a wire-frame corresponding to each page. Additionally, when it comes to design style, you can read the `style_guide.md` and apply its guidelines as you see fit.

Ensure to utilize the `playwright` MCP server to supervise the development of this Application. After each page is built, use Playwright to screenshot it and compare against the wireframe before moving on and ensure it's output matches the desired outcome from the wire-frames.

Finally the execution of this app should happen in phases, phases should correspond roughly to pages or major feature areas. I'll leave it to you to declare the number of phases and what their independent passing conditions are, but these conditions should be approved by me and allow me to provide you feedback before moving on into the next phase.

Before writing any code, please confirm your understanding of the application by summarizing the user journey and listing the pages you plan to build.

# Prompt to fix bug where new user can view and interact with the previous users' recipes

While double checking the functionality of the app that was just created, I noticed a bug where a new user can see, edit, and delete the saved and created recipes from a previous user. Additionally when a user logs out and logs back in their favorites and created recipes are gone. I would like you to fix both issues without making any unnecessary changes to the existing code.

Do you have any questions?

# Prompting Claude to put it all together

This React + Vite application using React Router DOM is functioning correctly
and I want to preserve the existing UI and user experience.

Resources:

1. SQL Schema: @./.skeleton/db_schema.sql
2. Supabase Project URL: https://gbatqjmnqlrxaqgjuyik.supabase.co/rest/v1/
3. Supabase Public API Key: sb_publishable_T7eV6YlDtJB9rZHaSSAj2Q_OTguXPoQ
4. Resources: users, recipes, and favorites
5. Applications user journey: @./skeleton/user_journey.md

Requirements:

* Analyze the current application before making any code changes.
* Identify all existing CRUD flows and components that manage data.
* Present an implementation plan before modifying code.

Implementation Requirements:

* Preserve the existing UI.
* Replace all mock/local CRUD operations with Supabase API interactions.
* Use axios for all API communication.
* Create a dedicated API service layer.
* Components should never directly call axios.
* Store API configuration in environment variables.
* Implement loading, error, and success states for all CRUD actions.
* Ensure all UI changes remain synchronized with the Supabase backend.
* Analyze the SQL schema and correctly implement any relationships between
  users, recipes, and favorites
* Do not implement authentication at this time.
* Do not introduce unnecessary architectural changes or redesign existing
  components.

Deliverables:

1. Analysis of current architecture.
2. Proposed implementation plan.
3. Code changes.
4. Summary of modified files.
5. Any assumptions made during implementation.

Before writing code, tell me if you identify any ambiguities, missing schema
information, or architectural concerns.

While you are adding functionality to the application, I want you to utilize the playwright mcp to walk through each feature as if you were the user and ensure the api communication and feature itself is working.

Do you have any additional questions?