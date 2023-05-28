export function getTotal(array = [], typeOfTotalKey = "") {
  let result = 0;

  array.forEach((item) => {
    result += Number(item[typeOfTotalKey]);
  });

  return result;
}
