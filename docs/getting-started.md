# Getting Started

This section will help you set up Basecompose on your computer step by step. No advanced knowledge required!

## Prerequisites
Before you start, make sure you have:
- **Node.js** (version 18 or higher)
- **pnpm** (version 8 or higher)
- **MongoDB** (version 7 or higher, for local development)

## 1. Install Node.js and pnpm
If you don’t have Node.js or pnpm:
- Download Node.js from [nodejs.org](https://nodejs.org/)
- Install pnpm by running:
	```bash
	npm install -g pnpm
	```

## 2. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/icancodefyi/basecompose.git
cd basecompose
```

## 3. Install Dependencies
Run:
```bash
pnpm install
```

## 4. Set Up Environment Variables
Copy the example file:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your API keys (see the Development Setup section for details).

## 5. Start MongoDB
Make sure MongoDB is running on your computer. If you’re not sure, open a new terminal and run:
```bash
mongod
```

## 6. Run the App
Start the development server:
```bash
pnpm dev
```
Open your browser and go to [http://localhost:3000](http://localhost:3000)

---

If you get stuck, check the FAQ or Troubleshooting section!
