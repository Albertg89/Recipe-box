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