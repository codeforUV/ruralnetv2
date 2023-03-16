# RuralNetV2

https://codeforuv-ruralnetv2.herokuapp.com/

## Useful Links
- [Project Task Board](https://www.notion.so/codeforuv/Transition-to-SvelteKit-4d93a45a1772440e84476b5d7995d68e)
- [How the App Works](https://www.notion.so/codeforuv/How-the-App-Works-a5f8e3f463694428af8529a6175e3231)
- [SvelteKit Docs](https://kit.svelte.dev/) 
- [Tailwind CSS Docs](https://tailwindcss.com/)

## Project Goals

The main goals of this project are to develop a web app that measures a user's internet speed and allows us to visualize this speed against the reported speed of their Internet Service Provider (ISP). At the same time we would like to survey users about how they typically use their internet and how satisfied they are with their current service.

This information would allow municipalities to apply for grants and funding to improve their local internet infrastructure and/or hold ISPs accountable for providing subpar service.

## App Development

To run the app locally you'll first need to make sure you have [nodejs](https://nodejs.org/en/) installed on your machine. Then:  

1. Clone this repo: `git clone https://github.com/codeforUV/ruralnetv2.git`  
2. Install dependencies: `npm install`  (run from inside the project folder)
3. Configure the development environment mongo connection, by renaming `.env-example` to `.env.local` and paste in the mongodb connection string for `VITE_MONGODB_URI` (ask @ejolly or @colbyhemond)
5. In the same file paste an api key string for `MAPQUEST_KEY` (ask @ejolly or @colbyhemond)
6. `npm run dev` (launch the server)
7. Open `http://localhost:3000` in your web browser to see the app

## Key Files

- `src/hooks.js` 
  - Server-side functions that run on each request made. We currently use these to establish our initial MongoDB database connection and manage cookies. See [SvelteKit hooks](https://kit.svelte.dev/docs#hooks) for more
- `src/lib/components/` 
  - contains Svelte components reused throughout the app, e.g. `Footer.svelte`
- `src/lib/models.js`
  - contains the database schema and models
- `src/routes/` 
  - each folder or file here will become a *page* in the app
  - If using single files just name the file for the page you want, e.g. `mypage.svelte` will become `ruralnetv2.herokuapp.com/mypage`
  - If using a folder make sure to include an `index.svelte` file in that folder, e.g. `about/index.svelte` will become `ruralnetv2.herokuapp.com/about`

## How to run server-side functionality (i.e. GET, POST, PUT, DELETE requests)

- Within any folder in `src/routes` add an `index.js` file that exports javascript functions corresponding to http methods you want functionality for (e.g. `export async function get()` -> `GET` request to that route)
- Whatever is returned from the `body` of these functions will be available as variables inside the corresponding  `index.svelte` file within that same folder and can be accessed using `export let variableName` 
- Additionally this `index.svelte` file can export a special `load()` function within a `script context='module'` tag in order to perform additional functionality when making a `GET` request to the corresponding end-point (e.g. additional processing of the data returned from the server or `fetch` from another resource)
  - If no additional functionality is needed, then the `load()` function can be omitted from the `index.svelte` file
- See [SvelteKit endpoints](https://kit.svelte.dev/docs#routing-endpoints) for more details
