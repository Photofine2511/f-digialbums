# Album Spark - Digital Album Creation App

This is a full-stack web application for creating, sharing, and managing digital photo albums, with Cloudinary integration for image storage.

## Project Structure

This project consists of two main parts:

1. **Frontend**: A React/TypeScript application built with Vite, shadcn-ui, and TailwindCSS
2. **Backend**: An Express.js/TypeScript API with MongoDB and Cloudinary integration

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- MongoDB installed locally or a MongoDB Atlas account
- Cloudinary account for image storage

### Frontend Setup

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies
npm i

# Step 4: Create a .env file based on .env.example
cp .env.example .env

# Step 5: Start the development server
npm run dev
```

### Backend Setup

```sh
# Step 1: Run the setup script to install server dependencies
chmod +x setup-server.sh
./setup-server.sh

# Step 2: Update the server/.env file with your MongoDB and Cloudinary credentials

# Step 3: Start the backend server
cd server
npm run dev
```

## Technologies Used

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- Axios for API communication

### Backend
- Node.js & Express
- TypeScript
- MongoDB with Mongoose
- Cloudinary for image storage
- Multer for file uploads

## Features

- Create digital photo albums
- Upload images to Cloudinary
- Share albums with QR codes
- Responsive design for all devices

## Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from your dashboard
3. Add these credentials to the `server/.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Deployment

### Frontend Deployment

Simply open [Lovable](https://lovable.dev/projects/6cfc61f1-5c95-4265-b73f-60eb89fddbf1) and click on Share -> Publish.

### Backend Deployment

The backend can be deployed to various platforms:

- **Heroku**: Follow [Heroku Node.js deployment guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- **Render**: [Deploy to Render](https://render.com/docs/deploy-node-express-app)
- **Railway**: [Deploy to Railway](https://railway.app/)

Remember to set up the environment variables on your chosen platform.

## API Endpoints

For a complete list of API endpoints, refer to the [server/README.md](server/README.md) file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
