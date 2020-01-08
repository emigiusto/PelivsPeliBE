SELECT DISTINCT pelicula.id AS 'peliculaId',tactores.actor_id AS 'actorId',pelicula.genero_id AS 'generoId',tdirectores.director_id AS 'directorId',
    pelicula.titulo,tcompetencias.nombre AS 'nombreCompetencia',tcompetencias.id AS 'idCompetencia',tcompetencias.genero_id AS 'generoCompetencia',tcompetencias.director_id AS 'directorCompetencia',
    tcompetencias.actor_id AS 'actorCompetencia'
FROM pelicula
JOIN (SELECT id, genero_id, director_id, actor_id, nombre FROM competencias) AS tcompetencias ON tcompetencias.id = 6
JOIN (SELECT director_id, pelicula_id FROM director_pelicula) AS tdirectores ON tdirectores.pelicula_id = pelicula.id
JOIN (SELECT actor_id, pelicula_id FROM actor_pelicula) AS tactores ON tactores.pelicula_id = pelicula.id
WHERE
    pelicula.genero_id LIKE CASE WHEN (tcompetencias.genero_id IS NULL = 1) THEN '%' ELSE tcompetencias.genero_id END
AND tdirectores.director_id LIKE CASE WHEN (tcompetencias.director_id IS NULL = 1) THEN '%' ELSE tcompetencias.director_id END
AND tactores.actor_id LIKE CASE WHEN (tcompetencias.actor_id IS NULL = 1) THEN '%' ELSE tcompetencias.actor_id END
ORDER BY RAND() LIMIT 2