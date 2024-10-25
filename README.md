# Project Management App Setup Guide

### Database Management

#### Resetting the Database

To reset the database, execute the following command:

```bash
npx prisma migrate reset
```

This command will erase any existing data and reapply migrations, effectively returning the database to a fresh state.

#### Inserting Default Data

After resetting the database, you can populate it with default data by running:

```bash
ts-node prisma/seed.ts
```

This script inserts an initial dataset into the database to ensure you have the required starting data.

### Important Error Notes

1. **Default Values**
    - The default values for database fields are located in `server/prisma/seedData`.
    - Refer to this file whenever updating or adding new seed data to maintain consistency.

2. **Auto-Increment Fields**
    - **Avoid setting values manually for fields marked with `@id @default(autoincrement())`** in `server/prisma/schema.prisma`.
    - Manually assigning values to an auto-increment field (e.g., when creating a new entry) will result in an error.

3. **Handling Errors in Project Creation**
    - When creating new projects, you may encounter an error if you try to manually assign an ID to an auto-incremented field. The error message will resemble the following:

      ```
      Error creating a project: 
      Invalid prisma.project.create() invocation in
      /path/to/your/project/server/src/controllers/projectController.ts:26:45
      
        23 ): Promise<void> => {
        24   const { name, description, startDate, endDate } = req.body;
        25   try {
      → 26     const newProject = await prisma.project.create(
      Unique constraint failed on the fields: (id)
      ```

        - To avoid this, **ensure that auto-incremented fields are not manually assigned** in your code or seed files.

### Running the Application

1. **Start the Client**
   ```bash
   cd client
   npm run dev
   ```

2. **Start the Server**
   ```bash
   cd server
   npm run dev
   ```

### Updating Dependencies

To upgrade all dependencies to their latest versions, use the following commands:

```bash
npx npm-check-updates -u
npm install
```