_# Project Management App Setup Guide

Welcome to the Project Management App setup guide! This document will guide you through setting up the database,
handling common errors, configuring AWS, and deploying the app on an EC2 instance. Follow each section carefully for a
smooth project setup.

---

## Table of Contents

- [Database Management](#database-management)
    - [Step 1: Resetting the Database](#step-1-resetting-the-database)
    - [Step 2: Inserting Default Data](#step-2-inserting-default-data)
- [Important Error Notes](#important-error-notes)
    - [1. Default Values](#1-default-values)
    - [2. Auto-Increment Fields](#2-auto-increment-fields)
    - [3. Error Handling in Project Creation](#3-error-handling-in-project-creation)
- [Running the Application](#running-the-application)
- [Updating Dependencies](#updating-dependencies)
- [AWS Setup Guide](#aws-setup-guide)
    - [Setting Up the AWS Network](#setting-up-the-aws-network)
        - [Step 1: Create a Virtual Private Cloud (VPC)](#step-1-create-a-virtual-private-cloud-vpc)
        - [Step 2: Create Subnets](#step-2-create-subnets)
        - [Step 3: Create an Internet Gateway](#step-3-create-an-internet-gateway)
        - [Step 4: Create Route Tables](#step-4-create-route-tables)
    - [Setting Up EC2 Instance](#setting-up-ec2-instance)
    - [Setting Up RDS Database](#setting-up-rds-database)
    - [Setting Up Amplify](#setting-up-amplify)
    - [Setting Up API Gateway](#setting-up-api-gateway)
    - [Setting Up S3 Bucket](#setting-up-s3-bucket)
    - [Setting Up Cognito](#setting-up-cognito)

---

## Database Management

### Step 1: Resetting the Database

To start with a clean database, run:

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

### 1. Default Values

- Default values for fields are located in `server/prisma/seedData`.
- Update this file if you need to change default values for consistency.

### 2. Auto-Increment Fields

- Avoid manually setting values for fields marked as `@id @default(autoincrement())` in `server/prisma/schema.prisma`.
- Manually assigning values to these fields can lead to errors.

### 3. Error Handling in Project Creation

**Example Error**:

Assigning an ID to an auto-increment field may cause this error:

```bash
Error creating a project: 
Invalid prisma.project.create() invocation
Unique constraint failed on the fields: (id)
```

**Solution**:

Ensure auto-incremented fields are not assigned manually in your code or seed files.

---

## Running the Application

To start both the client and server, follow these steps:

### 1. Start the Client

```bash
cd client
npm run dev
```

### 2. Start the Server

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
2. Configure your VPC settings as shown:

    - **Name tag**: `pm_vpc`
    - **IPv4 CIDR block**: `10.0.0.0/16`

   ![Create VPC](assets/create_vpc.png)

#### Step 2: Create Subnets

1. Go to **VPC > Subnets > Create subnet**.
2. Choose the VPC you created (e.g., `pm_vpc`).
3. Set up three subnets with the following settings:

    - **Subnet 1**
        - Name: `pm_public-subnet-1`
        - IPv4 CIDR block: `10.0.0.0/24`
        - Availability Zone: `apse1-az1`

    - **Subnet 2**
        - Name: `pm_private-subnet-1`
        - IPv4 CIDR block: `10.0.1.0/24`
        - Availability Zone: `apse1-az1`

    - **Subnet 3**
        - Name: `pm_private-subnet-2`
        - IPv4 CIDR block: `10.0.2.0/24`
        - Availability Zone: `apse1-az2` *(Important: Select a different Availability Zone for this subnet to meet RDS
          requirements)*

For more details on CIDR blocks, check out
this [video explanation](https://youtu.be/KAV8vo7hGAo?si=FUE6BgOziUVqG1eu&t=27250).

#### Step 3: Create an Internet Gateway

1. Go to **VPC > Internet Gateways** and select **Create Internet Gateway**.
2. Name and attach your internet gateway to the VPC (`pm_vpc`).

   ![Create Internet Gateway](assets/pm_internet-gateway.png)
   ![Attach Gateway to VPC](assets/internet_gateway_attach_vpc.png)

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

2. Edit the routes in `pm_public-route-table-1` to allow internet access by attaching the internet gateway:

   ![Edit Routes](assets/edit_routes.png)
   ![Add Route](assets/add_route.png)

---

### Setting Up EC2 Instance

1. **Launch an EC2 Instance**:

    - Go to **EC2 > Instances** and select **Launch an instance**.

2. **Configure Instance Settings**:

    - **Name and Tags**: Set Name to `pm_ec2-backend`.
    - **Application and OS Images**: Select **Amazon Linux 2023 AMI (Free tier eligible)**.
    - **Key Pair (Login)**: Create a new RSA key pair and name it `standard-key`.
    - **Network Settings**:
        - **Security Group**: Allow:
            - ✅ **SSH traffic** from anywhere
            - ✅ **HTTPS traffic** from the internet
            - ✅ **HTTP traffic** from the internet
        - **Additional Configuration**:
            - VPC: `pm_vpc`
            - Subnet: `pm_public-subnet-1`
            - Enable Auto-assign public IP
            - Security Group Name: `pm_ec2-sg`

3. **Launch the Instance**.

4. **Connect to the Instance**:

    - In **EC2 > Instances**, select `pm_ec2-backend`, and click **Connect**.

5. **Connect to EC2 Instance via SSH**:

    - Use EC2 Instance Connect from the AWS Console or SSH to the instance.

6. **Install Node Version Manager (nvm) and Node.js**:

    1. Install nvm:

       ```bash
       curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
       ```

    2. Activate nvm:

       ```bash
       . ~/.nvm/nvm.sh
       ```

    3. Install Node.js:

       ```bash
       nvm install node
       ```

    4. Verify installations:

       ```bash
       node -v
       npm -v
       ```

7. **Install Git**:

    1. Update the system and install Git:

       ```bash
       sudo yum update -y
       sudo yum install git -y
       ```

    2. Verify Git installation:

       ```bash
       git --version
       ```

8. **Clone the Project Repository**:

    1. Clone your GitHub repository:

       ```bash
       git clone [your-github-link]
       ```

    2. Navigate to the project and install dependencies:

       ```bash
       cd project-management/server
       npm install
       ```

    3. Set up the environment:

       ```bash
       echo "PORT=80" > .env
       ```

9. **Install pm2 for Process Management**:

    1. Install pm2 globally:

       ```bash
       npm install pm2 -g
       ```

    2. Create a pm2 configuration file:

        - In the server directory, create `ecosystem.config.js`:

          ```javascript
          module.exports = {
            apps: [
              {
                name: 'project-management',
                script: 'npm',
                args: 'run dev',
                env: {
                  NODE_ENV: 'production',
                },
              },
            ],
          };
          ```

    3. Start the app using pm2:

       ```bash
       pm2 start ecosystem.config.js
       ```

    4. Enable pm2 startup on system reboot:

       ```bash
       sudo env PATH=$PATH:$(which node) $(which pm2) startup systemd -u $USER --hp $(eval echo ~$USER)
       ```

10. **Useful pm2 Commands**:

- Stop all processes:

  ```bash
  pm2 stop all
  ```

- Delete all processes:

  ```bash
  pm2 delete all
  ```

- Check process status:

  ```bash
  pm2 status
  ```

- Monitor processes:

  ```bash
  pm2 monit
  ```

---

### Setting Up RDS Database

1. **Create a PostgreSQL Database**:

    - Go to **RDS > Create database**.

    1. **Choose Database Creation Method**:

        - Select **Standard Create**.

    2. **Engine Options**:

        - Choose **PostgreSQL**.

    3. **Templates**:

        - Choose **Free Tier**.

    4. **Settings**:

        - **DB instance identifier**: `pm-rds`
        - **Master username**: `postgres`
        - **Master password**: `hellomyfriend1234`

    5. **Storage**:

        - Disable **Storage autoscaling**

    6. **Connectivity**:

        - **VPC**: Select `pm_vpc`
        - **Public access**: Select **No**
        - **VPC Security Group**: Create new
            - **New VPC Security Group name**: `pm_rd-sg`
        - **Availability Zone**: `apse1-az1`

    7. **Monitoring**:

        - Turn off **Performance Insights**

    8. **Additional Configuration**:

        - **Initial database name**: `projectmanagement`
        - **Backup**: Disable **Enable automated backups**
        - **Encryption**: Disable **Enable encryption**

    9. **Click "Create Database"**

2. **Set Up Security Group Rules**:

    - Once the database is created, configure security group rules:

        - Go to **EC2 > Security Group > [pm_rd-sg] > Edit Inbound rules**
        - Add necessary rules

          ![Add Inbound Rules](assets/add_security_group_rules_inbound.png)

        - Click **Save rules**

    - Go to **EC2 > Security Group > [pm_ec2-sg] > Edit Outbound rules**

        - Add necessary rules

          ![Add Outbound Rules](assets/add_security_group_rules_outbound.png)

        - Click **Save rules**

3. **Connecting the Application to RDS**:

    1. Edit the `.env` file to include the `DATABASE_URL`:

       ```bash
       nano .env
       ```

       Add the following:

       ```plaintext
       DATABASE_URL="postgresql://postgres:hellomyfriend1234@pm-rds.c7q2kqg025be.ap-southeast-1.rds.amazonaws.com:5432/projectmanagement?schema=public"
       ```

        - **Save the file**:

            - Press `Ctrl + O`, then `Enter` to confirm.

        - **Exit nano**:

            - Press `Ctrl + X`.

    2. **Reboot the database**:

       ```bash
       npx prisma generate
       npx prisma migrate dev --name init
       npm run seed
       pm2 start ecosystem.config.js
       ```

---

### Setting Up Amplify

1. **Choose Source Code Provider**:

    - Select **GitHub** and click **Next**

2. **Add Repository and Branch**:

    - Choose the correct repository
    - Choose the correct branch
    - If the project is in a monorepo, check ✅ **My app is a monorepo**
        - Enter the root project directory

3. **App Settings**:

    - Expand **Advanced settings**
    - **Environment variables**:
        - Add Key: `NEXT_PUBLIC_API_BASE_URL`, Value: `http://18.141.160.220`

---

### Setting Up API Gateway

1. Go to **API Gateway > APIs > Create API > REST API**.

   > **Note**: Choose REST API, not Private API.

2. Choose **New API**, name it `pm_api-gateway`, and click **Create API**.

3. Go to **API Gateway > APIs > [Resources - pm_api-gateway]** and **Create Resource**:

    - **Resource name**: `{proxy+}`
    - Enable **CORS**

4. Under the `{proxy+}` resource, **Create Method**:

    - **Integration Type**: HTTP
    - **HTTP method**: ANY
    - **Endpoint URL**: `http://18.141.160.220/{proxy}`

5. Click **Deploy API**:

    - **Stage**: New Stage
    - **Stage name**: `prod`

6. Update `NEXT_PUBLIC_API_BASE_URL` in Amplify Environment Variables:

    - Go to **Amplify** in the AWS console.
    - Click **View App** > **Hosting** > **Environment Variables**.
    - Update `NEXT_PUBLIC_API_BASE_URL` to the API Gateway URL.
    - Go back to the **Overview** tab, click on the **Branch** name, and then click **Redeploy this version**.

      ![Amplify Redeploy](assets/amplify_prod.png)

7. **Set Up Authorizer**:

    - Go to **API Gateway > APIs > [pm_api-gateway] > Authorizers > Create authorizer**
        - **Authorizer name**: `pm_api-gateway-authorizer`
        - **Authorizer type**: Cognito
        - **Cognito User Pool**: Select `pm-ProjectManagement-userpool`
        - **Token source**: `Authorization`
    - Click **Create authorizer**

---

### Setting Up S3 Bucket

1. **Create an S3 Bucket**:

    - Go to **Amazon S3 > Buckets > Create bucket**
        - **Bucket name**: `pm-s3-images-abu`
        - **Block Public Access settings for this bucket**: Disable **Block all public access**
        - Acknowledge by checking the box
    - Click **Create bucket**

2. **Upload Assets**:

    - Select the bucket created
    - Click **Upload** and drag the assets you want to upload
    - Click **Upload**

3. **Set Bucket Policy**:

    - Go to **Amazon S3 > Buckets > [pm-s3-images-abu] > Permissions > Edit bucket policy**
    - Insert the following policy:

      ```json
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::pm-s3-images-abu/*"
          }
        ]
      }
      ```

    - Click **Save changes**

4. **Edit `next.config.mjs`**:

   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     images: {
       remotePatterns: [
         {
           protocol: 'https',
           hostname: 'pm-s3-images-abu.s3.ap-southeast-1.amazonaws.com',
           port: '',
           pathname: '/**',
         },
       ],
     },
   };
   export default nextConfig;
   ```

5. **Update Image References**:

    - Replace all `<img src="...">` tags with:

      ```jsx
      <Image src={`https://pm-s3-images-abu.s3.ap-southeast-1.amazonaws.com/...`} />
      ```

   > **Note**: No need to redeploy in AWS Amplify; you may push to the production branch.

---

### Setting Up Cognito

1. **Create a User Pool**:

    - Go to **Amazon Cognito > User pools > Create user pool**
    - Click **Create user pool**
        1. **Configure sign-in experience**
            - **Authentication providers**:
                - ✅ User name
                - ✅ Email
                - ✅ Allow users to sign in with a preferred user name
                - ✅ Make user name case sensitive
        2. **Configure security requirements**
            - **Multi-factor authentication**
                - **MFA enforcement**: No MFA
        3. **Configure sign-up experience**: Keep default settings
        4. **Configure message delivery**
            - **Email provider**: Send email with Cognito
        5. **Integrate your app**
            - **User pool name**: `pm-ProjectManagement-userpool`
            - **Initial app client**
                - **App client name**: `projectmanagementclient`
        6. **Review and create**
            - Click **Create user pool**

2. **Add Cognito in Amplify Environment Variables**:

    - Go to **Amplify** in the AWS console.
    - Click **View App** > **Hosting** > **Environment Variables**.
    - Add the following variables:
        - `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`: Get from **Cognito > User pools > [pm-ProjectManagement-userpool] >
          App clients and analytics**.
        - `NEXT_PUBLIC_COGNITO_USER_POOL_ID`: Get from **Cognito > User pools > [pm-ProjectManagement-userpool] > User
          pool overview**.
    - If production didn't have changes, you may need to redeploy.

3. **Create a Lambda Function for Post Confirmation Trigger**:

    - Go to **Lambda > Functions > Create function**
    - **Create function**:
        - **Function name**: `pm_lambda-trigger`
    - Click **Create function**

4. **Add Code to the Lambda Function**:

   ```javascript
   import https from 'node:https';

   export const handler = async (event) => {
     const postData = JSON.stringify({
       username: event.userName,
       cognitoId: event.request.userAttributes.sub,
       profilePictureUrl: 'i1.jpg',
       teamId: 1,
     });

     const options = {
       hostname: 'i3p592k4x2.execute-api.ap-southeast-1.amazonaws.com',
       path: '/prod/users',
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Content-Length': Buffer.byteLength(postData),
       },
     };

     const responseBody = await new Promise((resolve, reject) => {
       const req = https.request(options, (res) => {
         res.setEncoding('utf8');
         let body = '';
         res.on('data', (chunk) => (body += chunk));
         res.on('end', () => resolve(body));
       });

       req.on('error', reject);
       req.write(postData);
       req.end();
     });

     console.log('result', responseBody);

     return event;
   };
   ```

5. **Add Lambda Trigger to Cognito**:

    - Go to **Amazon Cognito > User pools > [pm-ProjectManagement-userpool] > Triggers**
    - **Lambda triggers**:
        - **Trigger type**: Post confirmation
        - **Lambda function**: Assign `pm_lambda-trigger`
    - Click **Add Lambda trigger**

6. **Verify Lambda Execution**:

    - Go to **CloudWatch > Log groups > /aws/lambda/pm_lambda-trigger**
    - Check the `result` logs

---

For more guidance, check out this [video tutorial](https://youtu.be/KAV8vo7hGAo?si=adrniPdbONkLQQQ9&t=20604).