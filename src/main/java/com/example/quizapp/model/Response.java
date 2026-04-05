package com.example.quizapp.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class Response {
    @NotNull(message = "Question id is required")
    private Integer id;

    @NotBlank(message = "Response is required")
    private String response;
}
