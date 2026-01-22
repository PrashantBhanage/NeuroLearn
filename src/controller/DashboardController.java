package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.SubjectDAO;
import model.Subject;

import java.io.OutputStream;
import java.util.List;

public class DashboardController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) {
        try {
            List<Subject> subjects = SubjectDAO.getAllSubjects();

            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < subjects.size(); i++) {
                Subject s = subjects.get(i);
                json.append("{")
                    .append("\"subject_id\":").append(s.getSubject_id()).append(",")
                    .append("\"subject_name\":\"").append(s.getSubject_name()).append("\",")
                    .append("\"subject_icon\":\"").append(s.getSubject_icon()).append("\"")
                    .append("}");
                if (i < subjects.size() - 1) json.append(",");
            }
            json.append("]");

            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, json.length());

            OutputStream os = exchange.getResponseBody();
            os.write(json.toString().getBytes());
            os.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
