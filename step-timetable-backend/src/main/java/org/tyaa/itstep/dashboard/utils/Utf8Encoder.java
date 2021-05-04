package org.tyaa.itstep.dashboard.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class Utf8Encoder {
    public static String encode (String string) {
        try {
            return URLEncoder.encode(string, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return string;
        }
    }
}
