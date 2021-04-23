package org.tyaa.itstep.dashboard.utils;

import java.io.*;
import java.util.List;

public class CopyMaker {
    /**
     * Makes a deep copy of any Java object that is passed.
     */
    public static <T> T deepCopy (T object) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ObjectOutputStream outputStrm = new ObjectOutputStream(outputStream);
            outputStrm.writeObject(object);
            ByteArrayInputStream inputStream = new ByteArrayInputStream(outputStream.toByteArray());
            ObjectInputStream objInputStream = new ObjectInputStream(inputStream);
            return (T)objInputStream.readObject();
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
