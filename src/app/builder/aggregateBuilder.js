const mongoose = require("mongoose");
const { calculatePagination } = require("../helpers/paginationHelper");

const aggregateBuilder = async ({
  model,
  firstMatchStage = null,
  filters = {},
  paginationOptions = {},
  lookupStages = [],
  finalProject = null,
  searchableFields = [],
  total = false,
}) => {
  const { searchTerm, ...filtersData } = filters;

  // calculate pagination
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const aggregationPipeline = [];

  // Add first match stage
  if (firstMatchStage) {
    aggregationPipeline.push({ $match: firstMatchStage });
  }

  // Add Lookup stages
  if (lookupStages.length > 0) {
    aggregationPipeline.push(...lookupStages);
  }

  const matchStage = {};

  // Search Stage
  if (searchTerm) {
    const searchConditions = searchableFields?.map((field) => ({
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    }));
    matchStage.$or = searchConditions;
  }

  // Filter Stage
  if (Object.keys(filtersData).length) {
    const filterClauses = Object.entries(filtersData).reduce(
      (acc, [field, value]) => {
        // Handle single value
        if (!Array.isArray(value)) {
          acc.push({
            [field]: mongoose.Types.ObjectId.isValid(value)
              ? new mongoose.Types.ObjectId(value)
              : value,
          });
        }

        // Handle array values
        else if (Array.isArray(value) && value.length) {
          const allAreObjectIds = value.every((v) =>
            mongoose.Types.ObjectId.isValid(v)
          );
          const finalValue = allAreObjectIds
            ? value.map((v) => new mongoose.Types.ObjectId(v))
            : value;
          acc.push({ [field]: { $in: finalValue } });
        }

        return acc;
      },
      []
    );

    // Combine all filter conditions with $and
    if (filterClauses.length) {
      matchStage.$and = filterClauses;
    }
  }

  if (Object.keys(matchStage).length > 0) {
    aggregationPipeline.push({ $match: matchStage });
  }

  // Sort Stage
  const sortConditions = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  if (Object.keys(sortConditions).length > 0) {
    aggregationPipeline.push({ $sort: sortConditions });
  }

  // Total and Pagination Handling
  if (total) {
    aggregationPipeline.push({
      $facet: {
        totalCount: [{ $count: "totalCount" }],
        finalData: [
          { $skip: skip },
          { $limit: limit },
          ...(finalProject ? [{ $project: finalProject }] : []),
        ],
      },
    });
  } else {
    if (finalProject) {
      aggregationPipeline.push({ $project: finalProject });
    }
  }

  // Execute aggregation and return data
  const result = await model.aggregate(aggregationPipeline).exec();

  if (total) {
    const total = result[0]?.totalCount[0]?.totalCount || 0;
    const totalPage = Math.ceil(total / limit);
    const data = result[0]?.finalData || [];
    return {
      meta: {
        page,
        limit,
        total,
        totalPage,
      },
      data,
    };
  }

  return result;
};

module.exports = aggregateBuilder;
