import { useQuiz } from "../context/QuizContext";

function HighScore() {
  const { highscore } = useQuiz();
  return (
    <div className="highscore-box">
      <p>High Score</p>
      <p>
        <strong>{highscore}</strong>
      </p>
    </div>
  );
}

export default HighScore;
