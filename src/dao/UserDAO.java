package dao;

import java.sql.*;
import model.User;
import util.DBConnection;

public class UserDAO {

    // Get user by username and password (login)
    public static User getUserByCredentials(String username, String password) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "SELECT * FROM users WHERE username = ? AND password = ?"
        );
        ps.setString(1, username);
        ps.setString(2, password);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            return new User(
                rs.getInt("user_id"),
                rs.getString("username"),
                rs.getString("password"),
                rs.getString("email"),
                rs.getString("profile_picture"),
                rs.getInt("progress")
            );
        }
        return null;
    }

    // Get user by ID
    public static User getUserById(int userId) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "SELECT * FROM users WHERE user_id = ?"
        );
        ps.setInt(1, userId);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            return new User(
                rs.getInt("user_id"),
                rs.getString("username"),
                rs.getString("password"),
                rs.getString("email"),
                rs.getString("profile_picture"),
                rs.getInt("progress")
            );
        }
        return null;
    }

    // Register a new user
    public static int registerUser(String username, String password, String email) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
            Statement.RETURN_GENERATED_KEYS
        );
        ps.setString(1, username);
        ps.setString(2, password);
        ps.setString(3, email);
        
        int affectedRows = ps.executeUpdate();
        if (affectedRows > 0) {
            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return -1;
    }

    // Update user profile picture
    public static boolean updateProfilePicture(int userId, String profilePicture) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "UPDATE users SET profile_picture = ? WHERE user_id = ?"
        );
        ps.setString(1, profilePicture);
        ps.setInt(2, userId);
        
        return ps.executeUpdate() > 0;
    }

    // Update user progress
    public static boolean updateProgress(int userId, int progress) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "UPDATE users SET progress = ? WHERE user_id = ?"
        );
        ps.setInt(1, progress);
        ps.setInt(2, userId);
        
        return ps.executeUpdate() > 0;
    }

    // Update username
    public static boolean updateUsername(int userId, String username) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "UPDATE users SET username = ? WHERE user_id = ?"
        );
        ps.setString(1, username);
        ps.setInt(2, userId);
        
        return ps.executeUpdate() > 0;
    }

    // Check if username exists
    public static boolean usernameExists(String username) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "SELECT COUNT(*) FROM users WHERE username = ?"
        );
        ps.setString(1, username);
        ResultSet rs = ps.executeQuery();
        
        if (rs.next()) {
            return rs.getInt(1) > 0;
        }
        return false;
    }

    // Check if email exists
    public static boolean emailExists(String email) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "SELECT COUNT(*) FROM users WHERE email = ?"
        );
        ps.setString(1, email);
        ResultSet rs = ps.executeQuery();
        
        if (rs.next()) {
            return rs.getInt(1) > 0;
        }
        return false;
    }

    // Get user by email and password (login with email)
    public static User getUserByEmail(String email, String password) throws Exception {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement(
            "SELECT * FROM users WHERE email = ? AND password = ?"
        );
        ps.setString(1, email);
        ps.setString(2, password);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            return new User(
                rs.getInt("user_id"),
                rs.getString("username"),
                rs.getString("password"),
                rs.getString("email"),
                rs.getString("profile_picture"),
                rs.getInt("progress")
            );
        }
        return null;
    }
}
