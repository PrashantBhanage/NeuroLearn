package controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import dao.UserDAO;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import model.User;

public class AuthController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        // Set CORS headers
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        if (method.equals("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        try {
            if (path.endsWith("/api/login")) {
                handleLogin(exchange);
            } else if (path.endsWith("/api/register")) {
                handleRegister(exchange);
            } else if (path.endsWith("/api/profile")) {
                handleProfile(exchange);
            } else if (path.endsWith("/api/update-profile")) {
                handleUpdateProfile(exchange);
            } else if (path.endsWith("/api/update-progress")) {
                handleUpdateProgress(exchange);
            } else {
                sendResponse(exchange, 404, "{\"error\":\"Not found\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    private void handleLogin(HttpExchange exchange) throws Exception {
        if (!exchange.getRequestMethod().equals("POST")) {
            sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        String body = new String(exchange.getRequestBody().readAllBytes());
        Map<String, String> params = parseFormData(body);

        String username = params.get("username");
        String email = params.get("email");
        String password = params.get("password");

        if ((username == null && email == null) || password == null) {
            sendResponse(exchange, 400, "{\"error\":\"Missing username or password\"}");
            return;
        }

        User user = null;
        
        // Try to find user by username or email
        if (username != null && !username.isEmpty()) {
            user = UserDAO.getUserByCredentials(username, password);
        } else if (email != null && !email.isEmpty()) {
            // Try to get user by email
            user = UserDAO.getUserByEmail(email, password);
        }

        if (user != null) {
            String json = String.format(
                "{\"success\":true,\"user\":{\"user_id\":%d,\"username\":\"%s\",\"email\":\"%s\",\"profile_picture\":\"%s\",\"progress\":%d}}",
                user.getUser_id(), user.getUsername(), user.getEmail(), user.getProfile_picture(), user.getProgress()
            );
            sendResponse(exchange, 200, json);
        } else {
            sendResponse(exchange, 401, "{\"success\":false,\"error\":\"Invalid credentials\"}");
        }
    }

    private void handleRegister(HttpExchange exchange) throws Exception {
        if (!exchange.getRequestMethod().equals("POST")) {
            sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        String body = new String(exchange.getRequestBody().readAllBytes());
        Map<String, String> params = parseFormData(body);

        String username = params.get("username");
        String password = params.get("password");
        String email = params.get("email");

        if (username == null || password == null || email == null) {
            sendResponse(exchange, 400, "{\"error\":\"Missing required fields\"}");
            return;
        }

        // Check if username or email already exists
        if (UserDAO.usernameExists(username)) {
            sendResponse(exchange, 400, "{\"success\":false,\"error\":\"Username already exists\"}");
            return;
        }

        if (UserDAO.emailExists(email)) {
            sendResponse(exchange, 400, "{\"success\":false,\"error\":\"Email already exists\"}");
            return;
        }

        int userId = UserDAO.registerUser(username, password, email);

        if (userId > 0) {
            String json = String.format(
                "{\"success\":true,\"user\":{\"user_id\":%d,\"username\":\"%s\",\"email\":\"%s\",\"profile_picture\":\"default.png\",\"progress\":0}}",
                userId, username, email
            );
            sendResponse(exchange, 200, json);
        } else {
            sendResponse(exchange, 500, "{\"success\":false,\"error\":\"Registration failed\"}");
        }
    }

    private void handleProfile(HttpExchange exchange) throws Exception {
        if (!exchange.getRequestMethod().equals("GET")) {
            sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        String query = exchange.getRequestURI().getQuery();
        Map<String, String> params = parseQuery(query);

        String userIdStr = params.get("user_id");
        if (userIdStr == null) {
            sendResponse(exchange, 400, "{\"error\":\"Missing user_id\"}");
            return;
        }

        int userId = Integer.parseInt(userIdStr);
        User user = UserDAO.getUserById(userId);

        if (user != null) {
            String json = String.format(
                "{\"success\":true,\"user\":{\"user_id\":%d,\"username\":\"%s\",\"email\":\"%s\",\"profile_picture\":\"%s\",\"progress\":%d}}",
                user.getUser_id(), user.getUsername(), user.getEmail(), user.getProfile_picture(), user.getProgress()
            );
            sendResponse(exchange, 200, json);
        } else {
            sendResponse(exchange, 404, "{\"success\":false,\"error\":\"User not found\"}");
        }
    }

    private void handleUpdateProfile(HttpExchange exchange) throws Exception {
        if (!exchange.getRequestMethod().equals("POST")) {
            sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        String body = new String(exchange.getRequestBody().readAllBytes());
        Map<String, String> params = parseFormData(body);

        String userIdStr = params.get("user_id");
        String username = params.get("username");
        String profilePicture = params.get("profile_picture");
        String imageData = params.get("image_data");

        if (userIdStr == null) {
            sendResponse(exchange, 400, "{\"error\":\"Missing user_id\"}");
            return;
        }

        int userId = Integer.parseInt(userIdStr);
        boolean success = false;
        String savedFileName = null;

        // Handle profile picture upload with image data
        if (profilePicture != null && !profilePicture.isEmpty() && imageData != null && !imageData.isEmpty()) {
            savedFileName = saveBase64Image(imageData, profilePicture);
            if (savedFileName != null) {
                success = UserDAO.updateProfilePicture(userId, savedFileName);
            }
        } else if (profilePicture != null && !profilePicture.isEmpty()) {
            // Fallback: just update filename if no image data provided
            success = UserDAO.updateProfilePicture(userId, profilePicture);
        }

        if (username != null && !username.isEmpty()) {
            success = UserDAO.updateUsername(userId, username);
        }

        if (success) {
            User user = UserDAO.getUserById(userId);
            String json = String.format(
                "{\"success\":true,\"user\":{\"user_id\":%d,\"username\":\"%s\",\"email\":\"%s\",\"profile_picture\":\"%s\",\"progress\":%d}}",
                user.getUser_id(), user.getUsername(), user.getEmail(), user.getProfile_picture(), user.getProgress()
            );
            sendResponse(exchange, 200, json);
        } else {
            sendResponse(exchange, 500, "{\"success\":false,\"error\":\"Update failed\"}");
        }
    }

    private void handleUpdateProgress(HttpExchange exchange) throws Exception {
        if (!exchange.getRequestMethod().equals("POST")) {
            sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        String body = new String(exchange.getRequestBody().readAllBytes());
        Map<String, String> params = parseFormData(body);

        String userIdStr = params.get("user_id");
        String progressStr = params.get("progress");

        if (userIdStr == null || progressStr == null) {
            sendResponse(exchange, 400, "{\"error\":\"Missing user_id or progress\"}");
            return;
        }

        int userId = Integer.parseInt(userIdStr);
        int progress = Integer.parseInt(progressStr);

        boolean success = UserDAO.updateProgress(userId, progress);

        if (success) {
            sendResponse(exchange, 200, "{\"success\":true}");
        } else {
            sendResponse(exchange, 500, "{\"success\":false,\"error\":\"Update failed\"}");
        }
    }

    // Save Base64 image to disk and return the saved filename
    private String saveBase64Image(String base64Data, String originalFileName) {
        try {
            // Extract the actual Base64 data (remove data:image/xxx;base64, prefix if present)
            String base64Image = base64Data;
            if (base64Data.contains(",")) {
                base64Image = base64Data.split(",")[1];
            }
            
            // Decode Base64 to bytes
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
            
            // Generate unique filename to avoid conflicts
            String extension = "";
            int dotIndex = originalFileName.lastIndexOf(".");
            if (dotIndex > 0) {
                extension = originalFileName.substring(dotIndex);
            }
            String uniqueFileName = "profile_" + UUID.randomUUID().toString() + extension;
            
            // Ensure images directory exists
            File imagesDir = new File("web/images");
            if (!imagesDir.exists()) {
                imagesDir.mkdirs();
            }
            
            // Save file
            File outputFile = new File(imagesDir, uniqueFileName);
            try (FileOutputStream fos = new FileOutputStream(outputFile)) {
                fos.write(imageBytes);
            }
            
            return uniqueFileName;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private Map<String, String> parseFormData(String body) {
        Map<String, String> params = new HashMap<>();
        String[] pairs = body.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=");
            if (keyValue.length == 2) {
                try {
                    params.put(keyValue[0], java.net.URLDecoder.decode(keyValue[1], "UTF-8"));
                } catch (Exception e) {
                    params.put(keyValue[0], keyValue[1]);
                }
            }
        }
        return params;
    }

    private Map<String, String> parseQuery(String query) {
        Map<String, String> params = new HashMap<>();
        if (query == null) return params;
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=");
            if (keyValue.length == 2) {
                params.put(keyValue[0], keyValue[1]);
            }
        }
        return params;
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
