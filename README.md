# Project Management App Setup Guide

Welcome to the Project Management App setup guide! Follow each section carefully to set up the database, handle errors,
configure AWS, and deploy the app on an EC2 instance.

---

## Database Management

### Step 1: Resetting the Database

To reset and start with a clean database, run:

```bash
npx prisma migrate reset
```

> **Warning**: This command erases all data and re-applies migrations, giving you a fresh database.

### Step 2: Inserting Default Data

After resetting, insert essential data with:

```bash
ts-node prisma/seed.ts
```

This command populates the database with default data to get your project started.

---

## Important Error Notes

1. **Default Values**:
    - Default values are located in `server/prisma/seedData`.
    - Update this file if you need to change default values for consistency.

2. **Auto-Increment Fields**:
    - Avoid manually setting values for fields marked as `@id @default(autoincrement())` in
      `server/prisma/schema.prisma`.

3. **Error Handling in Project Creation**:
    - **Example Error**: Manually setting an ID to an auto-increment field can cause an error:
      ```bash
      Error creating a project: 
      Invalid prisma.project.create() invocation
      Unique constraint failed on the fields: (id)
      ```
    - **Solution**: Ensure auto-incremented fields are not manually assigned.

---

## Running the Application

1. **Start the Client**:
   ```bash
   cd client
   npm run dev
   ```

2. **Start the Server**:
   ```bash
   cd server
   npm run dev
   ```

---

## Updating Dependencies

To update all dependencies:

```bash
npx npm-check-updates -u
npm install
```

This command updates `package.json` with the latest versions and installs them.

---

## AWS Setup Guide

### Step 1: Create a Virtual Private Cloud (VPC)

1. Go to **VPC** in AWS Console and select **Create VPC**.
2. Configure your VPC settings as shown:

   ![Create VPC](assets/create_vpc.png)

### Step 2: Create Subnets

1. Go to **VPC > Subnets > Create subnet**.
2. Choose the VPC you created (e.g., `pm_vpc`) and create three subnets with these settings:

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
        - Availability Zone: `apse1-az2`

> For more on CIDR blocks, watch this [video explanation](https://youtu.be/KAV8vo7hGAo?si=FUE6BgOziUVqG1eu&t=27250).

### Step 3: Create an Internet Gateway

1. Go to **VPC > Internet Gateways** and select **Create Internet Gateway**.
2. Name your gateway and attach it to the VPC (`pm_vpc`).

### Step 4: Create Route Tables

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

2. Edit routes in `pm_public-route-table-1` to allow internet access by attaching the internet gateway.

---

### Setting Up EC2 Instance

1. **Launch an EC2 Instance**
    - Go to **EC2 > Instances** and select **Launch an instance**.

2. **Configure Instance Settings**
    - Name: `pm_ec2-backend`
    - **OS**: Amazon Linux 2023 AMI (Free tier eligible)
    - **Key Pair**: Create an RSA key pair named `standard-key`
    - **Security Group**: Allow:
        - **SSH** from anywhere
        - **HTTPS** and **HTTP** from the internet
    - **Network Settings**:
        - VPC: `pm_vpc`
        - Subnet: `pm_public-subnet-1`
        - Enable Auto-assign public IP
        - Security Group Name: `pm_ec2-sg`

3. **Launch and Connect to the Instance**
    - Connect via EC2 Instance Connect or SSH.

4. **Install Node Version Manager (nvm) and Node.js**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   . ~/.nvm/nvm.sh
   nvm install node
   node -v
   npm -v
   ```

5. **Install Git**
   ```bash
   sudo yum update -y
   sudo yum install git -y
   git --version
   ```

6. **Clone the Project Repository**
   ```bash
   git clone [your-github-link]
   cd project-management/server
   npm install
   echo "PORT=80" > .env
   ```

7. **Install pm2 for Process Management**
   ```bash
   npm install pm2 -g
   ```
    - Create `ecosystem.config.js` in the server directory:
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
    - Start the app with pm2 and enable startup:
      ```bash
      pm2 start ecosystem.config.js
      sudo env PATH=$PATH:$(which node) $(which pm2) startup systemd -u $USER --hp $(eval echo ~$USER)
      ```

8. **pm2 Commands**
    - Stop all processes: `pm2 stop all`
    - Delete all processes: `pm2 delete all`
    - Check process status: `pm2 status`
    - Monitor processes: `pm2 monit`

---

### Setting Up RDS Database

1. **Create the Database**
    - Choose **Standard Create**
    - Engine: **PostgreSQL**
    - Template: **Free Tier**
    - Instance ID: `pm-rds`
    - Username: `postgres`, Password: `hellomyfriend1234`
    - Disable **Storage autoscaling**

2. **Connectivity**
    - VPC: `pm_vpc`
    - Public access: No
    - Security Group: `pm_rd-sg`

3. **Additional Configuration**
    - Database name: `projectmanagement`
    - Disable automated backups and encryption.

4. **Create Security Group Rules**
    - Edit inbound/outbound rules to allow necessary traffic.

5. **Connect the Application to RDS**
    - Edit the `.env` file in the server directory:
      ```plaintext
      DATABASE_URL="postgresql://postgres:hellomyfriend1234@pm-rds.c7q2kqg025be.ap-southeast-1.rds.amazonaws.com:5432/projectmanagement?schema=public"
      ```
    - Run database setup commands:
      ```bash
      npx prisma generate
      npx prisma migrate dev --name init
      npm run seed
      pm2 start ecosystem.config.js
      ```

---

### Setting Up Amplify

1. **Connect GitHub**
    - Select **GitHub** and follow prompts.

2. **Add Repository and Branch**
    - Choose the correct repo and branch.
    - If monorepo, specify the root project directory.

3. **Environment Variables**
    - Add `NEXT_PUBLIC_API_BASE_URL` with the EC2 instance URL.

---

### Setting Up API Gateway

1. **Create API**
    - Go to **API Gateway > APIs > Create API > REST API**.

2. **Configure Resources and Method**
    - Name it `pm_api-gateway`
    - Create a `{proxy+}` resource, enable CORS, and create an `ANY` method.
    - Set the endpoint URL to `http://[EC2-public-IP]/[proxy]`.

3. **Deploy API**
    - Create a new stage `prod`.

4. **Update Amplify Environment Variable**
    - Update `NEXT_PUBLIC_API_BASE_URL` in Amplify to point to the API Gateway URL.

---

### Setting Up S3 Bucket

1. **Create S3 Bucket**
    - Name: `pm-s3-images-abu`
    - Disable **Block all public access**.

2. **Upload Assets**
    - Upload files as needed.

3. **Configure Bucket Policy**
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

4. **Update Image Configuration in Next.js**
    - Edit `client/next.config.mjs`:
      ```js
      const nextConfig = {
        images: {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'pm-s3-images-abu.s3.ap-southeast-1.amazonaws.com',
              pathname: "/**",
            }
          ]
        }
      };
      export default nextConfig;
      ```
    - Replace all `<img src="...">` tags with
      `<Image src="https://pm-s3-images-abu.s3.ap-southeast-1.amazonaws.com/..."/>`.

> **Note**: No need to redeploy in AWS Amplify. Push directly to the production branch.

For a visual guide, check out this [video tutorial](https://youtu.be/KAV8vo7hGAo?si=adrniPdbONkLQQQ9&t=20604).