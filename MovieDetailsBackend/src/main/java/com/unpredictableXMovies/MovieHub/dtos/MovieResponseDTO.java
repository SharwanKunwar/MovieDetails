package com.unpredictableXMovies.MovieHub.dtos;

import com.unpredictableXMovies.MovieHub.enums.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieResponseDTO
{
    private UUID id;
    private String title;
    private String description;
    private Genre genre;
    private LocalDate releaseDate;
    private Double imdbRating;
    private Integer length;
    private String posterUrl;
}
