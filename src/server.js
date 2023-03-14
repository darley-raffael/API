require("express-async-errors");
require("dotenv");

const AppError = require("./utils/AppError");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3333;
const routes = require("./routes");
const uploadConfig = require("./configs/upload");
const migrationsRun = require("./database/sqlite/migrations");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(routes);
migrationsRun();

app.use("/files", express.static(uploadConfig.UPLOAD_FOLDER));

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
	if (error instanceof AppError) {
		return response.status(error.statusCode).json({
			status: "error",
			message: error.message
		});
	}

	console.error(error);

	return response.status(500).json({
		status: "error",
		message: "Internal server errror"
	});
});




app.listen(PORT, () => console.log(`Server is running on Port: localhost:${PORT}/users`));