package com.nckh.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.nckh.backend.model.User;
import com.nckh.backend.repository.UserRepository;
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
			String[] targetUsers = {"admin", "GV01", "SV01"};
			for (String usr : targetUsers) {
				Optional<User> opt = userRepository.findByUsername(usr);
				if (opt.isPresent()) {
					User u = opt.get();
					u.setPasswordHash(passwordEncoder.encode("123456"));
					userRepository.save(u);
					System.out.println("====== " + usr + " password reset to 123456 ======");
				}
			}
		};
	}

}
