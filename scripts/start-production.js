process.env.STATIC_DIR = "dist";
const app = require("../server");
const port = Number(process.env.PORT) || 3100;

app.listen(port, () => {
  console.log(`Khoan Đã production đang chạy tại http://localhost:${port}`);
});
