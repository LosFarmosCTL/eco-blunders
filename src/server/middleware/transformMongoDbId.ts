/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'

type Data = Record<string, any> | Data[] | string | number | boolean | null

function transformOutgoing(data: Data): Data {
  if (Array.isArray(data)) {
    return data.map(transformOutgoing)
  } else if (data && typeof data === 'object' && !(data instanceof Date)) {
    const transformedObject: any = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (key === '_id') {
          transformedObject.id = data[key]?.toString()
        } else {
          transformedObject[key] = transformOutgoing(data[key])
        }
      }
    }
    return transformedObject
  }
  return data
}

function sanitizeIncoming(data: Data): Data {
  if (Array.isArray(data)) {
    return data
  } else if (data && typeof data === 'object' && !(data instanceof Date)) {
    const sanitizedObject: any = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key) && key !== 'id') {
        sanitizedObject[key] = data[key]
      }
    }
    return sanitizedObject
  }
  return data
}

export function transformMongoDbIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const originalJson = res.json.bind(res)
  res.json = function (data: Data) {
    const transformedData = transformOutgoing(data)
    return originalJson(transformedData)
  }

  if (req.body) {
    req.body = sanitizeIncoming(req.body)
  }

  next()
}
