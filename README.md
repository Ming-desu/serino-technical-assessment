# Serino API Technical Assessment

## Getting Started - Setup
1. Install the project dependencies.

   ```bash
   npm ci # npm >= 5.8
   # or npm install
   ```

2. Copy .env.example to .env for the app.

   ```bash
   cp .env.example .env
   ```

3. Put the credentials in the newly created .env.

4. Before doing this, make sure that the mysql server is open.

   ```bash
   # will create the database
   npx sequelize-cli db:create
   ```
5. Run the table migrations.

    ```bash
   # will create the tables
   npx sequelize-cli db:migrate
   ```
6. Run the seed migrations.

    ```bash
    # will insert the demo data
   npx sequelize-cli db:seed:all
   ```

7. Start the server.

   ```bash
   npm run dev
   ```
   
8. Access the api documentation via [http://localhost:3000/docs](http://localhost:3000/docs/)