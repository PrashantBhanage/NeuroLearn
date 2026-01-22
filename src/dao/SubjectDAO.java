package dao;

import model.Subject;
import util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

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
}
