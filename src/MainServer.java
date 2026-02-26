import com.sun.net.httpserver.HttpServer;
import controller.AuthController;
import controller.DashboardController;
import controller.LessonController;
import controller.QuizController;
import controller.SingleLessonController;
import java.net.InetSocketAddress;
import util.StaticFileHandler;


public class MainServer {

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(new InetSocketAddress(8015), 0);

        server.createContext("/", new StaticFileHandler("web"));
        server.createContext("/api/subjects", new DashboardController());
        server.createContext("/api/lessons", new LessonController());
        server.createContext("/api/lesson", new SingleLessonController());
        server.createContext("/api/quiz", new QuizController());
        // Auth routes
        server.createContext("/api/login", new AuthController());
        server.createContext("/api/register", new AuthController());
        server.createContext("/api/profile", new AuthController());
        server.createContext("/api/update-profile", new AuthController());
        server.createContext("/api/update-progress", new AuthController());




        server.setExecutor(null);
        server.start();

        System.out.println("Server running on http://localhost:8015");
    }
}
