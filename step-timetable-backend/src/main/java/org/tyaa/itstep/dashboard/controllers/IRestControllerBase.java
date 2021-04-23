package org.tyaa.itstep.dashboard.controllers;

public interface IRestControllerBase<T, ID> {
    void create (T model);
    void request ();
    void update (T model);
    void delete (ID id);
}
