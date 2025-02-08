package com.isp392.ecommerce;

import com.isp392.ecommerce.entity.Category;
import com.isp392.ecommerce.entity.Size;
import com.isp392.ecommerce.entity.User;
import com.isp392.ecommerce.enums.Role;
import com.isp392.ecommerce.repository.CategoryRepository;
import com.isp392.ecommerce.repository.SizeRepository;
import com.isp392.ecommerce.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class EldenRingApplication implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(EldenRingApplication.class);
	private final SizeRepository sizeRepository;
	private final UserRepository userRepository;
	private final CategoryRepository categoryRepository;

	public EldenRingApplication(SizeRepository sizeRepository,
								UserRepository userRepository,
								CategoryRepository categoryRepository) {
		this.sizeRepository = sizeRepository;
		this.userRepository = userRepository;
		this.categoryRepository = categoryRepository;
	}

	public static void main(String[] args) {
		SpringApplication.run(EldenRingApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if (!sizeRepository.existsById(1)) {
			sizeRepository.save(Size.builder()
					.sizeId(1)
					.name("S")
					.build());
		}
		if (!sizeRepository.existsById(2)) {
			sizeRepository.save(Size.builder()
					.sizeId(2)
					.name("M")
					.build());
		}
		if (!sizeRepository.existsById(3)) {
			sizeRepository.save(Size.builder()
					.sizeId(3)
					.name("L")
					.build());
		}
		if (userRepository.findByEmail("admin1@gmail.com").isEmpty()){
			PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
			User user = User.builder()
					.email("admin1@gmail.com")
					.fullName("Admin01")
					.role(Role.ADMIN.toString())
					.password(passwordEncoder.encode("123456789"))
					.build();

			userRepository.save(user);
			log.warn("admin user has been create with default password: 123456789, please change it!");
		}

		if (!categoryRepository.existsById(1)) {
			categoryRepository.save(Category.builder()
					.cateId(1)
					.cateName("Bag")
					.build());
		}
		if (!categoryRepository.existsById(2)) {
			categoryRepository.save(Category.builder()
					.cateId(2)
					.cateName("Ring")
					.build());
		}
		if (!categoryRepository.existsById(3)) {
			categoryRepository.save(Category.builder()
					.cateId(3)
					.cateName("Watch")
					.build());
		}
		if (!categoryRepository.existsById(4)) {
			categoryRepository.save(Category.builder()
					.cateId(4)
					.cateName("Necklace")
					.build());
		}
	}

}
