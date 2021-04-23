package org.tyaa.itstep.dashboard;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.tyaa.itstep.dashboard.models.*;
import org.tyaa.itstep.dashboard.repositories.*;
import org.tyaa.itstep.dashboard.services.TimeIntervalReactiveService;
import org.tyaa.itstep.dashboard.utils.CopyMaker;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@SpringBootApplication
@EnableScheduling
// @PropertySource(value = "classpath:/application.yml", encoding="UTF-8")
public class DashboardApplication {

	public static Boolean initialized = false;

	private Integer pairCounter = 0;

	@Value("${custom.initdata.audiences}")
	private List<String> audienceNumbers;

	@Value("${custom.initdata.groups}")
	private List<String> groupNames;

	@Value("${custom.initdata.lecturers}")
	private List<String> lecturerNames;

    @Value("${custom.initdata.timeintervals}")
    private List<String> timeIntervals;

	@Value("${custom.initdata.clear}")
	private Boolean isDropNecessary;

	private PasswordEncoder passwordEncoder;
	private AudienceRepository audienceRepository;
	private GroupRepository groupRepository;
	private LecturerRepository lecturerRepository;
	private LessonRepository lessonRepository;
	private TimeIntervalRepository timeIntervalRepository;
	private TimeIntervalTemplateRepository timeIntervalTemplateRepository;
	private RoleRepository roleRepository;
	private UserRepository userRepository;
	private TimeIntervalReactiveService timeIntervalReactiveService;

	public static void main (String[] args) {
		System.out.println("MyTag");
		System.getenv().entrySet().forEach(System.out::println);
		SpringApplication.run(DashboardApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData (
		PasswordEncoder passwordEncoder,
		AudienceRepository audienceRepository,
		GroupRepository groupRepository,
		LecturerRepository lecturerRepository,
		LessonRepository lessonRepository,
		TimeIntervalRepository timeIntervalRepository,
		TimeIntervalTemplateRepository timeIntervalTemplateRepository,
		RoleRepository roleRepository,
		UserRepository userRepository,
		TimeIntervalReactiveService timeIntervalReactiveService
	) {
		this.passwordEncoder = passwordEncoder;
		this.audienceRepository = audienceRepository;
		this.groupRepository = groupRepository;
		this.lecturerRepository = lecturerRepository;
		this.lessonRepository = lessonRepository;
		this.timeIntervalRepository = timeIntervalRepository;
		this.timeIntervalTemplateRepository = timeIntervalTemplateRepository;
		this.roleRepository = roleRepository;
		this.userRepository = userRepository;
		this.timeIntervalReactiveService = timeIntervalReactiveService;
		return args -> {
			if (isDropNecessary) {
				audienceRepository.deleteAll().subscribe();
				groupRepository.deleteAll().subscribe();
				lecturerRepository.deleteAll().subscribe();
				lessonRepository.deleteAll().subscribe();
				timeIntervalRepository.deleteAll().subscribe();
				timeIntervalTemplateRepository.deleteAll().subscribe();
				userRepository.deleteAll();
				roleRepository.deleteAll();
			}
			this.createRolesAndUsers();
		};
	}

	private void createRolesAndUsers () {
		RoleModel roleModel = roleRepository.save(
			RoleModel.builder().name("ROLE_ADMIN").build()
		);
		userRepository.save(
			new UserModel(
				"admin",
				passwordEncoder.encode("1"),
				roleModel.getId(),
				true
			)
		);
		this.createAudiences();
	}

	private void createAudiences () {
		audienceRepository.saveAll(
			audienceNumbers.stream()
				.map(s -> {
					try {
						return AudienceModel.builder().audienceNumber(URLEncoder.encode(s, StandardCharsets.UTF_8.toString())).build();
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
						return AudienceModel.builder().audienceNumber(s).build();
					}
				})
				.collect(Collectors.toList())
		).subscribe(
			audienceModel -> {},
			throwable -> {},
			this::createGroups
		);
	}

	private void createGroups () {
		groupRepository.saveAll(
			groupNames.stream()
				.map(g -> {
					try {
						return GroupModel.builder().name(URLEncoder.encode(g, StandardCharsets.UTF_8.toString())).build();
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
						return GroupModel.builder().name(g).build();
					}
				})
				.collect(Collectors.toList())
		).subscribe(
			groupModel -> {},
			throwable -> {},
			this::createLecturers
		);
	}

	private void createLecturers () {
		lecturerRepository.saveAll(
			lecturerNames.stream()
				.map(l -> {
					try {
						return LecturerModel.builder().name(URLEncoder.encode(l, StandardCharsets.UTF_8.toString())).build();
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
						return LecturerModel.builder().name(l).build();
					}
				})
				.collect(Collectors.toList())
		).subscribe(
			lecturerModel -> {},
			throwable -> {},
			this::createIntervals
		);
	}

	private void createIntervals () {
		List<TimeIntervalModel> timeIntervalModelsDefault =
			timeIntervals.stream()
				.map(ti -> {
					final String[] intervalBounds = ti.split("-");
					final String intervalStart = intervalBounds[0];
					final String intervalEnd = intervalBounds[1];
					return TimeIntervalModel.builder()
						.pairNumber(++pairCounter)
						.intervalStart(intervalStart)
						.intervalEnd(intervalEnd)
						.lessons(new ArrayList<>())
						.build();
				})
				.collect(Collectors.toList());
		pairCounter = 0;
		timeIntervalRepository.saveAll(timeIntervalModelsDefault)
			.subscribe(timeIntervalModel -> {}, throwable -> {}, () -> {
				final List<TimeIntervalTemplateModel> timeIntervalTemplates = new ArrayList<>();
				for (int i = 1; i <= 7; i++) {
					timeIntervalTemplates.add(
						TimeIntervalTemplateModel.builder()
							.dayOfWeekNumber(i)
							.timeIntervalModels(CopyMaker.deepCopy(timeIntervalModelsDefault))
							.build()
					);
				}
				timeIntervalTemplateRepository.saveAll(timeIntervalTemplates)
					.subscribe(
						timeIntervalTemplateModel -> {},
						throwable -> {},
						() -> initialized = true
					);
			});
	}
}
