const Team = require('../models/Team')
const Pokemon = require('../models/Pokemon')
const Item = require('../models/Item')
const axios = require('axios')

let endpoint

module.exports = {
    create,
    delete: destroy,
    update,
    index,
    new: newPokemon,
    edit
}

function create(req, res) {
    if (req.body.name > 1008) {
        res.redirect('/pokemon/new')
    }

    let foundPokemon
    let randomInt = Math.floor(Math.random() * 10)


    if (typeof (req.body) !== Number) {
        endpoint = req.body.name.toLowerCase()

    } else {
        endpoint = req.body.name
    }
    axios.get(`https://pokeapi.co/api/v2/pokemon/${endpoint}`)
        .then(function (response) {
            foundPokemon = {
                name: response.data.name.toUpperCase(),
                dexNumber: response.data.id,
                user: req.user._id,
                sprite: response.data.sprites.front_default,
                type1: response.data.types[0].type.name,
                stats: response.data.stats.map(statRecord => {
                    statName = statRecord.stat.name
                    baseStat = statRecord.base_stat
                    return {
                        statName: statName,
                        values: {
                            base: baseStat,
                            effort: 0,
                            individual: 0
                        }
                    }
                }),
                abilities: {
                    current: response.data.abilities[0].ability.name,
                    all: response.data.abilities.map(abilityRecord => {
                        return abilityRecord.ability.name
                    })
                }
            }
            if (response.data.types.length > 1) {
                foundPokemon.type2 = response.data.types[1].type.name
            } else {
                foundPokemon.type2 = ''
            }
            if (randomInt === 1 && foundPokemon.dexNumber <= 905) {
                foundPokemon.sprite = response.data.sprites.front_shiny
            }
            Pokemon.create(foundPokemon)
        })
        .then(function (newPokemon) {
            console.log(newPokemon)
            res.redirect('/pokemon')
        })
        .catch(function (err) {
            console.log(err)
            res.redirect('/pokemon/new')
        })
}



function removePokemon(req, res) {
    let pokeId = req.params.id
    Team.find({ pokemon: pokeId })
        .then(function (team) {
            team.pokemon.pull(pokeId)
            return team.save()
        })
        .then(function (newTeam) {
            res.redirect(`/teams/${newTeam._id}`)
        })
        .catch(function (err) {
            console.log(err)
            res.redirect('/teams')
        })
}

function update(req, res) {

    Pokemon.findById(req.params.id)
        .then(function (foundPokemon) {
            foundPokemon.nickname = req.body.nickname
            foundPokemon.abilities.current = req.body.ability
            foundPokemon.heldItem = req.body.heldItem
            return foundPokemon.save()
        })
        .then(function () {
            res.redirect(`/pokemon`)
        })
        .catch(function (err) {
            console.log(err)
            res.redirect(`/pokemon`)
        })
}



function index(req, res) {
    Pokemon.find({ 'user': req.user._id })
        .then(function (pokemon) {
            res.render('pokemon/index', { pokemon, title: 'All Your Pokemon' })
        })
}


function newPokemon(req, res) {
    res.render('pokemon/new', { title: 'Create a new pokemon' })
}

function edit(req, res) {
    let pokemon
    Pokemon.findById({ _id: req.params.id })
        .then(function (foundPokemon) {
            pokemon = foundPokemon
            return Item.find({})
        })
        .then(function(allItems){
            res.render('pokemon/edit', { pokemon, title: "Edit Pokemon Details", items: allItems })

        })
        .catch(function (err) {
            console.log(err)
            res.redirect('/pokemon')
        })
}

function destroy(req, res) {
    Team.find({ 'pokemon': req.params.id })
        .then(function (foundTeams) {
            console.log(foundTeams)
            foundTeams.forEach(team => {
                team.pokemon.pull(req.params.id)
                team.save()
            })
            return

        })

    Pokemon.deleteOne({ _id: req.params.id })
        .then(function (results) {
            console.log(results)
            res.redirect('/pokemon')
        })
}