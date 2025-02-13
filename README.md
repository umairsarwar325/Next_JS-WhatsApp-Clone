# Next.js WhatsApp Clone with Notes

This project is a clone of WhatsApp built using Next.js for the frontend and Express.js for the server.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- Comprehensive notes made during developement phases covering related work in each phase
```
  https://github.com/umairsarwar325/Next_JS-WhatsApp-Clone/blob/master/WhatsApp_Clone_Notes.txt
```
- Real-time messaging using WebSockets
- User authentication and authorization using Google
- Message history and persistence
- Media sharing (images, audio)
- Video and audio call
- Users online and offline status
- Messages sent, delivered and read status
- Search features for messages inside chat and contacts search

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or Yarn

### Steps

1. **Clone the repository:**
   
   ```bash
   git clone https://github.com/umairsarwar325/Next_JS-WhatsApp-Clone.git
   cd Next_JS-WhatsApp-Clone
   ```
   
2. **Install dependencies:**
   
   ```bash
    cd client
    npm install
    cd ../server
    npm install
   ```
3. **Set up environment variables:**
   
- Create a .env file in the server directory and add the following environment variables:
  ```
    PORT=3005
    ZEGO_APP_ID=
    ZEGO_SEVER_ID=
    DATABASE_URL=
  ```
- Add environment variables in client/src/next.config.mjs
  ```
    env: {
      NEXT_PUBLIC_ZEGO_APP_ID: [PASTE_HERE],
      NEXT_PUBLIC_ZEGO_SEVER_ID: [PASTE_HERE],
    },
  ```
    
4. **Start the development server:**

- Start the client:
   - cd client
   - npm run dev

- Start the server:
   - cd ../server
   - npm start

## Usage
   
- Open your browser and navigate to http://localhost:3000 to access the WhatsApp clone.
- Log in with Google.
- Start chatting with other users in real-time.

### Project Structure
- client: Contains the frontend code built with Next.js.
- server: Contains the backend code, built with Express.js.
- .gitignore: Specifies files and directories to be ignored by Git.
- WhatsApp_Clone_Notes.txt: Additional notes or documentation related to the project.

## Contributing

Contributions are welcome! Please follow these steps:

- Fork the repository.
- Create a new branch.
- Commit your changes.
- Push to the branch.
- Create a new Pull Request.
