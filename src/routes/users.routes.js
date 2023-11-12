const {Router} = require("express"); //importando o router para esse arquivo

const UsersControllers = require("../controllers/usersControllers")

const userRoutes = Router();

function myMiddleware(request, response , next){
    console.log("voce passou pelo middleware");
}

const usersControllers = new UsersControllers()

userRoutes.post("/",usersControllers.create);
userRoutes.put("/:id",usersControllers.update);

module.exports = userRoutes;//exportando módulo para ser visivel por outros arquivos
