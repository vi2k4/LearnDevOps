package com.example.LearnDevOps;

import com.example.LearnDevOps.Utils.LocalEnvLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LearnDevOpsApplication {

	public static void main(String[] args) {
		LocalEnvLoader.load();
		SpringApplication.run(LearnDevOpsApplication.class, args);
	}

}
