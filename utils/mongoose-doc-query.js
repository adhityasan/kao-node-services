function getDocQuery(query) {
  const find = new Object(query)
  let select = new Object()
  const sort = new Object()
  const limit = parseInt(query.pageSize)
  const skip = query.pageNumber ? ((parseInt(query.pageNumber) - 1) * limit) : null
  
  if (query.select) {
    select = query.select
    if (query.select && Array.isArray(query.select)) {
      query.select.forEach(att => select[att] = 1)
    }
  }

  if (query.sortby) sort[query.sortby] = !query.order ? 1 : query.order
  
  delete find.pageNumber
  delete find.pageSize
  delete find.sortby
  delete find.order
  delete find.limit
  delete find.select

  for (const key in find) {
    if (find[key]) {
      find[key] = JSON.parse(find[key])
    }
  }

  return { find, sort, limit, select, skip }
}

module.exports = getDocQuery