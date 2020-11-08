# [GPU] Substring Search

## Useful VsCode extensions
* PlantUML (diagrams)
* LaTeX Workshop (with texlive, latexmk from CLI)
* Spellright (docs, uses Hunspell)

## Setup & run

Install dependencies:
```sh
npm install
```

Run dev server:
```sh
npm run serve
```

Build in dev mode:
```sh
npm run build
```

Build in dev and watch:
```sh
npm run build:watch
```

Build for production:
```sh
npm run build:prod
```

## CPU Scheduler

Example usage:
```ts
(async () => {
  const scheduler = new CpuScheduler()
    .setWorkerCount(4)
    .generateDataSet(100_000_000, 7);
  await scheduler.ready(); // wait for all workers to load and respond with `ready` message

  const t1 = performance.now();
  const result = await scheduler.run()
  console.log(result, performance.now() - t1);
})();
```

## GPU Scheduler

Example usage:
```ts
(async () => {
  const scheduler = new GpuScheduler()
    .generateDataSet(100_000_000, 7);
  await scheduler.ready(); // promise to keep common interface

  const t1 = performance.now();
  const result = await scheduler.run() // promise to keep common interface
  console.log(result, performance.now() - t1);
})();
```
