package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.LessonDAO;
import dao.SubjectDAO;
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
                    if (pair[0].equals("subject_id")) {
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

            // Get subject name
            String subjectName = SubjectDAO.getSubjectNameById(subjectId);

            // Build proper JSON response matching frontend expectations
            StringBuilder json = new StringBuilder();
            json.append("{")
                .append("\"success\":true,")
                .append("\"subject_name\":\"").append(escape(subjectName)).append("\",")
                .append("\"lessons\":[");

            for (int i = 0; i < lessons.size(); i++) {
                Lesson l = lessons.get(i);

                json.append("{")
                    .append("\"lesson_id\":").append(l.getLesson_id()).append(",")
                    .append("\"title\":\"")
                    .append(escape(l.getLesson_title())).append("\",")
                    .append("\"lesson_text\":\"")
                    .append(escape(l.getLesson_text())).append("\"")
                    .append("}");

                if (i < lessons.size() - 1) json.append(",");
            }
            json.append("]}");

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
