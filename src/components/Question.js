import { useQuiz } from "../context/QuizContext";
import Options from "./Options";

function Question() {
  const { filterQuestions, index} = useQuiz();
  const question = filterQuestions.at(index);
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question}  />
    </div>
  );
}

export default Question;
