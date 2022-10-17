/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
// all info except which answers are correct
export const quizQuestionPublicReturn = (question) => {
  const publicQuestion = {
    id: question.id,
    question: question.question,
    questionType: question.questionType,
    points: question.points,
    timeLimit: question.timeLimit,
    answers: [],
    questionResource: question.questionResource,
    questionVideo: question.questionVideo,
    questionImage: question.questionImage,

  };

  question.answers.forEach((answer) => {
    publicQuestion.answers = [
      ...publicQuestion.answers,
      {
        answer: answer.answer,
        id: answer.id,
      },
    ];
  });

  return publicQuestion;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = (question) => {
  const correctAnswers = [];
  question.answers.forEach((answer) => {
    if (answer.correct) {
      correctAnswers.push(answer.id);
    }
  });
  return correctAnswers;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = (question) => {
  const answers = [];
  question.answers.forEach((answer) => {
    answers.push(answer.id);
  });
  return answers;
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = (question) => {
  return question.timeLimit;
};
