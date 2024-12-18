import ReactPaginate from 'react-paginate';

const Pagination = ({ pageCount, onPageChange }) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={(event) => onPageChange(event.selected)}
      containerClassName="pagination"
      activeClassName="active"
    />
  );
};

export default Pagination;
