package com.nckh.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.nckh.backend.modules.user.User;
import com.nckh.backend.modules.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Reset Admin
			userRepository.findByUsername("admin@utc.edu.vn").ifPresent(u -> {
				u.setPasswordHash(passwordEncoder.encode("Admin123"));
				userRepository.save(u);
				System.out.println("====== admin@utc.edu.vn password reset to Admin123 ======");
			});

			// Reset others
			String[] targetUsers = {"GV01", "SV01"};
			for (String usr : targetUsers) {
				userRepository.findByUsername(usr).ifPresent(u -> {
					u.setPasswordHash(passwordEncoder.encode("123456"));
					userRepository.save(u);
					System.out.println("====== " + usr + " password reset to 123456 ======");
				});
			}
		};
	}

}
