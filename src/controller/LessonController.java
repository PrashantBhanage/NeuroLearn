package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.LessonDAO;
import model.Lesson;

import java.io.OutputStream;
import java.util.List;

public class LessonController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) {
        try {
            String query = exchange.getRequestURI().getQuery();
            int subjectId = -1;

            // SAFE query parsing
            if (query != null) {
                for (String param : query.split("&")) {
                    String[] pair = param.split("=");
                    if (pair[0].equals("subjectId")) {
                        subjectId = Integer.parseInt(pair[1]);
                    }
                }
            }

            if (subjectId == -1) {
                exchange.sendResponseHeaders(400, -1);
                return;
            }

            List<Lesson> lessons =
                    LessonDAO.getLessonsBySubject(subjectId);

            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < lessons.size(); i++) {
                Lesson l = lessons.get(i);

                json.append("{")
                    .append("\"lesson_id\":").append(l.getLesson_id()).append(",")
                    .append("\"lesson_title\":\"")
                    .append(escape(l.getLesson_title())).append("\",")
                    .append("\"lesson_text\":\"")
                    .append(escape(l.getLesson_text())).append("\"")
                    .append("}");

                if (i < lessons.size() - 1) json.append(",");
            }
            json.append("]");

            exchange.getResponseHeaders()
                    .set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, json.length());

            OutputStream os = exchange.getResponseBody();
            os.write(json.toString().getBytes());
            os.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Simple JSON escape (IMPORTANT)
    private String escape(String s) {
        return s.replace("\"", "\\\"");
    }
}
