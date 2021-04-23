package org.tyaa.itstep.dashboard.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document
public class TimeIntervalModel implements Serializable {
    @Id
    private String id;
    private Integer pairNumber;
    private String intervalStart;
    private String intervalEnd;
    private List<LessonModel> lessons = new ArrayList<>();
}
