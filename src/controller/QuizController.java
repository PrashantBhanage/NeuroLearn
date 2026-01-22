package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.QuizDAO;
import model.QuizQuestion;

import java.io.OutputStream;
import java.util.List;

public class QuizController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) {
        try {
            String query = exchange.getRequestURI().getQuery();
            int lessonId = Integer.parseInt(query.split("=")[1]);

            List<QuizQuestion> questions =
                QuizDAO.getQuizByLessonId(lessonId);

            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < questions.size(); i++) {
                QuizQuestion q = questions.get(i);

                json.append("{")
                    .append("\"id\":").append(q.getQuestionId()).append(",")
                    .append("\"question\":\"").append(q.getQuestionText()).append("\",")
                    .append("\"a\":\"").append(q.getOptionA()).append("\",")
                    .append("\"b\":\"").append(q.getOptionB()).append("\",")
                    .append("\"c\":\"").append(q.getOptionC()).append("\",")
                    .append("\"d\":\"").append(q.getOptionD()).append("\",")
                    .append("\"correct\":\"").append(q.getCorrectOption()).append("\"")
                    .append("}");

                if (i < questions.size() - 1) json.append(",");
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
