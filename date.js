exports.getDate = function() {
  const options = {
    month: "short",
    weekday: "short",
    day: "numeric",
    year: "numeric"
  }
  const today = new Date();
  return today.toLocaleDateString("en-US", options);
}

exports.getDay = function() {
  const options = {
    weekday: "long"
  }
  const today = new Date();
  return today.toLocaleDateString("en-US", options);
}
