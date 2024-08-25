const animateText = (text: string) => {
  const snt = text.split(' ');
  const csize_mul = [];
  for (const sn of snt) {
    if (sn.endsWith(',') || sn.endsWith('?')) {
      const wait = '0.2 '.repeat(3).trim().split(' ');
      csize_mul.push(...wait);
      continue;
    }
    if (sn.endsWith('.')) {
      const wait = '0.2 '.repeat(4).trim().split(' ');
      csize_mul.push(...wait);
      continue;
    }
    if (sn.length <= 5) {
      csize_mul.push(0.5);
      continue;
    }
    if (sn.length <= 3) {
      csize_mul.push(0.25);
      continue;
    }
    if (sn.length > 5) {
      csize_mul.push(0.75);
      continue;
    }
  }
  return csize_mul;
};

export default animateText;
