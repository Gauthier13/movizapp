import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Row } from 'reactstrap';
import { Col, Navbar, Collapse, NavItem, NavLink, Nav, Popover, PopoverBody, PopoverHeader, ListGroup, DropdownToggle, Button, ListGroupItem } from 'reactstrap';
import Movie from './components/Movie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

function App() {

  const [moviesCount, setMoviesCount] = useState(0); // initialisation compteur de film 
  const [moviesWishList, setMoviesWishList] = useState([]) // notre wishlist
  const [moviesFromBackend, setMoviesFromBackend] = useState([]); // cet array contiendra tous les films de la bdd 

  // Charger les films de la base de donnée 
  useEffect(() => {
    async function loadMovies() {

      var rawResponse = await fetch('/new-movies'); // on appel la route /new-movies du backend
      var responseBackend = await rawResponse.json(); // on rend la response exploitable 
      setMoviesFromBackend(responseBackend.movieFromAPI); // on stock les films de la bdd dans un arr moviesFromBackend

      // récupérer les films de la wishlist, enregistrés en base de données
      var rawResponseWishlist = await fetch('/wishlist-movie');
      var responseBackendWishlist = await rawResponseWishlist.json();

      var dataWishlist = responseBackendWishlist.movieWishlistBackend.map((el) => {
        return {name : el.name, img : el.image}
      });
      setMoviesWishList(dataWishlist); // la wishlist du site est = aux films précédemment enregistrés en bdd et en wishlist 
      setMoviesCount(responseBackendWishlist.movieWishlistBackend.length);
    }
    loadMovies();
  }, []);


  // Détecte le click sur la bouton like pour ajouter un film à la wishlist ensuite
  var handleClickAddMovie = async (movieNameFromClick, imgFromClick) => {
    setMoviesWishList([...moviesWishList, {name : movieNameFromClick, img : imgFromClick}]) // ajouter un film à wishlist 
    setMoviesCount(moviesCount + 1)

    await fetch('/wishlist-movie', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `name=${movieNameFromClick}&image=${imgFromClick}`
    });
  }


  // Supprimer un film de la wishlist lorsqu'on retire le like
  var handleClickDeleteMovie = async (nameFromChild) => {
    setMoviesWishList(moviesWishList.filter((el) => el.name !== nameFromChild));
    setMoviesCount(moviesCount - 1)

    await fetch('/wishlist-movie/'+nameFromChild, {
      method: 'DELETE',
    })
  }


  // on récupère tous les films de la bdd fictive et locale
  var movieList = moviesFromBackend.map((el, i) => {
    var alreadySeen = moviesWishList.find((e) => e.name === el.original_title)
    var notSee = false;

    if(alreadySeen === undefined ){
      notSee = true
    }

    // on coupe le résumé du film à 80 char
    if(el.overview.length > 80){
      el.overview = el.overview.slice(0,80)+'...'
    }

    return (<Movie key={i} movieName={el.original_title} movieImg={"https://image.tmdb.org/t/p/w500/"+el.backdrop_path} movieDesc={el.overview} globalRating={el.vote_average} globalCountRating={el.vote_average} handleClickAddMovieParent={handleClickAddMovie} handleClickDeleteMovieParent={handleClickDeleteMovie} isNotWatchedYet={notSee}/>)
  });


  // nécessaire au fonctionnement du dropdown de la navbar
  const [popoverOpen, setPopoverOpen] = useState(false);
  const toggle = () => setPopoverOpen(!popoverOpen);


  // Ajouter des films au dropdown de la wishlist
  var listItem = moviesWishList.map((film , i) => {
    return (
      <Card>
        <img src={film.img} alt="film splashscreen"></img>
        <ListGroupItem style={{cursor: 'pointer'}} onClick={() => {handleClickDeleteMovie(film.name)}}  key={i}> 
        <FontAwesomeIcon icon={faHeart} style={{color : '#E04C4C'}}/> {' '}
        {film.name}
        </ListGroupItem>
      </Card>
    )
  });

  return (
    <div className='body'>
      <Container>
        <Row>
          <Col>
            <div className='navbar'>
              <Navbar
                color="404040"
                dark
                expand="md" >
                <Collapse navbar >
                  <Nav className='nav' navbar pills >
                    <NavItem>
                      <FontAwesomeIcon className='film fa-3x' icon={faFilm} />
                    </NavItem>
                    <NavItem>
                      <NavLink href="/components/">
                        Last film released
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <DropdownToggle  caret nav>
                        <Button type="button" id="Popover1">{moviesCount} Wishlist</Button>
                      </DropdownToggle>
                      <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                        <PopoverHeader>Wishlist</PopoverHeader>
                        <PopoverBody>
                          <ListGroup>
                              {listItem}
                          </ListGroup>
                        </PopoverBody>
                      </Popover>
                    </NavItem>
                  </Nav>
                </Collapse>
              </Navbar>
            </div>
          </Col>
        </Row>

        <Row>
          {movieList}
        </Row>

      </Container>
    </div>
  );
}

export default App;
