import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  filterQuestions: [],
  // loading, 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  difficulty: "all",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        filterQuestions: action.payload,
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.filterQuestions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finished":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restartQuiz":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
        filterQuestions: state.questions,
        difficulty: "all",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "setDifficulty":
      return {
        ...state,
        difficulty: action.payload,
        filterQuestions:
          action.payload === "all"
            ? state.questions
            : state.questions.filter((question) => {
                if (action.payload === "easy") return question.points === 10;
                if (action.payload === "medium") return question.points === 20;
                if (action.payload === "hard") return question.points === 30;
              }),
      };
    default:
      throw new Error("Action unknown");
  }
}

function QuizProvider({ children }) {
  const [
    {
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      filterQuestions,
      difficulty,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  console.log(filterQuestions);
  const numQuestions = filterQuestions.length;
  const maxPossiblePoints = filterQuestions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(() => {
    async function getData() {
      const res = await fetch(`http://localhost:9000/questions`);
      if (res && !res.ok) throw new Error(res.status);
      const data = await res.json();
      dispatch({ type: "dataReceived", payload: data });
    }
    getData().catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        filterQuestions,
        difficulty,
        numQuestions,
        maxPossiblePoints,
        dispatch
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside the Provider!");
  return context;
}

export { QuizProvider, useQuiz };
