
export const SET = 'SET';

export function set(path, value) {
  console.log('actions.set', path, value)
  return {
    type: SET,
    value: {
      path,
      value
    }
  };
}