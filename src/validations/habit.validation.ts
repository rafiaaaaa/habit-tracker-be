import z from "zod";

const addHabitValidationSchema = z.object({
  title: z.string().max(100).min(3),
  description: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "CUSTOM"]).default("DAILY"),
  color: z.string().optional(),
});

type AddHabitRequest = z.infer<typeof addHabitValidationSchema>;

export { addHabitValidationSchema, AddHabitRequest };
