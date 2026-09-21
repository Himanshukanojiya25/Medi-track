import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject, ZodRawShape, ZodTypeAny } from "zod";

/**
 * Simple Logger (No external dependencies)
 */
const logger = {
  debug: (data: any) => console.log('[DEBUG]', JSON.stringify(data, null, 2)),
  info: (data: any) => console.log('[INFO]', JSON.stringify(data, null, 2)),
  warn: (data: any) => console.warn('[WARN]', JSON.stringify(data, null, 2)),
  error: (data: any) => console.error('[ERROR]', JSON.stringify(data, null, 2)),
};

interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

type ValidationSchema = ZodObject<ZodRawShape> | ZodTypeAny | null | undefined;

interface MultiSchemaInput {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export class ValidationMiddleware {
  static validate(schema: ValidationSchema | MultiSchemaInput) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const startTime = Date.now();
      const requestId = (req as any).id || this.generateRequestId();

      if (!schema) {
        logger.warn({
          message: 'Validation skipped - No schema provided',
          requestId,
          path: req.path,
          method: req.method,
        });
        next();
        return;
      }

      // Check if it's multi-schema format { body, query, params }
      const isMultiSchema = typeof schema === 'object' && 
        !('parse' in schema) && 
        (schema.body || schema.query || schema.params);

      try {
        if (isMultiSchema) {
          // Handle multi-schema validation
          const multiSchema = schema as MultiSchemaInput;
          const promises = [];
          
          if (multiSchema.body) {
            promises.push(multiSchema.body.parseAsync(req.body));
          }
          if (multiSchema.query) {
            promises.push(multiSchema.query.parseAsync(req.query));
          }
          if (multiSchema.params) {
            promises.push(multiSchema.params.parseAsync(req.params));
          }
          
          await Promise.all(promises);
          
          (req as any).validated = {
            body: req.body,
            query: req.query,
            params: req.params,
          };
        } else {
          // Handle single schema (expects { body, query, params })
          const validatedData = await (schema as ZodTypeAny).parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
          }) as {
            body: any;
            query: any;
            params: any;
          };

          (req as any).validated = {
            body: validatedData.body,
            query: validatedData.query,
            params: validatedData.params,
          };
        }

        const duration = Date.now() - startTime;
        if (duration > 100) {
          logger.debug({
            message: 'Validation completed',
            requestId,
            duration: `${duration}ms`,
            path: req.path,
          });
        }

        next();
      } catch (error) {
        const duration = Date.now() - startTime;
        
        if (error instanceof ZodError) {
          const validationErrors = error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
            value: issue.input,
          }));
          
          logger.warn({
            message: 'Validation failed',
            requestId,
            path: req.path,
            method: req.method,
            errors: validationErrors,
            duration: `${duration}ms`,
          });

          res.status(400).json({
            success: false,
            message: 'Request validation failed',
            code: 'VALIDATION_ERROR',
            errors: validationErrors,
            timestamp: new Date().toISOString(),
            path: req.path,
          });
          return;
        }

        logger.error({
          message: 'Unexpected validation error',
          requestId,
          error: error instanceof Error ? error.message : 'Unknown error',
          path: req.path,
        });

        res.status(500).json({
          success: false,
          message: 'Validation service error',
          code: 'VALIDATION_SERVICE_ERROR',
          timestamp: new Date().toISOString(),
          path: req.path,
        });
      }
    };
  }

  private static generateRequestId(): string {
    return `val_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}

export const validate = (schema: ValidationSchema | { body?: any; query?: any; params?: any }) => {
  return ValidationMiddleware.validate(schema);
};

export default validate;