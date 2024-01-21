import { useState } from 'react';

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Statistic = ({ text, value }) => (
  <p>
    {text} {value}
  </p>
);

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
    setAverage((good + 1 - bad) / (good + 1 + neutral + bad));
    setPositive(((good + 1) / (good + 1 + neutral + bad)) * 100);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
    setAverage((good - bad) / (good + neutral + 1 + bad));
    setPositive((good / (good + neutral + 1 + bad)) * 100);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
    setAverage((good - (bad + 1)) / (good + neutral + bad + 1));
    setPositive((good / (good + neutral + bad + 1)) * 100);
  };

  return (
    <>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      <h1>statistics</h1>
      <Statistic text="good" value={good} />
      <Statistic text="neutral" value={neutral} />
      <Statistic text="bad" value={bad} />
      <Statistic text="average" value={average} />
      <Statistic text="positive" value={`${positive} %`} />
    </>
  );
};

export default App;
