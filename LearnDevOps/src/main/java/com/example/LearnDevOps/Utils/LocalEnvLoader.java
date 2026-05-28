package com.example.LearnDevOps.Utils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public final class LocalEnvLoader {

    private LocalEnvLoader() {
    }

    public static void load() {
        for (Path candidate : candidatePaths()) {
            if (Files.exists(candidate) && Files.isRegularFile(candidate)) {
                loadFile(candidate);
                return;
            }
        }
    }

    private static List<Path> candidatePaths() {
        return List.of(
                Path.of(".env"),
                Path.of("LearnDevOps", ".env"),
                Path.of("..", "LearnDevOps", ".env")
        );
    }

    private static void loadFile(Path path) {
        try {
            for (String line : Files.readAllLines(path, StandardCharsets.UTF_8)) {
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
                    continue;
                }

                int separatorIndex = trimmed.indexOf('=');
                String key = trimmed.substring(0, separatorIndex).trim();
                String value = trimmed.substring(separatorIndex + 1).trim();

                if (value.length() >= 2 && value.startsWith("\"") && value.endsWith("\"")) {
                    value = value.substring(1, value.length() - 1);
                }

                if (!key.isEmpty()) {
                    System.setProperty(key, value);
                }
            }
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to load local environment file: " + path, ex);
        }
    }
}