# 🎓 PIMS - Placement Information Management System

![GitHub language count](https://img.shields.io/github/languages/count/Adarsh234/Placement_Management_System)
![GitHub top language](https://img.shields.io/github/languages/top/Adarsh234/Placement_Management_System)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)
![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![GitHub last commit](https://img.shields.io/github/last-commit/Adarsh234/Placement_Management_System)
![License](https://img.shields.io/badge/license-MIT-blue)


<div align="center">

<img width="1024" height="572" alt="image" src="https://github.com/user-attachments/assets/e5e774c7-f945-499d-98a4-80c9b6e03e67" />
**A centralized platform streamlining campus recruitment for Students, Companies, and Administrators.**

[View Demo](https://placement-management-system-nine.vercel.app) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 🚀 Overview

**PIMS (Placement Information Management System)** is a full-stack web application designed to digitize and automate the campus placement process. It bridges the gap between students seeking opportunities, companies hiring talent, and college administrators managing the drive.

With a modern, responsive UI (Dark Mode enabled) and a robust backend, PIMS ensures a seamless experience for all stakeholders.

## ✨ Key Features

### 👨‍🎓 For Students
* **Centralized Dashboard:** View all eligible job openings in one place.
* **One-Click Apply:** Apply to companies instantly with your pre-saved profile.
* **Profile Management:** Update resume, CGPA, and skills easily via a sleek modal.
* **Real-time Status:** Track application progress (Applied → Shortlisted → Selected/Rejected).

### 🏢 For Companies (Recruiters)
* **Job Posting:** Create detailed job listings with salary packages, deadlines, and eligibility criteria.
* **Company Profile:** Maintain a branded company profile with location, website, and description.
* **Applicant Management:** View all applicants for a specific role.
* **Streamlined Hiring:** Shortlist or reject candidates with a single click.

### 👮‍♂️ For Administrators (TPO)
* **Live Analytics:** Real-time stats on active drives, total students, and placement counts.
* **Student Verification:** Verify student registrations (CGPA/Roll No) to ensure data authenticity.
* **Data Export:** Download comprehensive reports (CSV) of student data for offline analysis.
* **Access Control:** Manage system access and toggle maintenance modes.

---

## 📂 Project Structure

A monolithic repository structure hosting both the frontend client and backend server.

```bash
pims-app/
├── client/                 # Frontend Application (Next.js)
│   ├── public/             # Static assets (images, icons)
│   ├── src/
│   │   ├── app/            # App Router (Pages & Layouts)
│   │   │   ├── auth/       # Login & Register Pages
│   │   │   ├── dashboard/  # Protected Dashboards (Admin, Student, Company)
│   │   │   └── page.tsx    # Landing Page
│   │   ├── components/     # Reusable UI Components (AuthGuard, Cards)
│   │   └── lib/            # Utilities (API axios instance)
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.ts  # Styling configuration
│
├── server/                 # Backend API (Express.js)
│   ├── src/
│   │   ├── config/         # Database connection (Supabase)
│   │   ├── controllers/    # Route logic (Auth, Jobs, Student, Company)
│   │   ├── middleware/     # Auth & Role verification middleware
│   │   ├── routes/         # API Route definitions
│   │   ├── utils/          # Helpers (Email Service, Password Hashing)
│   │   └── index.ts        # Server entry point
│   ├── .env                # Environment variables (Secrets)
│   └── package.json        # Backend dependencies
│
└── README.md               # Project documentation

```

---

## 🛠️ Tech Stack & Languages

### **Languages Used**

* **TypeScript** (98%): Primary language for both client and server to ensure type safety.
* **SQL** (2%): Database queries for PostgreSQL.

### **Frontend**

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State & Alerts:** [SweetAlert2](https://sweetalert2.github.io/)

### **Backend**

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt
* **Database:** PostgreSQL (via [Supabase](https://supabase.com/))
* **Email Service:** Nodemailer (Gmail SMTP)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### **Prerequisites**

* Node.js (v18+)
* npm or yarn
* A Supabase project (for PostgreSQL)

### **1. Clone the Repository**

```bash
git clone [https://github.com/your-username/pims-app.git](https://github.com/your-username/pims-app.git)
cd pims-app

```

### **2. Backend Setup**

Navigate to the server folder and install dependencies:

```bash
cd server
npm install

```

Create a `.env` file in the `server` directory:

```env
PORT=5000
DATABASE_URL=your_supabase_postgres_connection_string
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

```

Start the backend server:

```bash
npx ts-node src/index.ts

```

### **3. Frontend Setup**

Open a new terminal, navigate to the client folder, and install dependencies:

```bash
cd client
npm install

```

Start the Next.js development server:

```bash
npm run dev

```

Visit `http://localhost:3000` in your browser.

---

## 🗄️ Database Schema

The application uses the following relational tables in PostgreSQL:

* **`users`**: Stores login credentials (email, password hash, role).
* **`students`**: Links to `users`. Stores academic info (Roll No, CGPA, Skills, Verification Status).
* **`companies`**: Links to `users`. Stores company profile (Name, Location, Website).
* **`jobs`**: Job listings posted by companies.
* **`applications`**: Junction table linking `students` to `jobs` with a `status` (Applied, Selected, etc.).

---

## 🛡️ Security Measures

* **AuthGuard:** Protected frontend routes prevent unauthorized access to dashboards.
* **RBAC (Role-Based Access Control):** Ensures Students cannot access Admin panels, and vice versa.
* **Password Hashing:** All passwords are encrypted using `bcrypt`.
* **JWT Authentication:** Stateless, secure API requests.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
Made with ❤️ by <strong>Adarsh</strong>
</div>
