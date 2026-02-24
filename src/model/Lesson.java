package model;

public class Lesson {

    private int lesson_id;
    private int subject_id;
    private String lesson_title;
    private String lesson_text;
    private String lesson_image;
    private String video_url;
    private String notes;

    public Lesson(int lesson_id, int subject_id,
                  String lesson_title,
                  String lesson_text,
                  String lesson_image,
                  String video_url,
                  String notes) {

        this.lesson_id = lesson_id;
        this.subject_id = subject_id;
        this.lesson_title = lesson_title;
        this.lesson_text = lesson_text;
        this.lesson_image = lesson_image;
        this.video_url = video_url;
        this.notes = notes;
    }

    public int getLesson_id() { return lesson_id; }
    public int getSubject_id() { return subject_id; }
    public String getLesson_title() { return lesson_title; }
    public String getLesson_text() { return lesson_text; }
    public String getLesson_image() { return lesson_image; }
    public String getVideo_url() { return video_url; }
    public String getNotes() { return notes; }
}
