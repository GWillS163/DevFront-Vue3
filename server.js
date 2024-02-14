import express from 'express';

const app = express();
console.log(process.cwd());
// Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("E:\\puzzleCrackerTemp"));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});