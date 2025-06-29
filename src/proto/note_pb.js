// @generated by protoc-gen-es v1.7.2
// @generated from file note.proto (package note.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3, Timestamp } from "@bufbuild/protobuf";
import { User } from "./user_pb.js";
import { Goal } from "./patient_pb.js";

/**
 * @generated from enum note.v1.Health
 */
export const Health = proto3.makeEnum(
  "note.v1.Health",
  [
    {no: 0, name: "UnspecifiedHealth"},
    {no: 1, name: "Good"},
    {no: 2, name: "Fair"},
    {no: 3, name: "Poor"},
  ],
);

/**
 * @generated from enum note.v1.MethodType
 */
export const MethodType = proto3.makeEnum(
  "note.v1.MethodType",
  [
    {no: 0, name: "UnspecifiedMethod"},
    {no: 1, name: "VerbalPrompt"},
    {no: 2, name: "VisualQueue"},
    {no: 3, name: "Gesture"},
    {no: 4, name: "PhysicalPrompt"},
    {no: 5, name: "Shadowing"},
    {no: 6, name: "HandOverHand"},
    {no: 7, name: "TotalAssist"},
  ],
);

/**
 * @generated from enum note.v1.GoalProgress
 */
export const GoalProgress = proto3.makeEnum(
  "note.v1.GoalProgress",
  [
    {no: 0, name: "UnspecifiedGoalProgress"},
    {no: 1, name: "Progressing"},
    {no: 2, name: "Regressing"},
    {no: 3, name: "Stagnant"},
  ],
);

/**
 * @generated from enum note.v1.HealthAndSafetyStep
 */
export const HealthAndSafetyStep = proto3.makeEnum(
  "note.v1.HealthAndSafetyStep",
  [
    {no: 0, name: "UnspecifiedHealthAndSafetyStep"},
    {no: 1, name: "ConstantSupervision"},
    {no: 2, name: "OneOnOneMonitoring"},
    {no: 3, name: "SafeStreetNavigation"},
    {no: 4, name: "ProperHandHygiene"},
    {no: 5, name: "VehicleSafetyAwareness"},
    {no: 6, name: "SafeEatingAndChokingPrevention"},
    {no: 7, name: "ProperUseOfEquipment"},
    {no: 8, name: "MedicationReminders"},
    {no: 9, name: "ReinforceCommunityEtiquette"},
    {no: 10, name: "TeachingSelfAdvocacy"},
    {no: 11, name: "MedicalOrDentalAppointmentAssitance"},
    {no: 12, name: "HouseholdChoresAndMaintenance"},
    {no: 13, name: "ProperShoppingAwareness"},
  ],
);

/**
 * @generated from message note.v1.Method
 */
export const Method = proto3.makeMessageType(
  "note.v1.Method",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "event_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "method", kind: "enum", T: proto3.getEnumType(MethodType) },
    { no: 4, name: "created_at", kind: "message", T: Timestamp },
    { no: 5, name: "updated_at", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message note.v1.Choice
 */
export const Choice = proto3.makeMessageType(
  "note.v1.Choice",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "event_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "created_at", kind: "message", T: Timestamp },
    { no: 5, name: "updated_at", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message note.v1.Event
 */
export const Event = proto3.makeMessageType(
  "note.v1.Event",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "note_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "methods", kind: "message", T: Method, repeated: true },
    { no: 5, name: "choices", kind: "message", T: Choice, repeated: true },
    { no: 6, name: "created_at", kind: "message", T: Timestamp },
    { no: 7, name: "updated_at", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message note.v1.Step
 */
export const Step = proto3.makeMessageType(
  "note.v1.Step",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "note_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "step", kind: "enum", T: proto3.getEnumType(HealthAndSafetyStep) },
    { no: 4, name: "created_at", kind: "message", T: Timestamp },
    { no: 5, name: "updated_at", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message note.v1.PartialPatient
 */
export const PartialPatient = proto3.makeMessageType(
  "note.v1.PartialPatient",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "first_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "last_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "has_maladaptive_behaviors", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

/**
 * @generated from message note.v1.Note
 */
export const Note = proto3.makeMessageType(
  "note.v1.Note",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "nurse", kind: "message", T: User },
    { no: 3, name: "patient", kind: "message", T: PartialPatient },
    { no: 5, name: "date", kind: "message", T: Timestamp },
    { no: 6, name: "physical_health", kind: "enum", T: proto3.getEnumType(Health) },
    { no: 7, name: "emotional_health", kind: "enum", T: proto3.getEnumType(Health) },
    { no: 8, name: "exhibited_maladaptive_behavior", kind: "scalar", T: 8 /* ScalarType.BOOL */, opt: true },
    { no: 9, name: "behavior_description", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 10, name: "goal", kind: "message", T: Goal },
    { no: 11, name: "goal_progress", kind: "enum", T: proto3.getEnumType(GoalProgress) },
    { no: 12, name: "events", kind: "message", T: Event, repeated: true },
    { no: 13, name: "steps", kind: "message", T: Step, repeated: true },
    { no: 14, name: "discussed_monthly_education", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 15, name: "additional_info", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 16, name: "generated_content", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 17, name: "generated_count", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 18, name: "created_at", kind: "message", T: Timestamp },
    { no: 19, name: "updated_at", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message note.v1.EventInput
 */
export const EventInput = proto3.makeMessageType(
  "note.v1.EventInput",
  () => [
    { no: 1, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "methods", kind: "enum", T: proto3.getEnumType(MethodType), repeated: true },
    { no: 3, name: "choices", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ],
);

/**
 * @generated from message note.v1.CreateNoteRequest
 */
export const CreateNoteRequest = proto3.makeMessageType(
  "note.v1.CreateNoteRequest",
  () => [
    { no: 1, name: "note_id", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 2, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "date", kind: "message", T: Timestamp },
    { no: 4, name: "physical_health", kind: "enum", T: proto3.getEnumType(Health) },
    { no: 5, name: "emotional_health", kind: "enum", T: proto3.getEnumType(Health) },
    { no: 6, name: "exhibited_maladaptive_behavior", kind: "scalar", T: 8 /* ScalarType.BOOL */, opt: true },
    { no: 7, name: "behavior_description", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 8, name: "goal_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 9, name: "goal_progress", kind: "enum", T: proto3.getEnumType(GoalProgress) },
    { no: 10, name: "discussed_monthly_education", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 11, name: "additional_info", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 12, name: "events", kind: "message", T: EventInput, repeated: true },
    { no: 13, name: "steps", kind: "enum", T: proto3.getEnumType(HealthAndSafetyStep), repeated: true },
    { no: 14, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.CreateNoteResponse
 */
export const CreateNoteResponse = proto3.makeMessageType(
  "note.v1.CreateNoteResponse",
  () => [
    { no: 1, name: "note_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.UpdateNoteRequest
 */
export const UpdateNoteRequest = proto3.makeMessageType(
  "note.v1.UpdateNoteRequest",
  () => [
    { no: 1, name: "note_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "date", kind: "message", T: Timestamp, opt: true },
    { no: 3, name: "physical_health", kind: "enum", T: proto3.getEnumType(Health), opt: true },
    { no: 4, name: "emotional_health", kind: "enum", T: proto3.getEnumType(Health), opt: true },
    { no: 5, name: "exhibited_maladaptive_behavior", kind: "scalar", T: 8 /* ScalarType.BOOL */, opt: true },
    { no: 6, name: "behavior_description", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 7, name: "goal_id", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 8, name: "goal_progress", kind: "enum", T: proto3.getEnumType(GoalProgress), opt: true },
    { no: 9, name: "discussed_monthly_education", kind: "scalar", T: 8 /* ScalarType.BOOL */, opt: true },
    { no: 10, name: "additional_info", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 11, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.DeleteNoteRequest
 */
export const DeleteNoteRequest = proto3.makeMessageType(
  "note.v1.DeleteNoteRequest",
  () => [
    { no: 1, name: "note_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.GetNoteRequest
 */
export const GetNoteRequest = proto3.makeMessageType(
  "note.v1.GetNoteRequest",
  () => [
    { no: 1, name: "note_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.GetNoteResponse
 */
export const GetNoteResponse = proto3.makeMessageType(
  "note.v1.GetNoteResponse",
  () => [
    { no: 1, name: "note", kind: "message", T: Note },
  ],
);

/**
 * @generated from message note.v1.GenerateNoteContentRequest
 */
export const GenerateNoteContentRequest = proto3.makeMessageType(
  "note.v1.GenerateNoteContentRequest",
  () => [
    { no: 1, name: "note_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.ListNotesRequest
 */
export const ListNotesRequest = proto3.makeMessageType(
  "note.v1.ListNotesRequest",
  () => [
    { no: 1, name: "after_date", kind: "message", T: Timestamp, opt: true },
    { no: 2, name: "before_date", kind: "message", T: Timestamp, opt: true },
    { no: 3, name: "patient_first_name", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 4, name: "patient_last_name", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 5, name: "nurse_name", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 6, name: "page", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
    { no: 7, name: "order_by_asc", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 8, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.ListedNote
 */
export const ListedNote = proto3.makeMessageType(
  "note.v1.ListedNote",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "patient_first_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "patient_last_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "nurse_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "nurse_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "date", kind: "message", T: Timestamp },
    { no: 7, name: "created_at", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message note.v1.ListNotesResponse
 */
export const ListNotesResponse = proto3.makeMessageType(
  "note.v1.ListNotesResponse",
  () => [
    { no: 1, name: "notes", kind: "message", T: ListedNote, repeated: true },
    { no: 2, name: "total", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "page", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "next_page", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
  ],
);

/**
 * @generated from message note.v1.ListNurseNotesRequest
 */
export const ListNurseNotesRequest = proto3.makeMessageType(
  "note.v1.ListNurseNotesRequest",
  () => [
    { no: 1, name: "nurse_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "page", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.ListNurseNotesResponse
 */
export const ListNurseNotesResponse = proto3.makeMessageType(
  "note.v1.ListNurseNotesResponse",
  () => [
    { no: 1, name: "notes", kind: "message", T: ListedNote, repeated: true },
    { no: 2, name: "total", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "page", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "next_page", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
  ],
);

/**
 * @generated from message note.v1.AddEventRequest
 */
export const AddEventRequest = proto3.makeMessageType(
  "note.v1.AddEventRequest",
  () => [
    { no: 1, name: "note_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "event", kind: "message", T: EventInput },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.RemoveEventRequest
 */
export const RemoveEventRequest = proto3.makeMessageType(
  "note.v1.RemoveEventRequest",
  () => [
    { no: 2, name: "event_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.UpdateEventDescriptionRequest
 */
export const UpdateEventDescriptionRequest = proto3.makeMessageType(
  "note.v1.UpdateEventDescriptionRequest",
  () => [
    { no: 1, name: "event_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "new_description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.AddChoiceToEventRequest
 */
export const AddChoiceToEventRequest = proto3.makeMessageType(
  "note.v1.AddChoiceToEventRequest",
  () => [
    { no: 1, name: "event_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.RemoveChoiceFromEventRequest
 */
export const RemoveChoiceFromEventRequest = proto3.makeMessageType(
  "note.v1.RemoveChoiceFromEventRequest",
  () => [
    { no: 1, name: "choice_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.UpdateChoiceInEventRequest
 */
export const UpdateChoiceInEventRequest = proto3.makeMessageType(
  "note.v1.UpdateChoiceInEventRequest",
  () => [
    { no: 1, name: "choice_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "new_description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.AddMethodToEventRequest
 */
export const AddMethodToEventRequest = proto3.makeMessageType(
  "note.v1.AddMethodToEventRequest",
  () => [
    { no: 1, name: "event_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "method", kind: "enum", T: proto3.getEnumType(MethodType) },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.RemoveMethodFromEventRequest
 */
export const RemoveMethodFromEventRequest = proto3.makeMessageType(
  "note.v1.RemoveMethodFromEventRequest",
  () => [
    { no: 1, name: "method_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.AddStepRequest
 */
export const AddStepRequest = proto3.makeMessageType(
  "note.v1.AddStepRequest",
  () => [
    { no: 1, name: "note_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "step", kind: "enum", T: proto3.getEnumType(HealthAndSafetyStep) },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message note.v1.RemoveStepRequest
 */
export const RemoveStepRequest = proto3.makeMessageType(
  "note.v1.RemoveStepRequest",
  () => [
    { no: 1, name: "step_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

