package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.Subject;
import util.DBConnection;

public class SubjectDAO {

    public static List<Subject> getAllSubjects() throws Exception {
        List<Subject> list = new ArrayList<>();

        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement("SELECT * FROM subjects");
        ResultSet rs = ps.executeQuery();

        while (rs.next()) {
            list.add(new Subject(
                rs.getInt("subject_id"),
                rs.getString("subject_name"),
                rs.getString("subject_icon")
            ));
        }
        return list;
    }

    public static String getSubjectNameById(int subjectId) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement("SELECT subject_name FROM subjects WHERE subject_id = ?");
        ps.setInt(1, subjectId);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            return rs.getString("subject_name");
        }
        return "Unknown Subject";
    }
}
