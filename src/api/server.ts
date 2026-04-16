import { Blockchain } from '../blockchain';
import { createApp } from './app';

const PORT = process.env.PORT || 3000;
const coin = new Blockchain();

const app = createApp(coin);

app.listen(PORT, () => {
  console.log(`Blockchain API running on http://localhost:${PORT}`);
});
