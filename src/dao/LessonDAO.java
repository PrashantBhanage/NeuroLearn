package dao;

import model.Lesson;
import util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LessonDAO {

    // ✅ ALREADY EXISTS (list lessons by subject)
    public static List<Lesson> getLessonsBySubject(int subjectId) throws Exception {

        List<Lesson> list = new ArrayList<>();

        Connection con = DBConnection.getConnection();
        PreparedStatement ps =
            con.prepareStatement("SELECT * FROM lessons WHERE subject_id = ?");
        ps.setInt(1, subjectId);

        ResultSet rs = ps.executeQuery();

        while (rs.next()) {
            list.add(new Lesson(
                rs.getInt("lesson_id"),
                rs.getInt("subject_id"),
                rs.getString("lesson_title"),
                rs.getString("lesson_text"),
                rs.getString("lesson_image")
            ));
        }

        return list;
    }

    // ✅ ADD THIS METHOD BELOW (single lesson by ID)
    public static Lesson getLessonById(int lessonId) throws Exception {

        Connection con = DBConnection.getConnection();
        PreparedStatement ps =
            con.prepareStatement("SELECT * FROM lessons WHERE lesson_id = ?");
        ps.setInt(1, lessonId);

        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            return new Lesson(
                rs.getInt("lesson_id"),
                rs.getInt("subject_id"),
                rs.getString("lesson_title"),
                rs.getString("lesson_text"),
                rs.getString("lesson_image")
            );
        }

        return null;
    }
}
