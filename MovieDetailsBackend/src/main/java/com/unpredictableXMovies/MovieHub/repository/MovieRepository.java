package com.unpredictableXMovies.MovieHub.repository;

import com.unpredictableXMovies.MovieHub.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID>
{
    // Use when you want to get a single non-deleted movie by id
    Optional<Movie> findByIdAndDeletedFalse(UUID id);

    // Use when you want to get all non-deleted data
    List<Movie> findByDeletedFalse();

    // Use when you want to get all soft-deleted data
    List<Movie> findByDeletedTrue();
}
