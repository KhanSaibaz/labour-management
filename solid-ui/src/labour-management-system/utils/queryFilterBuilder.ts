type FilterValue = string | number | boolean | null | undefined;

type Filters = Record<string, FilterValue>;

type QueryParams = Record<string, string | number | boolean>;

export const buildFilters = (filters: Filters = {}): QueryParams => {
  const params: QueryParams = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params[`filters[${key}][id][$eq]`] = value;
    }
  });

  return params;
};

export const buildAndFilters = (filters: Filters = {}): QueryParams => {
  const params: QueryParams = {};
  let index = 0;

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params[`filters[$and][${index}][${key}][id][$eq]`] = value;
      index++;
    }
  });

  return params;
};

/*--------------- examples to use --------------*/
// const params = buildFilters({
//   application: 10,
//   applicationLocation: 20
// });
// //result
// filters[application][id][$eq]=10
// filters[applicationLocation][id][$eq]=20
// getTerminalsByLocation: builder.query({
//   query: (locationId: number) => ({
//     url: "/application-terminal",
//     params: buildFilters({
//       applicationLocation: locationId
//     })
//   })
// })


// Using $and Filters:
// const params = buildAndFilters({
//   application: 10,
//   applicationLocation: 20
// });
// Result :
// filters[$and][0][application][id][$eq]=10
// filters[$and][1][applicationLocation][id][$eq]=20