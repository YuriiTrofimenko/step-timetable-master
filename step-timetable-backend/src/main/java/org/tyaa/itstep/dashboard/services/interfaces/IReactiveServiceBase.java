package org.tyaa.itstep.dashboard.services.interfaces;

import org.tyaa.itstep.dashboard.models.ResponseModel;
import reactor.core.publisher.Flux;

import java.util.List;

public interface IReactiveServiceBase<T, ID> {
    void create (T model);
    void request ();
    // ResponseModel getAll ();
    // Flux<T> getAllReactive ();
    // ResponseModel get (ID id);
    void update (T model);
    void delete (ID id);
    void notifyChanges ();
}
