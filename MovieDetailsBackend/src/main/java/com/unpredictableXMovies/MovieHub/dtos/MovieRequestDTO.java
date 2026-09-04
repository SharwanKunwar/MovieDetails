package com.unpredictableXMovies.MovieHub.dtos;

import com.unpredictableXMovies.MovieHub.enums.Genre;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieRequestDTO
{
    @NotBlank(message = "Title is required.")
    @Size(min = 3, max = 150, message = "Title cannot be greater then 150  characters.")
    private String title;

    @NotBlank(message = "Description is required.")
    @Size(min = 3, max = 300, message = "Description cannot be greater then 300  characters.")
    private String description;

    @NotNull(message = "Genre is required.")
    private Genre genre;

    @NotNull(message = "Release Date is required.")
    private LocalDate releaseDate;

    @NotNull(message = "IMDB rating is required.")
    @DecimalMin(value = "0.0", message = "Rating must be at least 0.0")
    @DecimalMax(value = "10.0", message = "Rating must be at most 10.0")
    private Double imdbRating;

    @NotNull(message = "Length is required.")
    @Min(value = 1, message = "Length must be at least 1 minute.")
    private Integer length;

    @NotBlank(message = "Poster Url is required.")
    private String posterUrl;
}
