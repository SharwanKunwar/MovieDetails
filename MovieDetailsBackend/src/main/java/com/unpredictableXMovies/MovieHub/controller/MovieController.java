package com.unpredictableXMovies.MovieHub.controller;

import com.unpredictableXMovies.MovieHub.dtos.MovieRequestDTO;
import com.unpredictableXMovies.MovieHub.dtos.MovieResponseDTO;
import com.unpredictableXMovies.MovieHub.entity.Movie;
import com.unpredictableXMovies.MovieHub.service.MovieServiceHandler;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Book;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/movies")
public class MovieController
{
    private final MovieServiceHandler service;

    // Create movie
    @PostMapping("/create")
    public ResponseEntity<MovieResponseDTO> create(@Valid @RequestBody MovieRequestDTO requestDTO){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createMovie(requestDTO));
    }

    // Get all movies
    @GetMapping("/all")
    public ResponseEntity<List<MovieResponseDTO>> getAllMovies()
    {
        return ResponseEntity.ok(service.getAllMovies());
    }

    // Get movie by id
    @GetMapping("/{id}")
    public ResponseEntity<MovieResponseDTO> getMovieById(@PathVariable UUID id)
    {
        return ResponseEntity.ok(service.getMovieById(id));
    }

    // Update movie
    @PutMapping("/update/{id}")
    public ResponseEntity<MovieResponseDTO> updateMovie(@PathVariable UUID id, @RequestBody MovieRequestDTO requestDTO)
    {
        return ResponseEntity.ok(service.updateMovie(id, requestDTO));
    }

    // Hard Delete
    @DeleteMapping("/hard/{id}")
    public String deleteMovie(@PathVariable UUID id)
    {
        return service.deleteHardly(id);
    }

    // Soft Delete
    @PatchMapping("/soft/{id}")
    public String deleteMovieSoftly(@PathVariable UUID id)
    {
        return service.deleteSoftly(id);
    }


}
