export type Result<SuccessValue, ErrorValue> =
  | Success<SuccessValue, ErrorValue>
  | Failure<SuccessValue, ErrorValue>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Success<SuccessValue, ErrorValue = never> = {
  ok: true;
  value: SuccessValue;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Failure<SuccessValue, ErrorValue = never> = {
  ok: false;
  error: ErrorValue;
};

export const success = <SuccessValue, ErrorValue = never>(
  value: SuccessValue
): Success<SuccessValue, ErrorValue> => ({
  ok: true,
  value,
});
