

FEATURES

* Role-based dashboards (Super Admin, Org Admin, Manager, Learner)
* Secure authentication using NextAuth
* MongoDB-based data storage
* Media uploads via Cloudinary
* Email notifications using SMTP
* Optional WhatsApp notifications using Twilio
* AI-powered coach and recommendations
* Modern UI with Tailwind CSS

---

TECH STACK

Frontend: Next.js, React, TypeScript
Backend: Next.js API Routes
Database: MongoDB Atlas
Authentication: NextAuth.js
Media Storage: Cloudinary
Email: SMTP (Gmail or custom)
WhatsApp (Optional): Twilio
AI: OpenAI API
Styling: Tailwind CSS

---

INSTALLATION

1. Clone the repository

git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name

2. Install dependencies

npm install
or
yarn install

3. Create environment file

Create a file named .env.local in the project root.

---

ENVIRONMENT VARIABLES (.env.local)

Below is an explanation of each environment variable and its purpose.

---

DATABASE (MongoDB)

MONGODB_URI=

Purpose:
Used to connect the application to MongoDB.

Where to get it:

* Create a cluster in MongoDB Atlas
* Click Connect → Drivers
* Copy the connection string
* Add your database name at the end

---

AUTHENTICATION (NextAuth)

NEXTAUTH_SECRET=

Purpose:
Used to encrypt sessions and authentication tokens.

How to generate:
Run: openssl rand -base64 32

NEXTAUTH_URL=[http://localhost:3000](http://localhost:3000)

Purpose:
Base URL of the application.

For production:
Use your live domain URL.

---

SUPER ADMIN (AUTO CREATED)

SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=

Purpose:
Creates the first Super Admin automatically on first app run.

Note:
Change the password immediately after first login in production.

---

CLOUDINARY (MEDIA STORAGE)

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Purpose:
Used to upload and manage images, videos, and documents.

Where to get it:

* Sign up at cloudinary.com
* Copy credentials from the dashboard

---

EMAIL (SMTP)

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

Purpose:
Used to send email notifications and alerts.

Recommended:
Use Gmail App Password (not your real Gmail password).

---

WHATSAPP (OPTIONAL – TWILIO)

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

Purpose:
Used to send WhatsApp notifications.

Where to get it:

* Create a Twilio account
* Enable WhatsApp Sandbox
* Copy credentials from Twilio dashboard

Note:
This feature is optional. The app works without it.

---

AI INTEGRATION (OPENAI)

OPENAI_API_KEY=

Purpose:
Used for AI-powered coaching and recommendations.

Where to get it:
Create an API key from platform.openai.com

---

APPLICATION CONFIG

APP_NAME=Thinkhall Academy
APP_URL=[http://localhost:3000](http://localhost:3000)

Purpose:
Used for branding, redirects, and internal links.

---

RUNNING THE PROJECT

Development mode:

npm run dev

Open in browser:
[http://localhost:3000](http://localhost:3000)

---

PRODUCTION BUILD

npm run build
npm start

---

USEFUL COMMANDS

npm run dev     – Start development server
npm run build   – Create production build
npm start       – Start production server
npm run lint    – Run linter

---

SECURITY NOTES

* Never commit .env.local to GitHub
* Always add .env.local to .gitignore
* Rotate secrets before deployment
* Whitelist server IP in MongoDB Atlas

---

DEPLOYMENT

Recommended platforms:

* Vercel
* AWS
* DigitalOcean

Make sure all environment variables are added in the deployment dashboard.

---

LICENSE

This project is proprietary.
Unauthorized copying or distribution is not permitted.


