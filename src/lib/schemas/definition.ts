import z from "zod";

export class Schema {
  schema: z.ZodType<any, any>;
  max: number;

  constructor({ schema, max }: { schema: z.ZodType<any, any>, max: number }) {
    this.schema = schema;
    this.max = max;
  }

  safeParse(value: string) {
    return this.schema.safeParse(value);
  }
}

