import { buildApp } from '../../adapters/inbound/http/app.js';

const app = buildApp();
const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`FuelEU backend running on :${port}`);
});
