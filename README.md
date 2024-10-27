# Project Management App Setup Guide

Welcome! This guide will help you set up the database, manage common errors, and configure AWS for your project. Follow each section carefully to get started with your project.

---

## Database Management

### 1. Resetting the Database

To reset your database to a fresh state, use the following command:

```bash
npx prisma migrate reset
```

This command will erase all existing data and reapply migrations, preparing a clean database for you.

### 2. Inserting Default Data

After resetting, populate your database with default data by running:

```bash
ts-node prisma/seed.ts
```

This will insert essential starting data for your project.

---

## Important Error Notes

1. **Default Values**
   - Default values for fields are found in `server/prisma/seedData`.
   - Always update this file if you need consistent default values.

2. **Auto-Increment Fields**
   - Avoid manually setting values for fields marked as `@id @default(autoincrement())` in `server/prisma/schema.prisma`.
   - Setting these fields manually may lead to errors.

3. **Error Handling in Project Creation**
   - An error may occur if an ID is manually assigned to an auto-incremented field.
   - Example error message:

     ```bash
     Error creating a project: 
     Invalid prisma.project.create() invocation
     Unique constraint failed on the fields: (id)
     ```

   - **Solution**: Ensure that auto-incremented fields are not assigned values in your code or seed files.

---

## Running the Application

Follow these steps to start the client and server:

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

---

## Updating Dependencies

To upgrade all dependencies to their latest versions:

```bash
npx npm-check-updates -u
npm install
```

This command updates `package.json` with the latest versions and installs them.

---

## AWS Setup Guide

### Setting Up the AWS Network

#### Step 1: Create a Virtual Private Cloud (VPC)

1. Go to **VPC** in your AWS Console and select **Create VPC**.
2. Use the following settings:

   ![Create VPC](assets/create_vpc.png)

#### Step 2: Create Subnets

1. Go to **VPC > Subnets > Create subnet**.
2. Choose the VPC you created (e.g., `pm_vpc`).
3. Create three subnets with the settings below:

   - **Subnet 1**
      - Name: `pm_public-subnet-1`
      - IPv4 CIDR block: `10.0.0.0/24`

   - **Subnet 2**
      - Name: `pm_private-subnet-1`
      - IPv4 CIDR block: `10.0.1.0/24`

   - **Subnet 3**
      - Name: `pm_private-subnet-2`
      - IPv4 CIDR block: `10.0.2.0/24`

4. Ensure the Availability Zone matches your region.

For more on CIDR blocks, check out this [CIDR video explanation](https://youtu.be/KAV8vo7hGAo?si=FUE6BgOziUVqG1eu&t=27250).

#### Step 3: Create an Internet Gateway

1. Go to **VPC > Internet Gateways** and select **Create Internet Gateway**.
2. Create and name your internet gateway, then attach it to your VPC (`pm_vpc`).

   - ![Create Internet Gateway](assets/pm_internet-gateway.png)
   - ![Attach Gateway to VPC](assets/internet_gateway_attach_vpc.png)

#### Step 4: Create Route Tables

1. Go to **VPC > Route tables** and create three route tables:

   - **Public Route Table**
      - Name: `pm_public-route-table-1`
      - Subnet Association: `pm_public-subnet-1`

   - **Private Route Table 1**
      - Name: `pm_private-route-table-1`
      - Subnet Association: `pm_private-subnet-1`

   - **Private Route Table 2**
      - Name: `pm_private-route-table-2`
      - Subnet Association: `pm_private-subnet-2`

2. Edit the routes in `pm_public-route-table-1` to allow internet access.

   - ![Edit Routes](assets/edit_routes.png)
   - ![Add Route](assets/add_route.png)

### Setting Up EC2 Instance

1. **Launch EC2 Instance**
   - Go to **EC2 > Instances > Launch an instance**.

2. **Configure Instance Settings**
   - **Name and Tags**: Set Name to `pm_ec2-backend`.
   - **Application and OS Images**:
      - Select **Amazon Linux**.
      - Choose **Amazon Linux 2023 AMI (Free tier eligible)**.
   - **Key pair (login)**:
      - Create a new RSA key pair, name it `standard-key`.
   - **Network settings**:
      - Create a new security group and allow:
         - ✅ **SSH traffic** from anywhere
         - ✅ **HTTPS traffic** from the internet
         - ✅ **HTTP traffic** from the internet

For more details, refer to this [video tutorial](https://youtu.be/KAV8vo7hGAo?si=adrniPdbONkLQQQ9&t=20604).