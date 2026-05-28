package com.example.LearnDevOps.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reports")
public class ReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private UserEntity reporter;

    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    private UserEntity reportedUser;

    private String reason;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt;
}