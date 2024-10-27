# Project Management App Setup Guide

Welcome to your Project Management App setup guide! This document will help you set up the database, manage common
errors, and configure AWS. Follow each section carefully for a smooth project setup.

---

## Database Management

### Step 1: Resetting the Database

To start with a clean database, use the command below:

```bash
npx prisma migrate reset
```

> **Note**: This command erases all data and re-applies migrations, providing a fresh database.

### Step 2: Inserting Default Data

After resetting, insert essential data with:

```bash
ts-node prisma/seed.ts
```

This command populates the database with the default starting data for your project.

---

## Important Error Notes

1. **Default Values**
    - The default values for fields are in `server/prisma/seedData`.
    - Edit this file if you need to update default values to maintain consistency.

2. **Auto-Increment Fields**
    - Avoid manually setting values for fields marked as `@id @default(autoincrement())` in
      `server/prisma/schema.prisma`.
    - Manually assigning values to these fields can cause errors.

3. **Error Handling in Project Creation**
    - **Example Error**: Setting an ID for an auto-increment field may trigger this error:
      ```bash
      Error creating a project: 
      Invalid prisma.project.create() invocation
      Unique constraint failed on the fields: (id)
      ```
    - **Solution**: Ensure auto-incremented fields are not manually assigned in your code or seed files.

---

## Running the Application

Start both the client and server with the following steps:

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

To update all dependencies to their latest versions, run:

```bash
npx npm-check-updates -u
npm install
```

This updates `package.json` to the latest versions and installs them.

---

## AWS Setup Guide

### Setting Up the AWS Network

#### Step 1: Create a Virtual Private Cloud (VPC)

1. In the AWS Console, go to **VPC** and select **Create VPC**.
2. Configure your VPC as shown in the following diagram:

   ![Create VPC](assets/create_vpc.png)

#### Step 2: Create Subnets

1. Go to **VPC > Subnets > Create subnet**.
2. Choose your newly created VPC (e.g., `pm_vpc`).
3. Set up three subnets with the following settings:

    - **Subnet 1**
        - Name: `pm_public-subnet-1`
        - IPv4 subnet CIDR block: `10.0.0.0/24`

    - **Subnet 2**
        - Name: `pm_private-subnet-1`
        - IPv4 subnet CIDR block: `10.0.1.0/24`

    - **Subnet 3**
        - Name: `pm_private-subnet-2`
        - IPv4 subnet CIDR block: `10.0.2.0/24`

> **Tip**: Ensure the Availability Zone matches your chosen AWS region.

For more details on CIDR blocks, watch
this [video explanation](https://youtu.be/KAV8vo7hGAo?si=FUE6BgOziUVqG1eu&t=27250).

#### Step 3: Create an Internet Gateway

1. Go to **VPC > Internet Gateways** and select **Create Internet Gateway**.
2. Name your internet gateway and attach it to your VPC (`pm_vpc`).

    - ![Create Internet Gateway](assets/pm_internet-gateway.png)
    - ![Attach Gateway to VPC](assets/internet_gateway_attach_vpc.png)

#### Step 4: Create Route Tables

1. Go to **VPC > Route tables** and create three route tables:

    - **Public Route Table**
        - Name: `pm_public-route-table-1`
        - VPC: `pm_vpc`
        - Subnet Association: `pm_public-subnet-1`

    - **Private Route Table 1**
        - Name: `pm_private-route-table-1`
        - VPC: `pm_vpc`
        - Subnet Association: `pm_private-subnet-1`

    - **Private Route Table 2**
        - Name: `pm_private-route-table-2`
        - VPC: `pm_vpc`
        - Subnet Association: `pm_private-subnet-2`

2. In `pm_public-route-table-1`, edit routes to allow internet access.

    - ![Edit Routes](assets/edit_routes.png)
    - ![Add Route](assets/add_route.png)

---

### Setting Up EC2 Instance

1. **Launch an EC2 Instance**
    - In **EC2 > Instances**, select **Launch an instance**.

2. **Configure Instance Settings**
    - **Name and Tags**: Set Name to `pm_ec2-backend`.
    - **Application and OS Images**:
        - Select **Amazon Linux**.
        - Choose **Amazon Linux 2023 AMI (Free tier eligible)**.
    - **Key Pair (Login)**:
        - Create a new RSA key pair, name it `standard-key`.
    - **Network Settings**:
        - Create a new security group and allow:
            - ✅ **SSH traffic** from anywhere
            - ✅ **HTTPS traffic** from the internet
            - ✅ **HTTP traffic** from the internet
        - **Additional Configuration**:
            - VPC: Select `pm_vpc`
            - Subnet: Choose `pm_public-subnet-1`
            - Enable Auto-assign public IP
            - Security Group Name: `pm_ec2-sg`
            - Description: `pm_ec2-sg created [DATE]`

3. **Launch the Instance**

4. **Connect to the Instance**
    - In **EC2 > Instances**, locate `pm_ec2-backend`, select it, and click **Connect**.
    - Inside the instance details, click **Connect** again.

> For more details, check out this [video tutorial](https://youtu.be/KAV8vo7hGAo?si=adrniPdbONkLQQQ9&t=20604).