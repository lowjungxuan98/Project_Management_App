# Project Management App

## Resetting the Database

To reset the database, run the following command:

```bash
npx prisma migrate reset
```

This command will remove any existing data and reapply the migrations, returning the database to a fresh state.

## Inserting Default Data

To populate the database with default data, use:

```bash
ts-node prisma/seed.ts
```

This script will insert the initial set of data into the database after it has been reset.

## Important Notes

1. **Default Values**
    - The default values for the database fields can be found in `server/prisma/seedData`.
    - Make sure to refer to this file when updating or adding new seed data.

2. **Auto-Increment Fields**
    - **Do not manually set values for fields marked as `@id @default(autoincrement())`** in `server/prisma/schema.prisma`.
    - If you attempt to set the ID field manually (for example, during the creation of a new entry), it will cause an error.

3. **Handling Errors in Project Creation**
    - When creating new projects in the database, an error may occur if you try to manually assign an ID to an auto-incremented field. The error will look like this:

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