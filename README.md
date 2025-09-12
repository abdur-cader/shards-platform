# 🚀 Sharded

Welcome to **Sharded**, a platform for anyone to showcase and discover GitHub project snapshots ("shards"). This project empowers developers to share their work, receive AI-powered feedback, and enhance their coding journey.

---

## ✨ Overview

Sharded is designed to provide a seamless experience for developers to display their projects. Not only can you present your GitHub repositories, but you can also gain insights and feedback through our AI tools.

---

## 🛠️ Features

* Showcase your GitHub projects easily.
* Receive AI-generated feedback on your code.
* Engage with a community of developers.

---

## ⚙️ Environment Setup

Before running the application, create a `.env.local` file in the root directory and include the following environment variables. You can find instructions on obtaining the keys from their respective documentation:

```
AUTH_SECRET=your_auth_secret_here            # see https://authjs.dev
NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
WORKER_API_KEY=your_worker_api_key
PYTHON_WORKER_URL=your_python_worker_url
```

---

## 📦 Installation

To get started with Sharded, clone the repository and install the dependencies:

```
git clone https://github.com/yourusername/sharded.git
cd sharded
npm install
```

---

## 💻 Usage

Once installed, you can run the development server to view your project:

```
npm run dev
```


(This README is created by Shared)

This will start the application on [http://localhost:3000](http://localhost:3000).
