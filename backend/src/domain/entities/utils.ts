import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

/**
 * Generates a 24-character hex string (suitable for Mongo ObjectId)
 * by hashing a UUIDv4 and slicing the result.
 */
export function generateUUID(): string {
  const uuid = uuidv4();                          // e.g. '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
  const hash = createHash('sha1')                 // SHA-1 gives 40 hex chars
    .update(uuid)
    .digest('hex');                                // e.g. 'c2a23e7a5d0b9f3e4f9b0a1c2d3e4f5a6b7c8d9e'
  return hash.slice(0, 24);                        // take first 24 chars
}