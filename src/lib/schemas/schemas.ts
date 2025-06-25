import z from 'zod';
import { Schema } from './definition';

export const usernameSchema = new Schema({
  schema: z.string()
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric.")
    .min(8, "Username must be at least 8 characters.")
    .max(50, "Username must be at most 20 characters."),
  max: 50,
});

export const nameSchema = new Schema({
  schema: z.string()
    .min(3, "Name must be at least 3 characters.")
    .max(50, "Name must be at most 50 characters.")
    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, "Name must be valid."),
  max: 50,
});

export const emailSchema = new Schema({
  schema: z.string()
    .min(5, "Email must be at least 5 characters.")
    .max(254, "Email must be at most 254 characters.")
    .email("Email must be valid."),
  max: 254,
})

export const passwordSchema = new Schema({
  schema: z.string()
    .min(10, "Password must be at least 10 characters.")
    .max(64, "Password must be at most 64 characters.")
    .regex(/^\S.*\S$/, "Password must not have leading or trailing spaces.")
    .regex(/.*[a-z].*/, "Password must have at least one lowercase letter.")
    .regex(/.*[A-Z].*/, "Password must have at least one uppercase letter.")
    .regex(/.*[0-9].*/, "Password must have at least one number.")
    .regex(/.*[^a-zA-Z0-9\s].*/, "Password must have at least one special character."),
  max: 64,
});

export const companyCodeSchema = new Schema({
  schema: z.string()
    .regex(/^[a-zA-Z0-9]+$/, "Company code must be alphanumeric.")
    .length(6, "Company code must be 6 characters."),
  max: 6,
});

export const patientNameSchema = new Schema({
  schema: z.string()
    .min(2, "Patient name must be at least 2 characters.")
    .max(50, "Patient name must be at most 50 characters.")
    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, "Patient name must be valid."),
  max: 50,
});

export const patientAdditionalInformationSchema = new Schema({
  schema: z.string()
    .max(500, "Patient additional information must be at most 500 characters."),
  max: 500,
});

export const goalSchema = new Schema({
  schema: z.string()
    .min(1, "Goal must be at least 1 character.")
    .max(140, "Goal must be at most 140 characters."),
  max: 140,
});

export const eventDescriptionSchema = new Schema({
  schema: z.string()
    .min(1, "Event description must be at least 1 character.")
    .max(500, "Event description must be at most 500 characters."),
  max: 500,
});

export const choiceSchema = new Schema({
  schema: z.string()
    .min(1, "Choice must be at least 1 character.")
    .max(140, "Choice must be at most 140 characters."),
  max: 140,
});

export const behaviorDescriptionSchema = new Schema({
  schema: z.string()
    .max(500, "Behavior description must be at most 500 characters."),
  max: 500,
});

export const noteAdditionalInformationSchema = new Schema({
  schema: z.string()
    .max(500, "Note additional information must be at most 500 characters."),
  max: 500,
});