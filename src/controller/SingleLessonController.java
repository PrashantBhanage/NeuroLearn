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
                + "\"lesson_title\":\"" + lesson.getLesson_title() + "\","
                + "\"lesson_text\":\"" + lesson.getLesson_text() + "\""
                + "}";

            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, json.length());

            OutputStream os = exchange.getResponseBody();
            os.write(json.getBytes());
            os.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
