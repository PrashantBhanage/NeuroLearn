package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.QuizDAO;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.List;
import model.QuizQuestion;

public class QuizController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) {
        try {
            String query = exchange.getRequestURI().getQuery();
            if (query == null || !query.contains("=")) {
                sendErrorResponse(exchange, 400, "Missing or invalid lessonId parameter");
                return;
            }
            
            int lessonId;
            try {
                String[] parts = query.split("=");
                if (parts.length < 2) {
                    sendErrorResponse(exchange, 400, "Invalid lessonId parameter");
                    return;
                }
                lessonId = Integer.parseInt(parts[1]);
            } catch (NumberFormatException e) {
                sendErrorResponse(exchange, 400, "lessonId must be a number");
                return;
            }

            List<QuizQuestion> questions =
                QuizDAO.getQuizByLessonId(lessonId);

            if (questions == null) {
                sendErrorResponse(exchange, 500, "Failed to retrieve questions from database");
                return;
            }

            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < questions.size(); i++) {
                QuizQuestion q = questions.get(i);
                
                if (q == null) {
                    continue; // Skip null questions
                }

                json.append("{")
                    .append("\"id\":").append(q.getQuestionId()).append(",")
                    .append("\"question\":\"").append(escape(q.getQuestionText())).append("\",")
                    .append("\"a\":\"").append(escape(q.getOptionA())).append("\",")
                    .append("\"b\":\"").append(escape(q.getOptionB())).append("\",")
                    .append("\"c\":\"").append(escape(q.getOptionC())).append("\",")
                    .append("\"d\":\"").append(escape(q.getOptionD())).append("\",")
                    .append("\"correct\":\"").append(escape(q.getCorrectOption())).append("\"")
                    .append("}");

                if (i < questions.size() - 1) json.append(",");
            }
            json.append("]");

            String jsonString = json.toString();
            byte[] jsonBytes = jsonString.getBytes("UTF-8");

            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(200, jsonBytes.length);

            OutputStream os = exchange.getResponseBody();
            os.write(jsonBytes);
            os.close();

        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            sendErrorResponse(exchange, 500, "Encoding error: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            sendErrorResponse(exchange, 500, "Server error: " + e.getMessage());
        }
    }

    private void sendErrorResponse(HttpExchange exchange, int statusCode, String message) {
        try {
            String errorJson = "{\"error\":\"" + escape(message) + "\"}";
            byte[] errorBytes = errorJson.getBytes("UTF-8");
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
            exchange.sendResponseHeaders(statusCode, errorBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(errorBytes);
            os.close();
        } catch (Exception e) {
            e.printStackTrace();
            try {
                exchange.sendResponseHeaders(500, -1);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    // Simple JSON escape (IMPORTANT)
    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
