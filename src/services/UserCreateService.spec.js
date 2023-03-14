const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory");
const AppError = require("../utils/AppError");
const UserCreateService = require("./UserCreateService");

// Agrupando testes com o Describe:

describe("UserCreateService", () => {
	let userRepositoryInMemory = null;
	let userCreateService = null;

	beforeEach(() => {
		userRepositoryInMemory = new UserRepositoryInMemory;
		userCreateService = new UserCreateService(userRepositoryInMemory);
	});

	it("user should be created", async () => {
		const user = {
			name: "User Test",
			email: "user@test.com",
			password: "123"
		};

		const userCreated = await userCreateService.execute(user);

		console.log(userCreated);

		expect(userCreated).toHaveProperty("id");
	});

	it("user should be create exists email", async () => {
		const user1 = {
			name: "Usuário teste 1",
			email: "user1@email.com",
			password: "123"
		};
		const user2 = {
			name: "Usuário teste 2",
			email: "user1@email.com",
			password: "123"
		};

		await userCreateService.execute(user1);

		await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Este email já está em uso."));

	});
});