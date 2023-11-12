const {hash, compare} = require("bcryptjs");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppErro");

class usersControllers {
    async create(request, response){
        const {name, email, password} = request.body;

        const database = await sqliteConnection();

        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)",[email])

        if(checkUserExists){
            throw new AppError("Esse email já está em uso.")
        }

        const hashedPassword = await hash(password,8);

        await database.run("INSERT INTO users (name, email, password) VALUES (?,?,?)",[name,email,hashedPassword])

        return response.status(201).json();
    }

    async update(request,response){
        const {name, email, old_password, password} = request.body;
        const {id} = request.params;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users where id = (?)",[id])

        if(!user){
            throw new AppError("Usuario não encontrado");
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)",[email])

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError(`Email já está em uso por outro usuário: ${userWithUpdatedEmail.name}`)
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !old_password){
            throw new AppError("Digite sua senha antiga")
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password,user.password)

            if(!checkOldPassword){
                throw new AppError("Senha antiga não confere")
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
        UPDATE users SET 
        name = ?, 
        email = ?, 
        update_at = DATETIME('now')
         WHERE ID =?`,
         [user.name, user.email, id])

        return response.status(200).json();
    }

    
}

module.exports = usersControllers

//está se usando classe porque ela permite que dentro dela pode se ter várias funcões, um controller pode se ter
// no máximo 5 funcões, index - get (listar vários registros), show - get(Exibir um registro específico), 
//Create - POST ( Criar registro), Update - PUT(atualizar um registro), Delete - delete(remover um registro)