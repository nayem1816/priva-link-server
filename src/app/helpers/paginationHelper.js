const paginationFields = ["page", "limit", "sortBy", "sortOrder"];

const calculatePagination = (options = {}) => {
  const defaultValues = {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: -1,
    maxLimit: 100000,
  };

  const page =
    options.page === null ? null : Number(options.page) || defaultValues.page;

  const limit =
    options.limit === null
      ? null
      : options.limit === "all"
        ? defaultValues.maxLimit
        : Number(options.limit) || defaultValues.limit;

  const skip = page !== null && limit !== null ? (page - 1) * limit : 0;

  const sortBy =
    options.sortBy === null ? null : options.sortBy || defaultValues.sortBy;

  const sortOrder =
    options.sortOrder === null
      ? null
      : Number(options.sortOrder) || defaultValues.sortOrder;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

module.exports = {
  calculatePagination,
  paginationFields,
};
