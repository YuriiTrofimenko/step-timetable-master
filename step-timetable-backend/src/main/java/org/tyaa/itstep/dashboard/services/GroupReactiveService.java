package org.tyaa.itstep.dashboard.services;

import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.tyaa.itstep.dashboard.models.GroupModel;
import org.tyaa.itstep.dashboard.repositories.GroupRepository;
import org.tyaa.itstep.dashboard.services.interfaces.IReactiveServiceBase;

import java.util.ArrayList;
import java.util.List;

@Service
public class GroupReactiveService implements IReactiveServiceBase<GroupModel, String> {

    private final GroupRepository groupRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public GroupReactiveService(GroupRepository groupRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.groupRepository = groupRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void create(GroupModel group) {
        groupRepository.save(group).subscribe(
            groupModel -> {},
            throwable -> {},
            this::notifyChanges
        );
    }

    @Override
    public void request() {
        this.notifyChanges();
    }

    @Override
    public void update(GroupModel group) {
        this.create(group);
    }

    @Override
    public void delete(String id) {
        groupRepository.deleteById(id).subscribe(
            groupModel -> {},
            throwable -> {},
            this::notifyChanges
        );
    }

    @Override
    public void notifyChanges () {
        List<GroupModel> groupModels =
            groupRepository.findAll(Sort.by("name"))
                .collectList()
                .block();
        if (groupModels == null) {
            groupModels = new ArrayList<>();
        }
        simpMessagingTemplate.convertAndSend(
            "/topic/groups",
            groupModels
        );
    }
}
