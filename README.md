# Watchlist Manager

A web application that helps users manage and organize their watchlist for movies, TV series, and anime. Keep track of what you want to watch next, what you're currently watching, and what you've completed.

## Features

- Create and manage personalized watchlists
- Categorize content by type (movies, TV series, anime)
- Track watching status (plan to watch, watching, completed)
- User authentication and personal watchlist privacy
- Responsive design for seamless mobile and desktop experience

## Technologies Used

- Frontend:
  - Vite(React)
  - CSS
  - HTML
  - JavaScript
- Backend:
  - Express
  - Node.Js
  - MongoDB

## Installation

1. Clone the repository
```bash
git clone https://github.com/mithun-ctrl/senpai-list.git
cd senpai-list
```

2. Install dependencies
```bash
# Add your installation commands here
npm install
```

3. Configure environment variables
```bash
# Create a .env file and add your configuration
cp .env.example .env
```

4. Start the development server
```bash
# Add your start command here
npm start
```

## Usage

1. Register a new account or log in to an existing one
2. Click "Add to Watchlist" to add new content
3. Organize your content by category
4. Update the status as you watch
5. Mark items as completed when you finish them

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Watchlist Endpoints

- `GET /api/media/list` - Get user's watchlist
- `POST /api/media/list` - Add new item to watchlist
- `PUT /api/media/list/:id` - Update watchlist item
- `DELETE /api/media/list/:id` - Remove item from watchlist

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [Email](mailto:itsmithun01@gmail.com)

Project Link: [https://github.com/mithun-ctrl/senpai-list](https://github.com/mithun-ctrl/senpai-list)

## Acknowledgments

- List any resources, libraries, or tools you used
- Credit any inspiration or reference projects
- Thank contributors or mentors
