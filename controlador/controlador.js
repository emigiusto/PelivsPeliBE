var con = require('../dba/conexionbd');


function traercompetencias(req, res) {
    var sql = "select * from competencias"
    
            con.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }


        res.send(JSON.stringify(resultado));
    });
}

function traergeneros(req, res) {
    var sql = "select * from genero"
    con.query(sql, function(error, result) {
        if (error) {
            console.log(error)
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("No pudo crearse la competencia");
        }
        res.send(result);
    });
}

function traerdirectores(req, res) {
    var sql = "select * from director"
    con.query(sql, function(error, result) {
        if (error) {
            console.log(error)
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("No pudo crearse la competencia");
        }
        res.send(result);
    });
}

function traeractores(req, res) {
    var sql = "select * from actor"
    con.query(sql, function(error, result) {
        if (error) {
            console.log(error)
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("No pudo crearse la competencia");
        }
        res.send(result);
    });
}

function competencia(req, res) {
    var idCompetencia = req.params.id;
    var sql = "select competencias.nombre as 'nombre', genero.nombre as 'genero_nombre', actor.nombre as 'actor_nombre', director.nombre as 'director_nombre' from competencias "
            + "left outer join genero on competencias.genero_id = genero.id left outer join actor on competencias.actor_id = actor.id left outer join director on competencias.director_id = director.id "
            + " where competencias.id =" + idCompetencia
            con.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        res.send(JSON.stringify(resultado));
    });
}


function traerpeliscompetencia(req, res) {
    //TRAER DOS ALEATORIAS??

        var idCompetencia = req.params.id;
        var sql =   "SELECT DISTINCT pelicula.id AS 'peliculaId',tactores.actor_id AS 'actorId',pelicula.genero_id AS 'generoId',tdirectores.director_id AS 'directorId',"
                +   "pelicula.titulo, pelicula.poster, pelicula.anio,tcompetencias.nombre AS 'nombreCompetencia',tcompetencias.id AS 'idCompetencia',tcompetencias.genero_id AS 'generoCompetencia',tcompetencias.director_id AS 'directorCompetencia',"
                +   "tcompetencias.actor_id AS 'actorCompetencia' "
                +   "FROM pelicula "
                +   "JOIN (SELECT id, genero_id, director_id, actor_id, nombre FROM competencias) AS tcompetencias ON tcompetencias.id = " + idCompetencia
                +   " JOIN (SELECT director_id, pelicula_id FROM director_pelicula) AS tdirectores ON tdirectores.pelicula_id = pelicula.id "
                +   "JOIN (SELECT actor_id, pelicula_id FROM actor_pelicula) AS tactores ON tactores.pelicula_id = pelicula.id "
                +   "WHERE "
                +   "pelicula.genero_id LIKE CASE WHEN (tcompetencias.genero_id IS NULL = 1) THEN '%' ELSE tcompetencias.genero_id END "
                +   "AND tdirectores.director_id LIKE CASE WHEN (tcompetencias.director_id IS NULL = 1) THEN '%' ELSE tcompetencias.director_id END "
                +   "AND tactores.actor_id LIKE CASE WHEN (tcompetencias.actor_id IS NULL = 1) THEN '%' ELSE tcompetencias.actor_id END "
                +   " group by pelicula.id "
                +   "ORDER BY RAND() LIMIT 2;"
                    
        con.query(sql, function(error, arraypeliculasrandom) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            if (arraypeliculasrandom.length>0){
                var results ={
                    competencia: arraypeliculasrandom[0].nombre,
                    peliculas: arraypeliculasrandom
                }
                res.send(JSON.stringify(results));
            }
            if (arraypeliculasrandom.length==0){
                return res.status(404).send("No hay una competencia con el id requerido");
            }
            
        });
    }


    function votarunacompetencia(req, res) {

            var idCompetencia = req.params.idCompetencia;
            var votoPeli = req.body.idPelicula;

            var sql = "INSERT INTO `votos` VALUES (NULL," + idCompetencia + "," + votoPeli +")"

        con.query(sql, function(error, result) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }
    
                res.send("Voto Ok");
            });
    }
        

    function traerresultadoscompetencia(req, res) {

        var idCompetencia = req.params.idCompetencia;
        var sql =     "select pelicula.id as 'peliculaId',"
                    + "pelicula.titulo,pelicula.poster,"
                    + "competencias.nombre as 'competenciaNombre',"
                    + "competencias.id as 'competenciaId',"
                    + "count(votos.id) as 'votos'"
                    + " from pelicula"
                    + " join competencias on competencias.id = " + idCompetencia
                    + " join votos on (votos.pelicula_id = pelicula.id and votos.competencia_id = competencias.id)"
                    + " GROUP BY pelicula.id order by votos desc limit 3;"

        con.query(sql, function(error, results) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            var resultado = {
                competencia: results[0].competenciaNombre,
                resultados: results
            }

                res.send(resultado);
            });
    }

    function crearcompetencia(req, res) {
        var competencia = req.body;
        var sql = "INSERT INTO `competencias` VALUES (NULL,'"+ competencia.nombre +"',"+ competencia.genero +","+competencia.director +","+competencia.actor+")";
        con.query(sql, function(error, result) {
                if (error) {
                    console.log(error)
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("No pudo crearse la competencia");
                }
                res.send("Competencia Creada exitosamente");
            });
    }

    function borrarcompetencia(req, res) {
        var idCompetencia = req.params.idCompetencia;
        var sql = "DELETE FROM competencias WHERE id =" + idCompetencia + ";"
        con.query(sql, function(error, result) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("No pudo borrarse la competencia");
                }
                res.send("Competencia Borrada Exitosamente");
            });
    }

    function editarcompetencia(req, res) {
        var idCompetencia = req.params.idCompetencia;
        var competencia = req.body;
        var sql =   "UPDATE competencias SET "
                +   "nombre = '" + competencia.nombre + "'" 
                /*+   ", genero_id = '" + competencia.genero + "' , "
                +   "director_id = '" + competencia.director + "' , " 
                +   "actor_id = '" + competencia.actor + "' , "  */
                +   " WHERE id =" + idCompetencia + ";"

        con.query(sql, function(error, result) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("No pudo editarse la competencia");
                }
                res.send("Competencia Editada Exitosamente");
            });
    }
    

    //GUIA 3 PUNTO 2
    function borrarvotos(req, res) {
        var idCompetencia = req.params.idCompetencia;
        console.log(idCompetencia)
        var sql = "DELETE FROM votos WHERE competencia_id = " + idCompetencia
        con.query(sql, function(error, result) {
            if (error) {
                console.log(error)
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("La competencia no existe");
            }
            res.send("Competencia Reiniciada exitosamente");
        });
    }
    
    
module.exports = {
    competencia: competencia,
    
    traerpeliscompetencia: traerpeliscompetencia,
    traerresultadoscompetencia: traerresultadoscompetencia,

    votarunacompetencia:votarunacompetencia,
    borrarvotos:borrarvotos,

    crearcompetencia: crearcompetencia,
    borrarcompetencia: borrarcompetencia,
    editarcompetencia: editarcompetencia,

    traercompetencias: traercompetencias,
    traergeneros: traergeneros,
    traerdirectores: traerdirectores,
    traeractores: traeractores
};