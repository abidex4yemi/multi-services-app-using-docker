import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fib = () => {
  const [state, setState] = useState({
    seenIndexes: [],
    values: {}
  });

  const [index, setIndex] = useState('');

  const fetchValues = async () => {
    await axios.get('/api/values/current').then((res) => {
      setState((prevState) => ({
        ...prevState,
        values: res.data
      }));
    });
  };

  const fetchIndexes = async () => {
    await axios.get('/api/values/all').then((res) => {
      setState((prevState) => ({
        ...prevState,
        seenIndexes: res.data
      }));
    });
  };

  const renderSeenIndexes = () => {
    return state.seenIndexes.map(({ number }) => number).join(', ');
  };

  const renderValues = () => {
    const entries = [];

    for (let key in state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {state.values[key]}
        </div>
      );
    }

    return entries;
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const handleOnChange = (e) => {
    const value = e.target.value;

    setIndex(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/values', { index });
    setIndex('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Welcome to fib series calculator app</p>
        <label>Enter your index:</label>
        <input
          type="text"
          onChange={handleOnChange}
          name="index"
          value={index}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Indexes i have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
