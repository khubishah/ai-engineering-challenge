# AI Chat Frontend

This is a Next.js frontend application that provides a chat interface for interacting with AI models through the FastAPI backend.

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- OpenAI API key

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
```

## Running the Application

1. Make sure the FastAPI backend is running on `http://localhost:8000`

2. Start the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- Real-time chat interface
- Streaming responses from the AI model
- Modern UI with Tailwind CSS
- Responsive design
- TypeScript support