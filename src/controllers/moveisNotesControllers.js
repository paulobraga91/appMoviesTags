const { request, response } = require("express");
const knex = require("../database/knex");
const AppError = require("../utils/AppErro");

class moviesNotesControllers {

    async create(request, response){

        const { title, description, rate, tags} = request.body;
        const {user_id} = request.params;

        if (rate < 0 || rate > 5){
            throw new AppError("Digite um Rate entre 0 e 5") 
        }

        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rate,
            user_id
        });

        const tagsInsert = tags.map( name =>{
            return{
                moviesNotes_id:note_id,
                name,
                user_id
                
            }
        });

        await knex("movie_tags").insert(tagsInsert)

        return response.json();


    }

    async show(request,response){
        const {id} = request.params;

        const note = await knex("movie_notes").where({id}).first();
        const tags = await knex("movie_tags").where({moviesNotes_id : note.id}).orderBy("name");
        


        return response.json({...note,tags});
    }

    async delete(request, response){
        const {id} = request.params;

        await knex("movie_notes").where({id}).delete();

        const nota = await knex("movie_notes").where({id})

        if(nota.length === 0){

            throw new AppError("Nota informada não existe.")
        }

        return response.json("Nota deletada")
    }

    async index (request , response){

        const {user_id, title, tags} = request.query;

        let notes;

        if(tags){

            const filterTags = tags.split(',').map(tag => tag.trim());
            
            notes = await knex("movie_tags").whereIn("name", filterTags)

        }else{
        
            notes = await knex("movie_notes").where({user_id}).whereLike("title",`%${title}%`).orderBy("title")

        }
    
        return response.json({notes});
        
    }

}

module.exports = moviesNotesControllers
