import com.sun.net.httpserver.HttpServer;
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



        server.setExecutor(null);
        server.start();

        System.out.println("Server running on http://localhost:8015");
    }
}
