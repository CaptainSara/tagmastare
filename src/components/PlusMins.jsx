import React from 'react';
import { useState } from 'react';

const PlusMinus = (props) => {
  let [count, setCount] = useState(0);
  const { travelerMap, addToHashmap, traveler } = props;

  const showHashmap = () => {
    const hashmapString = Object.entries(travelerMap)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    window.alert(hashmapString);
  };

  function incrementCount() {
    setCount((prevCount) => prevCount + 1);
    addToHashmap(traveler, count)
    showHashmap();
  }

  function decrementCount() {
    setCount((c) => Math.max(c - 1, 0));
    const index = travelerMap[traveler].key;
    if (index > -1) {
      addToHashmap(traveler, count);
    }
  }

  return (
    <div className='content-box'>
      <div className='number'>
        <span onClick={decrementCount} className='minus' onChange={decrementCount}>
          -
        </span>
        <input className='travel' type='' value={count} />
        <span onClick={incrementCount} className='plus' onChange={incrementCount}>
          +
        </span>
      </div>
    </div>
  );
};

export default PlusMinus;