# Wa Bot CS BE RESTful API

This project is a RESTful API designed for managing operations in "Wa Bot CS BE", using Node.js and various other technologies like Prisma, OpenAI, PinecodeDB, and Express.

<!-- TOC --><a name="prerequisites"></a>

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js (v18 or higher)**: The project is built with Node.js. You must have Node.js version 18 or higher installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
- **npm (Node Package Manager)**: npm is used to install dependencies. It comes with Node.js, so if you have Node.js installed, you should have npm as well.
- **Git**: While not strictly necessary, the project recommends using Git for version control. If you plan to clone the repository, make sure Git is installed on your system. You can download it from [Git's official website](https://git-scm.com/).
- **Basic knowledge of terminal or command line usage**: Since the installation and running of the project require using the terminal or command line, basic knowledge in this area will be beneficial.

Once you have these prerequisites, you can proceed with the installation instructions below.

<!-- TOC --><a name="installation"></a>

## Installation

Follow these steps to install and run the project:

1. Clone the repository:

   ```bash
   git clone git@github.com:KuraoHikari/wa-bot-cs-be.git
   cd wa-bot-cs-be
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and fill it with necessary environment variables:

   ```
   OPEN_AI_API_KEY="your open api key"
   PINECONE_API_KEY="your pinecode api key"
   DATABASE_URL="your postgres db url"
   DIRECT_URL="if you using serverles postgres"
   JWT_SECRET="anything you want"
   ```

4. Run database migrations (ensure your database connection details are correct in `.env`):

   ```bash
   npx prisma migrate dev
   ```

5. Start the server:
   - For development:
     ```bash
     npm run dev
     ```

## Database Design

To get a better understanding of the database structure, you can view the Entity Relationship Diagram (ERD) for Wa Bot CS BE:

[View ERD for Wa Bot CS BE](https://imgur.com/gallery/schema-db-wa-bot-cs-kurao-hikari-Ktk7Wx7)

For a direct look at the main ERD, see below:

![ERD Wa Bot CS BE](https://i.imgur.com/bjkBTEf.png)

## Dependencies

This project uses the following major dependencies:

- **Node.js**: Runtime environment.
- **Express**: Web application framework.
- **Prisma**: ORM for database management.
- **OpenAI**: Service AI Response.
- **PinecodeDB**: Service for vector DB.
- **Zod**: For schema validation.
- Other dependencies include `bcrypt`, `body-parser`, `cors`, `dotenv`, `http-status-codes`, `jsonwebtoken`, `multer`.

<!-- TOC --><a name="acknowledgements"></a>

## Acknowledgements

Special thanks to the contributors and supporters of the technologies used in this project. Their dedication to open source makes projects like this possible.

<!-- TOC --><a name="authors"></a>

## Authors

- **Kurao Hikari** - _Initial Work_ - [GitHub Profile](https://github.com/KuraoHikari)

<!-- TOC --><a name="license"></a>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
