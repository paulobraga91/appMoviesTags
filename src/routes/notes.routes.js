const {Router} = require("express"); //importando o router para esse arquivo

const NotesControllers = require("../controllers/moveisNotesControllers")

const notesRoutes = Router();

const notesControllers = new NotesControllers()

notesRoutes.post("/:user_id",notesControllers.create);

notesRoutes.get("/:id",notesControllers.show);

notesRoutes.delete("/:id",notesControllers.delete);

notesRoutes.get("/",notesControllers.index);


module.exports = notesRoutes;//exportando módulo para ser visivel por outros arquivos
