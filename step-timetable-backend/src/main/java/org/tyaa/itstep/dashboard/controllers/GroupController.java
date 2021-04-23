package org.tyaa.itstep.dashboard.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.tyaa.itstep.dashboard.models.GroupModel;
import org.tyaa.itstep.dashboard.services.GroupReactiveService;

@RestController
@RequestMapping("/api/groups")
public class GroupController implements IRestControllerBase<GroupModel, String> {

    final GroupReactiveService groupService;

    public GroupController(GroupReactiveService groupService) {
        this.groupService = groupService;
    }

    @Override
    @PostMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void create(@RequestBody GroupModel group) {
        groupService.create(group);
    }

    @Override
    @GetMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void request() {
        groupService.request();
    }

    @Override
    @PutMapping("")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void update(@RequestBody GroupModel group) {
        groupService.update(group);
    }

    @Override
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(@PathVariable String id) {
        groupService.delete(id);
    }
}
