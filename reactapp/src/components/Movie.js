import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { ButtonGroup } from 'reactstrap';
import { Col, Card, CardImg, CardBody, CardText, Button } from 'reactstrap';
import { faHeart, faStar, faEye } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import {faEye as farEye} from '@fortawesome/free-regular-svg-icons'
import React, { useState } from 'react';
import { Badge } from 'reactstrap';

function Movie(props) {


    const [watchMovie, setWatchMovie] = useState(false) // bool qui passe à true au clic sur l'icon eye
    const [countWatchMovie, setCountWatchMovie] = useState(0) // initialisation du compteur de vues d'un film
    const [myRatingMovie, setMyRatingMovie] = useState(0); // initialisation du compteur d'étoiles d'un film


    // mise en place du compteur de films ajoutés à la wishlist
    var handleClickAddMovieChild = (name, image) => {
        if (props.isNotWatchedYet) {
            props.handleClickAddMovieParent(name, image); // On ajoute à la list
        } else {
            props.handleClickDeleteMovieParent(name); // On supprime de la liste
        }
    }


    // On limite les notes entre 0 et 10 lorsque l'utilisateur augmente ou diminue la note d'un film
    var handleClickOnCount = (ratingLimit) => {
        if (ratingLimit < 0) {
            ratingLimit = 0
        } else if (ratingLimit > 10) {
            ratingLimit = 10
        }
        setMyRatingMovie(ratingLimit)
    }


    // affichage de la note attribué au film par l'utilisateur
    var starArr = []
    for (var i = 0; i < 10; i++) {

        var starColor = { cursor: 'pointer' }

        // on affiche en jaune les étoiles correspondants à la note attribuée (rating = 5 --> 5 étoiles jaunes)
        if (i < myRatingMovie) {
            starColor = {
                color: '#F5D062',
                cursor: 'pointer' // modif du curseur
            }
        }
        else {
            starColor = {
                color: '#B0B0B0',
                cursor: 'pointer' // modif du curseur
            }
        }
        let nbstar = i + 1
        starArr.push(<FontAwesomeIcon key={i} onClick={() => handleClickOnCount(nbstar)} icon={faStar} style={starColor} className="icon" />)
    }

    
    // Afficher les étoiles de la note moyenne d'un film
    var starGlobal = []
    for (let i = 0; i < 10; i++) {

        var starGlobalColor = {}

        // calcul de la moyenne des notes
        var averageRating = Math.round(((props.globalRating * props.globalCountRating) + myRatingMovie) / (props.globalCountRating + 1))

        if (i < averageRating) {
            starGlobalColor = {
                color: '#F5D062'
            }
        } else {
            starGlobalColor = {
                color: '#B0B0B0'
            }
        }
        starGlobal.push(<FontAwesomeIcon icon={faStar} style={starGlobalColor} className="icon" />)
    }


    // on change la couleur du picto coeur et le style du curseur si on clique dessus
    var colorLike;
    var heartIcon;
    if (!props.isNotWatchedYet) {
        heartIcon = faHeart;
        colorLike = { color: '#E04C4C', cursor: 'pointer', userSelect: 'none' }; // rouge
    } else {
        heartIcon = faHeartRegular;
        colorLike = { color: '#262626', cursor: 'pointer', userSelect: 'none' }; // gris
    }


    // on change l'icon et le style du curseur au clic sur l'icon eye
    var cursorStyle;
    var eyeIcon;
    if (watchMovie) {
        eyeIcon = faEye;
        cursorStyle = { cursor: 'pointer', userSelect: 'none', color: '#E04C4C' };
    } else {
        eyeIcon = farEye;
        cursorStyle = { cursor: 'pointer', userSelect: 'none' };
    }


    // style des card
    var cardBorder = {
        borderRadius: 10,
        boxShadow: '8px 4px 30px #101010'
    }

    // style des images dans les card
    var imgBorder = {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomRadius: 0
    }


    return (

        <Col xs="12" md="6" lg="4">
            <Card className='card' style={cardBorder}>
                <div className='overlay-image'>
                    <CardImg
                        style={imgBorder}
                        alt="Film splashscreen"
                        src={props.movieImg}
                        top
                        width="100%" />
                    <CardText className='hover-image'>
                        <h2> {props.movieName} </h2>
                    </CardText>
                </div>

                <CardBody>
                    <CardText>
                        Wishlist <FontAwesomeIcon onClick={() => {handleClickAddMovieChild(props.movieName, props.movieImg)}} icon={heartIcon} style={colorLike} className="icon" />
                    </CardText>
                    <CardText >
                        Nombre de vues {' '}<FontAwesomeIcon onClick={() => { setCountWatchMovie(countWatchMovie + 1); setWatchMovie(true) }} icon={eyeIcon} style={cursorStyle} className="icon" />{' '} {' '}
                        <Badge>
                            {countWatchMovie}
                        </Badge>
                    </CardText>
                    <CardText>
                        Mon avis {' '} {starArr} {' '}
                        <ButtonGroup>
                            <Button onClick={() => { handleClickOnCount(myRatingMovie - 1) }}>
                                -
                            </Button>
                            <Button onClick={() => { handleClickOnCount(myRatingMovie + 1) }}>
                                +
                            </Button>
                        </ButtonGroup>
                    </CardText>
                    <CardText>
                        Moyenne {' '} {starGlobal} {' '} {props.globalCountRating}
                    </CardText>
                    <CardText>
                        <h2 className='filmTitle'>
                            {props.movieName}
                        </h2>
                    </CardText>
                    <CardText>
                        {props.movieDesc}
                    </CardText>
                </CardBody>
            </Card>
        </Col>
    );
}

export default Movie;
