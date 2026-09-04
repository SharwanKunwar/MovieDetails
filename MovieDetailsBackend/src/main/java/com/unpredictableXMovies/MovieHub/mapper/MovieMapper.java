package com.unpredictableXMovies.MovieHub.mapper;

import com.unpredictableXMovies.MovieHub.dtos.MovieRequestDTO;
import com.unpredictableXMovies.MovieHub.dtos.MovieResponseDTO;
import com.unpredictableXMovies.MovieHub.entity.Movie;

public class MovieMapper
{
    //Request DTO -> toEntity
    public static Movie toEntity(MovieRequestDTO request)
    {
        return Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .genre(request.getGenre())
                .releaseDate(request.getReleaseDate())
                .imdbRating(request.getImdbRating())
                .length(request.getLength())
                .posterUrl(request.getPosterUrl())
                .build();
    }

    // Entity -> Response DTO
    public static MovieResponseDTO toResponse(Movie movie)
    {
        return new MovieResponseDTO(
                movie.getId(),
                movie.getTitle(),
                movie.getDescription(),
                movie.getGenre(),
                movie.getReleaseDate(),
                movie.getImdbRating(),
                movie.getLength(),
                movie.getPosterUrl()
        );
    }

    // Update the existing movie entity with values from the request DTO
    public static void updateEntity(Movie movie, MovieRequestDTO request)
    {
        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setGenre(request.getGenre());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setImdbRating(request.getImdbRating());
        movie.setLength(request.getLength());
        movie.setPosterUrl(request.getPosterUrl());

    }
}
