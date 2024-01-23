import os from 'node:os'

const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

const totalMem = os.totalmem()

console.log(`La mémoire RAM est de taille ${bytesToSize(totalMem)}`)

const endia = os.endianness() === "BE" ? "Big endian " : "Little Endian"
console.log(`Le CPU est de type: ${endia}`)

const user_info = os.userInfo()
console.log(`le shell par défaut de l'utilisateur '${user_info.username}' est 'user_info.shell'`)
