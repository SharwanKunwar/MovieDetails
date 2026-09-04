package com.unpredictableXMovies.MovieHub.service.implementation;

import com.unpredictableXMovies.MovieHub.dtos.MovieRequestDTO;
import com.unpredictableXMovies.MovieHub.dtos.MovieResponseDTO;
import com.unpredictableXMovies.MovieHub.entity.Movie;
import com.unpredictableXMovies.MovieHub.exceptions.ResourceNotFound;
import com.unpredictableXMovies.MovieHub.mapper.MovieMapper;
import com.unpredictableXMovies.MovieHub.repository.MovieRepository;
import com.unpredictableXMovies.MovieHub.service.MovieServiceHandler;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class MovieService implements MovieServiceHandler
{
    private final MovieRepository repository;

    @Override
    public MovieResponseDTO createMovie(MovieRequestDTO requestDTO)
    {
        Movie movie = MovieMapper.toEntity(requestDTO);
        Movie savedMovie = repository.save(movie);
        return MovieMapper.toResponse(savedMovie);
    }

    @Override
    public List<MovieResponseDTO> getAllMovies()
    {
        List<Movie> movies = repository.findByDeletedFalse();
        return movies.stream().map(MovieMapper::toResponse).toList();
    }

    @Override
    public MovieResponseDTO getMovieById(UUID id)
    {
        Optional<Movie> movie = repository.findByIdAndDeletedFalse(id);
        return movie.map(MovieMapper::toResponse).orElseThrow(()-> new ResourceNotFound("movie not found"));
    }

    @Override
    public MovieResponseDTO updateMovie(UUID id, MovieRequestDTO requestDTO)
    {
        Movie movie = repository.findByIdAndDeletedFalse(id).orElseThrow(()-> new ResourceNotFound("Movie is not found"));
        MovieMapper.updateEntity(movie,requestDTO);
        Movie updatedMovie = repository.save(movie);
        return MovieMapper.toResponse(updatedMovie);
    }

    @Override
    public String deleteHardly(UUID id)
    {
        Movie movie = repository.findByIdAndDeletedFalse(id).orElseThrow(()-> new ResourceNotFound("Movie not found"));
        repository.delete(movie);
        return "Movie is deleted successfully";
    }

    @Override
    public String deleteSoftly(UUID id)
    {
        Movie movie = repository.findByIdAndDeletedFalse(id).orElseThrow(()-> new ResourceNotFound("Movie not found."));
        movie.setDeleted(true);
        repository.save(movie);
        return "Movie deleted successfully";
    }


}
