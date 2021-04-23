package org.tyaa.itstep.dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.tyaa.itstep.dashboard.models.TimeIntervalModel;
import org.tyaa.itstep.dashboard.repositories.TimeIntervalTemplateRepository;
import org.tyaa.itstep.dashboard.services.TimeIntervalReactiveService;

import java.util.Date;
import java.util.List;

@Component
// @EnableAsync
public class Scheduler {

    @Autowired
    private TimeIntervalReactiveService timeIntervalReactiveService;

    // @Async
    @Scheduled(fixedRate = 1000)
    public void scheduleFixedRateTask() {
        /* System.out.println(
            "Fixed rate task - " + System.currentTimeMillis() / 1000
        ); */
        if (DashboardApplication.initialized) {
            timeIntervalReactiveService.reviseTimeIntervals();
        }
    }
}
