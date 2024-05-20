function StartScreen({ numQuestions, dispatch, difficulty }) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      
      <label htmlFor="difficulty">
        Please select the difficulty of the questions
        
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) =>
            dispatch({ type: "setDifficulty", payload: e.target.value })
          }
        >
          <option value="all">All Questions</option>
          <option value="easy">Easy Quesions</option>
          <option value="medium">Medium Questions</option>
          <option value="hard">Hard Questions</option>
        </select>
      </label>

      <h3>{numQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
