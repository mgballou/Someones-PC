const axios = require('axios')

const User = require("../models/User")

let endpoint 

module.exports = {
    update: addFavoritePokemon,
    show
}

function addFavoritePokemon(req, res){
    if (req.body.name > 1008){
        res.redirect(`/users/${req.user._id}`)
    }
    let foundPokemon
    endpoint = req.body.favorite.toLowerCase()
    axios.get(`https://pokeapi.co/api/v2/pokemon/${endpoint}`)
    .then(function(response){
        console.log(response)
        foundPokemon = {
             name: response.data.name,
             types: response.data.types,
             sprite: response.data.sprites.front_default
        }
        return foundPokemon
    } ).then(function (foundPokemon){
        User.findById(req.user._id)
        .then(function(foundUser){
            foundUser.favorite=foundPokemon
            return foundUser.save()
        })
        res.redirect(`/users/${req.user._id}`)
    }).catch(function (err){
        console.log(err)
    })
}

function show(req, res){
    // let user 
    // User.findById(req.user._id)
    // .then(function (foundUser){
    // })
    res.render("users/show", {title: "userPage"})
}