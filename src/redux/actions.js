
export const SET = 'SET';

export function set(path, value) {
  return {
    type: SET,
    value: {
      path,
      value
    }
  };
}