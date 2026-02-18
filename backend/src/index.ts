import express from 'express'

const PORT = 3001;

async function startServer() {
  const app = express();

  await (await import('./loaders')).default({ app });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  }).on('error', error => {
    console.log(error.message);
    process.exit(1);
  });
}

startServer();
