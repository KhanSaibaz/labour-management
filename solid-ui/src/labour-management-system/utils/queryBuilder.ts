type Filters = Record<string, string | number | boolean | null | undefined>;

interface BuildQueryOptions {
  filters?: Filters;
  limit?: number;
  offset?: number;
  sort?: string[];
  populate?: string[];
  populateMedia?: string[];
}

export const buildQuery = ({
  filters = {},
  limit,
  offset,
  sort = [],
  populate = [],
  populateMedia = [],
}: BuildQueryOptions = {}): Record<string, string | number> => {

  const params: Record<string, string | number> = {};

  let index = 0;

  // Filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params[`filters[$and][${index}][${key}][id][$eq]`] = value as string | number;
      index++;
    }
  });

  // Pagination
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;

  // Sorting
  sort.forEach((s, i) => {
    params[`sort[${i}]`] = s;
  });

  // Populate relations
  populate.forEach((p, i) => {
    params[`populate[${i}]`] = p;
  });

  // Populate media
  populateMedia.forEach((p, i) => {
    params[`populateMedia[${i}]`] = p;
  });

  return params;
};

/*---------------- example to use------------*/
// const params = buildQuery({
//   filters: {
//     application: 10,
//     applicationLocation: 20,
//   },
//   limit: 10,
//   offset: 0,
//   sort: ["createdAt:DESC"],
//   populate: ["applicationLocation"],
// });

// getTerminalsByLocation: builder.query({
//   query: (locationId: number) => ({
//     url: "/application-terminal",
//     params: buildQuery({
//       filters: { applicationLocation: locationId },
//       populate: ["applicationLocation"],
//     }),
//   }),
// });