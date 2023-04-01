require('dotenv').config();
require('./config/database');

const Pokemon = require('./models/Pokemon')
const Team = require('./models/Team')
const Item = require('./models/Item')

const axios = require('axios')

const apiPath = 'https://pokeapi.co/api/v2/item-attribute/7/'

let allItems = []


function getAllItems(){
    axios.get(apiPath)
    .then(function(response){
        
        allItems = response.data.items.map(item => {
            return {
                name: item.name
            }
        })
        console.log(allItems)
        return allItems
    })
    .catch(function(err){
        console.log(err)
    })

}

function seedDatabase(){
    Pokemon.deleteMany({})
    .then(function(results){
        console.log(results)
    })
    .then(function(){
        return Team.deleteMany({})
    })
    .then(function(response){
        console.log(response)
        return Item.create(allItems)
    })
    .then(function(result){
        console.log(result)
    })
    .catch(function(err){
        console.log(err)
    })
    .finally(function(){
        process.exit()
    })
}
getAllItems()
seedDatabase()