package dao;

import model.QuizQuestion;
import util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class QuizDAO {

    public static List<QuizQuestion> getQuizByLessonId(int lessonId) throws Exception {

        List<QuizQuestion> list = new ArrayList<>();

        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "SELECT * FROM quiz_questions WHERE lesson_id = ?"
        );
        ps.setInt(1, lessonId);

        ResultSet rs = ps.executeQuery();

        while (rs.next()) {
            list.add(new QuizQuestion(
                rs.getInt("question_id"),
                rs.getInt("lesson_id"),
                rs.getString("question_text"),
                rs.getString("option_a"),
                rs.getString("option_b"),
                rs.getString("option_c"),
                rs.getString("option_d"),
                rs.getString("correct_option")
            ));
        }

        return list;
    }
}
