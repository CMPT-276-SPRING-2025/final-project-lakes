<div align="center">

# 🤖 ResuMate 🤖

### AI-powered resume analyzer, job matcher, and cover letter generator — all in one smart app.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-00C897?style=for-the-badge&logo=vercel&logoColor=white)](https://resumate.vercel.app)

![](https://img.shields.io/github/stars/CMPT-276-SPRING-2025/final-project-lakes?style=for-the-badge)
![](https://img.shields.io/github/forks/final-project-lakes/resumate?style=for-the-badge)
![](https://img.shields.io/github/issues/your-username/resumate?style=for-the-badge)
![](https://img.shields.io/github/last-commit/your-username/resumate?style=for-the-badge)

![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![](https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white)
![](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

<div align="center">
  <img src="public/screenshots/homepage.png" width="49%" />
  <img src="public/screenshots/coverletter.png" width="49%" /> 
</div>

<div align="center">
  <img src="public/gifs/resumate_demo.gif" width="70%" alt="Demo walkthrough" />
</div>

---

## 💻 Live Demo

[resumate.vercel.app](https://resumate.vercel.app)

---

## ✨ Features

- 📄 Upload and analyze your resume using OpenAI
- 🔍 Get AI-powered job matches using multiple APIs (JSearch, Indeed, Glassdoor)
- 📝 Generate tailored, high-quality cover letters instantly
- 🖥️ Responsive UI with modern design
- ⚙️ Continuous deployment with Vercel

---

## 🛠 Tech Stack

| Component         | Technology                         |
|------------------|------------------------------------|
| Framework        | Next.js (React)                    |
| Styling          | Tailwind CSS                       |
| Deployment       | Vercel                             |
| AI Integration   | OpenAI API                         |
| Job APIs         | JSearch, Indeed, Glassdoor         |
| File Handling    | PDF Parsing with `pdf-parse`       |
| Hosting          | Vercel                             |

---

## 🖥 Local Setup

### Prerequisites

- Node.js ≥18.x
- npm
- Vercel CLI (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/resumate.git
   cd resumate
   ```
2. **Install dependencies**
    ```bash
   npm install
   ```
3. **Create .env.local**
    ```bash
   touch .env.local
   ```
4. **Add your API keys**
    ```bash
   OPENAI_API_KEY=your_openai_api_key
    JSEARCH_API_KEY=your_jsearch_api_key
   ```
5. **Run the app**
    ```bash
   npm run dev
   ```
6. **Visit the local site**
    ```bash
   http://localhost:3000
   ```





