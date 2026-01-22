package model;

public class QuizQuestion {

    private int questionId;
    private int lessonId;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctOption;

    public QuizQuestion(int questionId, int lessonId, String questionText,
                        String optionA, String optionB, String optionC,
                        String optionD, String correctOption) {

        this.questionId = questionId;
        this.lessonId = lessonId;
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctOption = correctOption;
    }

    public int getQuestionId() { return questionId; }
    public int getLessonId() { return lessonId; }
    public String getQuestionText() { return questionText; }
    public String getOptionA() { return optionA; }
    public String getOptionB() { return optionB; }
    public String getOptionC() { return optionC; }
    public String getOptionD() { return optionD; }
    public String getCorrectOption() { return correctOption; }
}
