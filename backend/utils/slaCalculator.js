const calculateSLA = (priority) => {
  const now = new Date();
  let hours = 0;

  if (priority === "Low") hours = 48;
  if (priority === "Medium") hours = 24;
  if (priority === "High") hours = 8;
  if (priority === "Critical") hours = 2;

  return new Date(now.getTime() + hours * 60 * 60 * 1000);
};

module.exports = calculateSLA;