# RELIC - Premium Gaming Artifacts
**Live Deployment URL:** https://relic-ten.vercel.app/

## 1. Administrator & Database Access
This application utilizes secure Google OAuth via Firebase, meaning there are no vulnerable manual passwords. 
To access the **Admin Dashboard**, click "Continue with Google" on the Login page using either of the authorized admin accounts:
* `ammarcanani@gmail.com`
* `elsje.scott@uct.ac.za`

*(Note: These accounts have also been added to the Firebase console with Editor permissions to fulfill the database access requirement).*

## 2. Running the Application Locally
1. Ensure Node.js is installed on your machine.
2. Extract the zipped folder and open your terminal in the root directory.
3. Run `npm install` to install all necessary dependencies.
4. Create a `.env.local` file in the root directory and add the Firebase configuration keys.
5. Run `npm run dev` and open `http://localhost:3000` in your browser.
