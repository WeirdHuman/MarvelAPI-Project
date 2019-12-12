var express = require('express');
var bodyParser = require('body-parser');
var Request = require('request-promise');
var server = express();
require('dotenv').config();

server.use(express.static(__dirname + '/public'));
server.use(bodyParser.urlencoded({ extended: true }));
var api_key = process.env.KEY;
var hash = process.env.SERECT;

//ALL The Routes start Here.
//Index and Create Page where form is included and the characters from the API are showcase to the main page.
server.get('/',function(request, response){
    response.redirect('/hero')
})

server.get('/hero', function(request,response){
    var mainURL = "https://gateway.marvel.com/v1/public/characters?&ts=thor&apikey=" + api_key + "&hash=" + hash;
    Request(mainURL)
    .then((body)=>{
        var frontAPI = JSON.parse(body);
        var characterList = frontAPI.data.results
        var characterWithImage = [];
        var counter = 0;
        for(var x = 0; x < characterList.length; x++){
            var imageLocation = characterList[x].thumbnail.path;
            if(imageLocation.includes("image_not_available") !== true){
                characterWithImage.push(characterList[x]);
                counter ++
            }
            if(counter == 6){
                break;
            }
        }
        response.render('index.ejs', {characterWithImage:characterWithImage})
    })
    .catch((error)=>{
    console.log(error)
        })
});

//SHOW Page where the searched character is shown with its comics and images.
server.post('/hero',function(request,response){
    var characterData = request.body.hero
    var url = "https://gateway.marvel.com/v1/public/characters?name=" + characterData + "&ts=thor&apikey=" + api_key + "&hash=" + hash;
    Request(url)
    .then((body)=>{
        var apiData = JSON.parse(body)
        var characterID = apiData.data.results[0].id
        var comicsURL = "https://gateway.marvel.com/v1/public/characters/" + characterID + "/comics?&ts=thor&apikey=" + api_key + "&hash=" + hash;
        Request(comicsURL)
        .then((body)=>{
            var comicsData = JSON.parse(body);
            var comicsWithImage = [];
            var fullListComics = comicsData.data.results;
            var count = 0;
            for(var i = 0; i < fullListComics.length; i++){
                var imageIncluded = fullListComics[i].thumbnail.path
                if(imageIncluded.includes("image_not_available") !== true && fullListComics[i].description !== null){
                    comicsWithImage.push(fullListComics[i])
                    count++
                } if(count == 3){
                    break;
                }
            }
            response.render('show.ejs',{apiData:apiData, comicsWithImage:comicsWithImage})
        })
        .catch((error)=>{
            console.log(error)
        })
    })
    .catch((error)=>{
        response.render('error.ejs')
    })
})


//Pages for individual characters......
server.get('/hero/3DMan',function(request, response){
    response.render('Man.ejs')
})
server.get('/hero/ABomb',function(request, response){
    response.render('Bomb.ejs')
})
server.get('/hero/AIM',function(request, response){
    response.render('AIM.ejs')
})
server.get('/hero/Emil',function(request, response){
    response.render('Emil.ejs')
})
server.get('/hero/Absorbing',function(request, response){
    response.render('Absorbing.ejs')
})
server.get('/hero/Abyss',function(request, response){
    response.render('Abyss.ejs')
})

//Pages for the MID section.....
server.get('/comics/special',function(request,response){
    response.render('special.ejs')
})
server.get('/television/special',function(request,response){
    response.render('mespecial.ejs')
})
server.get('/television/onair',function(request,response){
    response.render('now.ejs')
})
server.get('/catchme',function(request, response){
    response.render('catchme.ejs')
})


server.listen(process.env.PORT || 3000, ()=> {
    console.log('Version Connected')
});

//Pages for the Top Section
server.get('/BlackWidow',function(request, response){
    response.render('BlackWidow.ejs')
})
server.get('/BlackWidowShowcase',function(request, response){
    response.render('BlackWidowShowcase.ejs')
})