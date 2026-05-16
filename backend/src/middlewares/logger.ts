import crypto from 'node:crypto'

import type { Request, Response, NextFunction } from 'express'
import type { Logger } from 'winston'

const logger = (instance: Logger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.log = instance.child({
      requestId: crypto.randomUUID(),
      method: req.method,
      url: req.url,
    })

    next()
  }
}

export { logger }
