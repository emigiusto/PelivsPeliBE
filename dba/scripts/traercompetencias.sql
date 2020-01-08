select competencias.nombre as 'nombre', genero.nombre as 'genero_nombre', actor.nombre as 'actor_nombre', director.nombre as 'director_nombre' from competencias 

left outer join genero on competencias.genero_id = genero.id left outer join actor on competencias.actor_id = actor.id left outer join director on competencias.director_id = director.id

where competencias.id = 3