import Link from 'next/link';

const Pagination = ({ currentPage, totalPages }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    return pageNumbers.map(number => {
      const href = number === 1 ? '/' : `/pagina/${number}`;
      return (
        <Link key={number} href={href} legacyBehavior>
          <a
            className={`px-4 py-2 ${currentPage === number ? 'bg-green-300' : 'bg-gray-200'} rounded hover:bg-gray-300 mx-1`}
          >
            {number}
          </a>
        </Link>
      );
    });
  };

  const prevPageHref = currentPage === 2 ? '/' : `/pagina/${currentPage - 1}`;
  const nextPageHref = `/pagina/${currentPage + 1}`;

  return (
    <div className="flex justify-center mt-8">
      <Link href={prevPageHref} legacyBehavior>
        <a
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mx-1"
          onClick={(e) => {
            e.preventDefault();
          }}
          disabled={currentPage === 1}
        >
          Anterior
        </a>
      </Link>
      {renderPageNumbers()}
      <Link href={nextPageHref} legacyBehavior>
        <a
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mx-1"
          onClick={(e) => {
            e.preventDefault();
          }}
          disabled={currentPage === totalPages}
        >
          Próxima
        </a>
      </Link>
    </div>
  );
};

export default Pagination;
