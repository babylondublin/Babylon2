$( document ).ready(function() {
    //- FIND A BEtTER WAY TO DO THAT  ?? 

    //header
    if($.cookie("lang") === '59e8823077df3618184b7a92'){ // FR
        $('#living').text('Y vivre');
        $('#placesToGo').text('A visiter');
        $('#thingsToDo').text('A faire');
        $('#planYourTrip').text('Planifiez votre voyage');
        $('#news').text('Nouvelles');
        $('#classifieds').text('Annonces');
        $('#events').text('Événements');
        $('#aboutus').text('À propos de');
    }else if($.cookie("lang") === '59e8823877df3618184b7a93'){ // ESP
        $('#living').text('Viviendo');
        $('#placesToGo').text('Visitando');
        $('#thingsToDo').text('Hacer');
        $('#planYourTrip').text('Planifica tu viaje');
        $('#news').text('Noticias');
        $('#classifieds').text('Clasificados');
        $('#events').text('Eventos');
        $('#aboutus').text('Acerca de');
    }
    // side left menu
    if($.cookie("lang") === '59e8823077df3618184b7a92'){ // FR
        $('button#living').text('Y vivre');
        $('button#placesToGo').text('A visiter');
        $('button#thingsToDo').text('A faire');
        $('button#planYourTrip').text('Planifiez votre voyage');
        $('a#news').text('Nouvelles');
        $('a#classifieds').text('Annonces');
        $('a#events').text('Événements');
        $('a#aboutus').text('À propos de');
    }else if($.cookie("lang") === '59e8823877df3618184b7a93'){ // ESP
        $('button#living').text('Viviendo');
        $('button#placesToGo').text('Visitando');
        $('button#thingsToDo').text('Hacer');
        $('button#planYourTrip').text('Planifica tu viaje');
        $('a#news').text('Noticias');
        $('a#classifieds').text('Clasificados');
        $('a#events').text('Eventos');
        $('a#aboutus').text('Acerca de');
    }

    //footer
    if($.cookie("lang") === '59e8823077df3618184b7a92'){ // FR
        $('#about').text('À propos de nous');
        $('#whoWeAre').text('Qui sommes nous');
        $('#contactUs').text('Contactez nous');
        $('#careers').text('Emplois');
        $('#explorecountries').text('Explorez les pays');
        $('#members').text('Membres');
    }else if($.cookie("lang") === '59e8823877df3618184b7a93'){ // ESP
        $('#about').text('Acerca de');
        $('#whoWeAre').text('Quienes somos');
        $('#contactUs').text('Contáctenos');
        $('#careers').text('Empleos');
        $('#explorecountries').text('Explora los paises');
        $('#members').text('Miembros de Babylon');
    }
});