const ctx: Worker = (self as unknown) as Worker;
ctx.onmessage = (message: MessageEvent) => {
  console.log(message);
};

export default null as unknown;
