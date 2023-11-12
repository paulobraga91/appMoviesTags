require("express-async-errors")
const migrationsRun = require("./database/sqlite/migrations")

const express = require("express") //instalando o express

const AppErro = require("./utils/AppErro")

const routes = require("./routes")

migrationsRun();//iniciar o banco de dados

const app = express()// inicializando o express

app.use(express.json()); //informando a api que o retorno é atraves de json 

app.use(routes);



app.use((error, request, response, next)=> {

    if(error instanceof AppErro){
        return response.status(error.statusCode).json({
            status: "error",
            statusCode : error.message
        });
    }

    return response.status(500).json({
        status: "error",
        message:"Internal Server Error"
    })

});

const PORT = 3333; //definindo a porta

app.listen(PORT,()=>{console.log(`Server is running on PORT ${PORT}`)}); 
