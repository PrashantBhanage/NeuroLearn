package model;

public class Lesson {

    private int lesson_id;
    private int subject_id;
    private String lesson_title;
    private String lesson_text;
    private String lesson_image;

    public Lesson(int lesson_id, int subject_id,
                  String lesson_title,
                  String lesson_text,
                  String lesson_image) {

        this.lesson_id = lesson_id;
        this.subject_id = subject_id;
        this.lesson_title = lesson_title;
        this.lesson_text = lesson_text;
        this.lesson_image = lesson_image;
    }

    public int getLesson_id() {
        return lesson_id;
    }

    public int getSubject_id() {
        return subject_id;
    }

    public String getLesson_title() {
        return lesson_title;
    }

    public String getLesson_text() {
        return lesson_text;
    }

    public String getLesson_image() {
        return lesson_image;
    }
}
