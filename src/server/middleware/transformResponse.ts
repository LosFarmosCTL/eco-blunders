import { Request, Response, NextFunction } from 'express'

type Data = Record<string, unknown> | Data[] | string | number | boolean | null

function transformMongoDbId(data: Data): Data {
  if (Array.isArray(data)) {
    return data.map(transformMongoDbId)
  } else if (data && typeof data === 'object') {
    const { _id, ...rest } = data
    return { id: _id?.toString(), ...rest }
  }

  return data
}

export function transformMongoDbIdMiddleware(
  _: Request,
  res: Response,
  next: NextFunction,
) {
  const oldJson = res.json

  res.json = function (data: Data) {
    const transformedData = transformMongoDbId(data)
    return oldJson.call(this, transformedData)
  }

  next()
}
