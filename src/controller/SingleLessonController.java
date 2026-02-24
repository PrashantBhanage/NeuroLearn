package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.LessonDAO;
import model.Lesson;

import java.io.OutputStream;

public class SingleLessonController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) {
        try {
            String query = exchange.getRequestURI().getQuery();
            int lessonId = Integer.parseInt(query.split("=")[1]);

            Lesson lesson = LessonDAO.getLessonById(lessonId);

            String json = "{"
                + "\"lesson_id\":" + lesson.getLesson_id() + ","
                + "\"lesson_title\":\"" + escape(lesson.getLesson_title()) + "\","
                + "\"lesson_text\":\"" + escape(lesson.getLesson_text()) + "\","
                + "\"video_url\":\"" + escape(lesson.getVideo_url()) + "\","
                + "\"notes\":\"" + escape(lesson.getNotes()) + "\""
                + "}";

            byte[] jsonBytes = json.getBytes("UTF-8");
            
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, jsonBytes.length);

            OutputStream os = exchange.getResponseBody();
            os.write(jsonBytes);
            os.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
