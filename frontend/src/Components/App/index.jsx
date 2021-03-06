import React, { Component } from "react";
import { Route, Switch, Link } from 'react-router-dom'
import axios from 'axios'

import PokemonList from '../PokemonList'
import PokemonDetails from "../PokemonDetails";
import CaughtPokemon from '../CaughtPokemon'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pokemonList: [],
      pokemonIndex: 0,
      caughtPokemon: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8000/')
      .then((response) => {
        this.setState({
          pokemonList: response.data.pokemonList,
          caughtPokemon: response.data.caughtPokemon
        })
      })
  }

  componentDidUpdate() {
    const { caughtPokemon } = this.state
    axios.post('http://localhost:8000/', { caughtPokemon })
      .then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
  }

  sendId = (cutId) => {
    this.setState({
      pokemonIndex: cutId
    })
  }

  addPokemon = (url, i) => {
    const { caughtPokemon } = this.state

    caughtPokemon.push({
      url: url,
      index: i
    })

    this.setState({
      caughtPokemon
    })
  }

  nextPokemon = () => {
    const { pokemonIndex } = this.state
    this.setState({
      pokemonIndex: Number(pokemonIndex) + 1
    })
  }

  previousPokemon = () => {
    const { pokemonIndex } = this.state
    this.setState({
      pokemonIndex: Number(pokemonIndex) - 1
    })
  }

  searchPokemon = (e, pokemon) => {
    if (!pokemon) {
      alert('What do you want to catch?')
      return
    } this.setState({
      pokemon: pokemon
    })
  }

  urlUpdateState = (id) =>{
    this.setState({
      pokemonIndex: id
    })
  }

  render() {
    const { pokemonList, caughtPokemon } = this.state
    if(pokemonList.length < 1){
      return (
        <img id='loading' src='/img/ah.gif' alt='loading'/>
      )
    }

    return (
      <div className="center">
        <div>
          <ul id="nav-mobile">
            <Link id='homeLink' className="black-text" to="/">
              PoKéMoN
              </Link>
            <CaughtPokemon caughtPokemon={caughtPokemon}/>
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <PokemonList
                    pokemonList={pokemonList}
                    sendId={this.sendId}
                    addPokemon={this.addPokemon}
                  />
                )}
              />
              <Route
                path="/:pokeid" 
                render={(props) => 
                  <PokemonDetails
                  {...props}
                    pokemonList={pokemonList}
                    id={this.state.pokemonIndex}
                    addPokemon={this.addPokemon}
                    nextPokemon={this.nextPokemon}
                    previousPokemon={this.previousPokemon}
                    urlUpdateState={this.urlUpdateState}
                  />
                }
              />
            </Switch>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
