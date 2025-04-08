<div align="center">

# 🤖 ResuMate 🤖

### AI-powered resume analyzer, job matcher, and cover letter generator — all in one smart app.

[![Website Link](https://img.shields.io/badge/🚀_Live_Demo-00C897?style=for-the-badge&logo=vercel&logoColor=white)](https://final-project-lakes.vercel.app)

![](https://img.shields.io/github/stars/CMPT-276-SPRING-2025/final-project-lakes?style=for-the-badge)
![](https://img.shields.io/github/forks/CMPT-276-SPRING-2025/final-project-lakes?style=for-the-badge)
![](https://img.shields.io/github/issues/CMPT-276-SPRING-2025/final-project-lakes?style=for-the-badge)
![](https://img.shields.io/github/last-commit/CMPT-276-SPRING-2025/final-project-lakes?style=for-the-badge)

![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![](https://img.shields.io/badge/Shadcn--UI-000000?style=for-the-badge)
![](https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white)
![](https://img.shields.io/badge/JSearch_API-000000?style=for-the-badge)

</div>

<div align="center">
  <img src="Images/Homepage.png" width="49%" />
  <img src="Images/HomePage1.png" width="49%" /> 
</div>

<div align="center">
  <img src="public/gifs/resumate_demo.gif" width="70%" alt="Demo walkthrough" />
</div>

---

## 💻 Live Demo

[resumate.vercel.app](https://final-project-lakes.vercel.app/)

---

## ✨ Features

- 📄 Upload and analyze your resume using OpenAI
- 🔍 Get AI-powered job matches using multiple APIs ( OpenAI, JSearch )
- 📝 Generate tailored, high-quality cover letters instantly
- 🖥️ Responsive UI with modern design
- ⚙️ Continuous deployment with Vercel

---

## 🛠 Tech Stack

| Component         | Technology                         |
|------------------|------------------------------------|
| Framework        | React                              |
| Styling          | Tailwind CSS                       |
| Deployment       | Vercel                             |
| AI Integration   | OpenAI API                         |
| Job APIs         | JSearch                            |
| File Handling    | PDF Parsing with `pdf-parse`       |
| Hosting          | Vercel                             |

---

## 🖥 Local Setup

### Prerequisites

- Node.js ≥18.x
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CMPT-276-SPRING-2025/final-project-lakes.git
   cd resumate
   ```
2. **Install dependencies**

    ```bash
   npm install
   ```
3. **Create .env**

    ```bash
   touch .env
   ```
4. **Add your API keys**

    ```bash
   OPENAI_API_KEY=your_openai_api_key
    JSEARCH_API_KEY=your_jsearch_api_key
   ```

5. **Ignore .gitignore**

    ```bash
   echo ".env" >> .gitignore
   ```
   
6. **Run the app**

    ```bash
   npm run dev
   ```

7. **Visit the local site**

    ```bash
   http://localhost:3000
   ```





