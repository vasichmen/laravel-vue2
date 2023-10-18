export default bytes => {
  const SIZE = Math.floor(Math.log(bytes) / Math.log(1024));

  if (bytes == 0) {
    return '0.00 B';
  }
  else {
    return (bytes / Math.pow(1024, SIZE)
    ).toFixed(0) + ' ' + ' KMGTP'.charAt(SIZE) + 'B';
  }
};