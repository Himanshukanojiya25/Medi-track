import { model } from 'mongoose';
import { BillingSchema } from './billing.schema';
import { IBilling } from './billing.types';

export const BillingModel = model<IBilling>('Billing', BillingSchema);
