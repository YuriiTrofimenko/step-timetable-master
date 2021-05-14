package org.tyaa.itstep.dashboard;

import org.bson.types.ObjectId;
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
import org.tyaa.itstep.dashboard.utils.Utf8Encoder;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
		// System.getenv().entrySet().forEach(System.out::println);
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
			userRepository.deleteAll();
			roleRepository.deleteAll();
			this.createRolesAndUsers();
			if (isDropNecessary) {
				audienceRepository.deleteAll().subscribe();
				groupRepository.deleteAll().subscribe();
				lecturerRepository.deleteAll().subscribe();
				lessonRepository.deleteAll().subscribe();
				timeIntervalRepository.deleteAll().subscribe();
				timeIntervalTemplateRepository.deleteAll().subscribe();
				// userRepository.deleteAll();
				// roleRepository.deleteAll();
			}
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
		if (isDropNecessary) {
			this.createAudiences();
		} else {
			initialized = true;
		}
	}

	private void createAudiences () {
		audienceRepository.saveAll(
			audienceNumbers.stream()
				.map(s -> AudienceModel.builder().audienceNumber(Utf8Encoder.encode(s)).build())
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
				.map(g -> GroupModel.builder().name(Utf8Encoder.encode(g)).build())
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
				.map(l -> LecturerModel.builder().name(Utf8Encoder.encode(l)).build())
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
					TimeIntervalModel timeIntervalModel =
						TimeIntervalModel.builder()
							.pairNumber(++pairCounter)
							.intervalStart(intervalStart)
							.intervalEnd(intervalEnd)
							.lessons(new ArrayList<>())
							.build();
					audienceRepository.findAll().subscribe(
						audienceModel -> timeIntervalModel.getLessons().add(
							LessonModel.builder()
								.id(ObjectId.get().toString())
								.audienceNumber(audienceModel.getAudienceNumber())
								.build()
						)
					);
					return timeIntervalModel;
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
