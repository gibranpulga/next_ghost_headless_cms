import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    return pageNumbers.map(number => {
      if (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) {
        return (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-4 py-2 ${currentPage === number ? 'bg-green-300' : 'bg-gray-200'} rounded hover:bg-gray-300 mx-1`}
          >
            {number}
          </button>
        );
      } else if (number === currentPage - 2 || number === currentPage + 2) {
        return <span key={number} className="px-2">...</span>;
      } else {
        return null;
      }
    });
  };

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mx-1"
      >
        Anterior
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mx-1"
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
