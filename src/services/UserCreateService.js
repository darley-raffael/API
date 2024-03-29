const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UserCreateService {
	constructor(userRepository) {
		this.userRepository = userRepository;
	}

	async execute({ name, email, password }) {
		const checkUsersExists = await this.userRepository.findByEmail({ email });

		if (checkUsersExists) {
			throw new AppError("Este email já está em uso.");
		}

		const hashPassword = await hash(password, 8);

		const userCreated = await this.userRepository.create({ name, email, password: hashPassword });

		return userCreated;
	}


}


module.exports = UserCreateService;