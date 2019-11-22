var express = require('express');
var bodyParser = require('body-parser');
var Request = require('request-promise');
var mongoose = require('mongoose'); //optional
var app = express();
require('dotenv').config();

mongoose.connect('mongodb://localhost/marvelAPI', { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false});
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


/* Originally, mongoose was used in order to save the character to the database. But this version does not involve working with database. 
This version turn out to be getting the data from the API. Then manipulating them into their own varibles and pass them 
to the show page.
//Mongoose model set up for Thumbnail > path, and extension
var Schema = mongoose.Schema;
var thumbnailSchema = new Schema({
    path: "String",
    extension: "String"
});
var thumbnailPath = mongoose.model('thumbnailPath', thumbnailSchema);


//Mongoose model set up for Comics
var Schema = mongoose.Schema;
var comicsSchema = new Schema({
    title: "String",
    path : "String",
    extension: "String"
});
var Comics = mongoose.model('Comics', comicsSchema);

//Mongoose model set up for Character
var Schema = mongoose.Schema;
var characterSchema = new Schema({
    id: "Number",
    name: "String",
    description: "String",
    imagePath: [thumbnailSchema],
    comicsPath: [comicsSchema]
});
var Character = mongoose.model('Character', characterSchema);
*/

var api_key = process.env.KEY;
//Index and Create Page where form was included and the characters were showcase to the main page
app.get('/', function(request,response){
    var mainURL = `https://gateway.marvel.com/v1/public/characters?&ts=thor&apikey=${api_key}`
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
})

//SHOW Page where the searched character was shown with its comics and images.
app.post('/',function(request,response){
    var characterData = request.body.hero
    var url = "https://gateway.marvel.com/v1/public/characters?name=" + characterData + "&ts=thor&apikey=" + api_key;
    Request(url)
    .then((body)=>{
        var apiData = JSON.parse(body)
        var characterID = apiData.data.results[0].id
        var comicsURL = "https://gateway.marvel.com/v1/public/characters/" + characterID + "/comics?&ts=thor&apikey=" + api_key;
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
        console.log(error)
    })
})





app.listen(process.env.PORT || 3000, ()=> {
    console.log('Version3 Connected')
});