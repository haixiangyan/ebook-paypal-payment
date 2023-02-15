const fs = require('fs');
const path = require('path');

const host = 'http://localhost:3001/static'
const bookFilePath = path.join(__dirname, '../static/book.pdf');
const deleteInterval = 30000;

const getBookDownloadUrl = () => {
  const copiedFileName = `${new Date().valueOf()}.pdf`
  // 生成随机地址
  const randomFilePath = path.join(__dirname, `../static/${copiedFileName}`);
  // 复制文件
  fs.copyFileSync(bookFilePath, randomFilePath);

  // 自动删除
  setTimeout(() => {
    fs.unlinkSync(randomFilePath);
  }, deleteInterval)

  return `${host}/${copiedFileName}`;
}

module.exports = {
  getBookDownloadUrl,
}
