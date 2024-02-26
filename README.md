# Social Media Backend App

This application serves as a simple backend for a social media platform, featuring essential functionalities such as user management, friendships, posts, likes, and a dynamic wall displaying posts with support for pagination. Built with efficiency and scalability in mind, it's equipped to handle the core needs of any social media application.

## Features

- **User Management**: Create user accounts to begin interacting with the platform.
- **Social Interactions**: Follow users and add friends to build your social network.
- **Content Creation**: Share your thoughts and moments through posts.
- **Engagements**: Like posts to show appreciation for the content.
- **Dynamic Wall**: View a personalized wall of posts from friends, followed users, and public posts, complete with pagination for efficient data retrieval.
- **Swagger Documentation**: All routes are thoroughly documented for ease of use and integration.

## Getting Started

### Prerequisites

Ensure you have Docker and Docker Compose installed on your machine to run the application containers.

### Running the Application

#### For Production

To deploy the application in a production environment, use the following command:

```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

#### For Development

For development purposes, especially if you wish to watch for file changes, use:

```sh
docker-compose up --build
```

#### Accessing the Application

After successfully launching the application, the API endpoints can be accessed and tested through the Swagger UI at:

```sh
http://localhost:8080/api
```

## Testing

The application comes equipped with unit tests for all routes and functionalities. To run the tests, execute:

```sh
npm run test
```

Ensure you have Node.js and NPM installed to run the tests outside Docker containers
