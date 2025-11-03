import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'text', count = 1, style }) => {
  const skeletons = Array.from({ length: count });

  const getSkeletonStyle = (index) => {
    switch (type) {
      case 'title':
        return { width: '60%', height: '3rem', marginBottom: '1rem' };
      case 'banner':
        return { width: '100%', height: '300px', marginBottom: '2rem' };
      case 'paragraph':
        return { 
          width: index === count - 1 ? '70%' : '100%', 
          height: '1rem', 
          marginBottom: '0.75rem' 
        };
      case 'card':
        return { width: '100%', height: '240px' };
      case 'text':
      default:
        return { width: '100%', height: '1rem', marginBottom: '0.75rem' };
    }
  };

  return (
    <>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="skeleton"
          style={{ ...getSkeletonStyle(index), ...style }}
        ></div>
      ))}
    </>
  );
};

export default SkeletonLoader;
