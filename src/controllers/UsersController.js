
const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const UserRepositoy = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");


class UsersController {
	async create(request, response) {
		const userRepository = new UserRepositoy();
		const userCreateService = new UserCreateService(userRepository);
		const { name, email, password } = request.body;

		await userCreateService.execute({ name, email, password });

		return response.status(201).json();
	}

	async update(request, response) {
		const { name, email, password, old_password } = request.body;
		const user_id = request.user.id;

		const database = await sqliteConnection();
		const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

		if (!user) {
			throw new AppError("Usuário não encontrado");
		}

		const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

		if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
			throw new AppError("Este email já está em uso.");
		}
		user.name = name ?? user.name; // Nullish coalescing operator (??)
		user.email = email ?? user.email;

		if (password && !old_password) {
			throw new AppError("Informe a senha antiga para atualizar");
		}
		if (password && old_password) {
			const checkOldPassword = await compare(old_password, user.password);

			if (!checkOldPassword) {
				throw new AppError("A senha antiga não confere.");
			}

			user.password = await hash(password, 8);
		}

		await database.run(`
            UPDATE users SET
            name = ?, 
            email = ?,
            password = ?,
            update_at = DATETIME('now')
            WHERE id = ?`, [user.name, user.email, user.password, user_id]
		);

		return response.status(200).json();
	}

}

module.exports = UsersController;