function HighScore({ highscore }) {
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
