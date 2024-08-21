const animateText = (text: string) => {
  const snt = text.split(' ');
  const csize_mul = [];
  for (const sn of snt) {
    if (sn === ',') {
      console.log('Hi');
      csize_mul.push(0.2);
      continue;
    }
    if (sn.length <= 5) {
      csize_mul.push(0.5);
      continue;
    }
    if (sn.length > 5) {
      csize_mul.push(1.0);
      continue;
    }
  }
  return csize_mul;
};

export default animateText;
