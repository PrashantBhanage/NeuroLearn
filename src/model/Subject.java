package model;

public class Subject {
    private int subject_id;
    private String subject_name;
    private String subject_icon;

    public Subject(int subject_id, String subject_name, String subject_icon) {
        this.subject_id = subject_id;
        this.subject_name = subject_name;
        this.subject_icon = subject_icon;
    }

    public int getSubject_id() {
        return subject_id;
    }

    public String getSubject_name() {
        return subject_name;
    }

    public String getSubject_icon() {
        return subject_icon;
    }
}
