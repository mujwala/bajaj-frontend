import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleOptionChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(value);
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      const result = await axios.post('https://backend-bajaj.onrender.com/bfhl', parsedData); // Updated URL here
      setResponse(result.data);
      setError('');
    } catch (err) {
      setError('Invalid JSON or server error');
      setResponse(null);
    }
  };

  const handleClearFilter = (filter) => {
    setSelectedOptions(selectedOptions.filter(option => option !== filter));
  };

  const renderSelectedFilters = () => {
    return (
      <div className="selected-filters">
        {selectedOptions.map(option => (
          <span key={option} className="filter-item">
            {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
            <span className="clear-filter" onClick={() => handleClearFilter(option)}>&times;</span>
          </span>
        ))}
      </div>
    );
  };

  const renderFilteredResults = () => {
    if (!response) return null;

    const results = [];
    if (selectedOptions.includes('numbers') && response.numbers) {
      results.push(
        <div className="numbers" key="numbers">
          <h3>Numbers</h3>
          <p>{response.numbers.join(', ')}</p>
        </div>
      );
    }
    if (selectedOptions.includes('alphabets') && response.alphabets) {
      results.push(
        <div className="alphabets" key="alphabets">
          <h3>Alphabets</h3>
          <p>{response.alphabets.join(', ')}</p>
        </div>
      );
    }
    if (selectedOptions.includes('highest_alphabet') && response.highest_alphabet) {
      results.push(
        <div className="highest-alphabet" key="highest_alphabet">
          <h3>Highest Alphabet</h3>
          <p>{response.highest_alphabet.join(', ')}</p>
        </div>
      );
    }
    return results.length > 0 ? results : <p>No results to display.</p>;
  };

  return (
    <div className="App">
      <h1>AP21110011366</h1>
      <textarea
        rows="10"
        cols="50"
        value={jsonInput}
        onChange={handleInputChange}
        placeholder='Enter JSON here. Example: {"data": ["M", "1", "334", "4", "B"]}'
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      <br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <>
          <div>
            {renderSelectedFilters()}
          </div>
          <select multiple={true} onChange={handleOptionChange} value={selectedOptions}>
            <option value="numbers">Numbers</option>
            <option value="alphabets">Alphabets</option>
            <option value="highest_alphabet">Highest Alphabet</option>
          </select>
          <div>
            {renderFilteredResults()}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
