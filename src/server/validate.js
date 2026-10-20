// Input helpers for request bodies and responses.
export const str = (value, max = 500) => (value === undefined || value === null ? '' : String(value).trim().slice(0, max));

// Lean Mongoose docs → plain JSON (ObjectIds and Dates become strings) for client components
export const toPlain = (value) => JSON.parse(JSON.stringify(value));
