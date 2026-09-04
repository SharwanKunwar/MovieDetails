package com.unpredictableXMovies.MovieHub.service;

import com.unpredictableXMovies.MovieHub.dtos.MovieRequestDTO;
import com.unpredictableXMovies.MovieHub.dtos.MovieResponseDTO;
import com.unpredictableXMovies.MovieHub.entity.Movie;

import java.util.List;
import java.util.UUID;

public interface MovieServiceHandler
{
    //create
    MovieResponseDTO createMovie(MovieRequestDTO request);

    //Get all movies
    List<MovieResponseDTO> getAllMovies();

    //Get movie by id
    MovieResponseDTO getMovieById(UUID id);

    //Update movie
    MovieResponseDTO updateMovie(UUID id, MovieRequestDTO movie);

    //Delete movie [type = Hard]
    String deleteHardly(UUID id);

    //Delete movie [type = Soft]
    String deleteSoftly(UUID id);

}
