package model;

public class User {
    private int user_id;
    private String username;
    private String password;
    private String email;
    private String profile_picture;
    private int progress;

    public User(int user_id, String username, String password, String email, String profile_picture, int progress) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.profile_picture = profile_picture;
        this.progress = progress;
    }

    public int getUser_id() {
        return user_id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public String getProfile_picture() {
        return profile_picture;
    }

    public int getProgress() {
        return progress;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setProfile_picture(String profile_picture) {
        this.profile_picture = profile_picture;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }
}

