import type { NextFunction, Request, Response } from 'express'
import { generateErrorResponse } from '../utils/response_utils'

export async function basicAuthMiddleware (req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization

  if (!auth) {
    res.status(401).json(generateErrorResponse('Unauthorized', 401))
    return
  }

  const basicAuth = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':')
  const username = basicAuth[0]
  const password = basicAuth[1]

  if (username !== 'admin' || password !== 'admin123') {
    res.status(401).json(generateErrorResponse('Unauthorized', 401))
    return
  }

  next()
}
