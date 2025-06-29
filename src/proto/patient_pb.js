// @generated by protoc-gen-es v1.7.2
// @generated from file patient.proto (package patient.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3, Timestamp } from "@bufbuild/protobuf";

/**
 * @generated from enum patient.v1.Sex
 */
export const Sex = proto3.makeEnum(
  "patient.v1.Sex",
  [
    {no: 0, name: "UnspecifiedSex"},
    {no: 1, name: "Male"},
    {no: 2, name: "Female"},
    {no: 3, name: "Other"},
  ],
);

/**
 * @generated from enum patient.v1.ServiceType
 */
export const ServiceType = proto3.makeEnum(
  "patient.v1.ServiceType",
  [
    {no: 0, name: "UnspecifiedService"},
    {no: 1, name: "Respite"},
    {no: 2, name: "PersonalSupport"},
    {no: 3, name: "Lifeskills"},
    {no: 4, name: "SupportedLiving"},
    {no: 5, name: "SupportedEmployment"},
  ],
);

/**
 * @generated from enum patient.v1.DiagnosisType
 */
export const DiagnosisType = proto3.makeEnum(
  "patient.v1.DiagnosisType",
  [
    {no: 0, name: "UnspecifiedDiagnosis"},
    {no: 1, name: "Autism"},
    {no: 2, name: "DownSyndrome"},
    {no: 3, name: "CerebralPalsy"},
    {no: 4, name: "IntellectualDisability"},
    {no: 5, name: "RettSyndrome"},
    {no: 6, name: "SpinaBifida"},
    {no: 7, name: "PraderWilliSyndrome"},
    {no: 8, name: "PhelanMcdermidSyndrome"},
  ],
);

/**
 * @generated from enum patient.v1.ListPatientsOrderBy
 */
export const ListPatientsOrderBy = proto3.makeEnum(
  "patient.v1.ListPatientsOrderBy",
  [
    {no: 0, name: "CreatedAtAsc"},
    {no: 1, name: "CreatedAtDesc"},
    {no: 2, name: "LastMonthlyTalkAsc"},
    {no: 3, name: "LastMonthlyTalkDesc"},
  ],
);

/**
 * @generated from message patient.v1.Service
 */
export const Service = proto3.makeMessageType(
  "patient.v1.Service",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "service", kind: "enum", T: proto3.getEnumType(ServiceType) },
  ],
);

/**
 * @generated from message patient.v1.Diagnosis
 */
export const Diagnosis = proto3.makeMessageType(
  "patient.v1.Diagnosis",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "diagnosis", kind: "enum", T: proto3.getEnumType(DiagnosisType) },
  ],
);

/**
 * @generated from message patient.v1.Goal
 */
export const Goal = proto3.makeMessageType(
  "patient.v1.Goal",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "created_at", kind: "message", T: Timestamp },
    { no: 5, name: "updated_at", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message patient.v1.ListedNurse
 */
export const ListedNurse = proto3.makeMessageType(
  "patient.v1.ListedNurse",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.Patient
 */
export const Patient = proto3.makeMessageType(
  "patient.v1.Patient",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "company_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "first_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "last_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "sex", kind: "enum", T: proto3.getEnumType(Sex) },
    { no: 6, name: "services", kind: "message", T: Service, repeated: true },
    { no: 7, name: "diagnoses", kind: "message", T: Diagnosis, repeated: true },
    { no: 8, name: "goals", kind: "message", T: Goal, repeated: true },
    { no: 9, name: "assigned_nurses", kind: "message", T: ListedNurse, repeated: true },
    { no: 10, name: "has_maladaptive_behaviors", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 11, name: "additional_information", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 12, name: "last_monthly_talk", kind: "message", T: Timestamp },
    { no: 13, name: "created_at", kind: "message", T: Timestamp },
    { no: 14, name: "updated_at", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message patient.v1.GetPatientRequest
 */
export const GetPatientRequest = proto3.makeMessageType(
  "patient.v1.GetPatientRequest",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.GetPatientResponse
 */
export const GetPatientResponse = proto3.makeMessageType(
  "patient.v1.GetPatientResponse",
  () => [
    { no: 1, name: "patient", kind: "message", T: Patient },
  ],
);

/**
 * @generated from message patient.v1.CreatePatientRequest
 */
export const CreatePatientRequest = proto3.makeMessageType(
  "patient.v1.CreatePatientRequest",
  () => [
    { no: 1, name: "first_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "last_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "has_maladaptive_behaviors", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 4, name: "sex", kind: "enum", T: proto3.getEnumType(Sex) },
    { no: 5, name: "additional_information", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 6, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.CreatePatientResponse
 */
export const CreatePatientResponse = proto3.makeMessageType(
  "patient.v1.CreatePatientResponse",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.UpdatePatientRequest
 */
export const UpdatePatientRequest = proto3.makeMessageType(
  "patient.v1.UpdatePatientRequest",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "first_name", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 3, name: "last_name", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 4, name: "has_maladaptive_behaviors", kind: "scalar", T: 8 /* ScalarType.BOOL */, opt: true },
    { no: 5, name: "sex", kind: "enum", T: proto3.getEnumType(Sex), opt: true },
    { no: 6, name: "additional_information", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 7, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.DeletePatientRequest
 */
export const DeletePatientRequest = proto3.makeMessageType(
  "patient.v1.DeletePatientRequest",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.AddGoalRequest
 */
export const AddGoalRequest = proto3.makeMessageType(
  "patient.v1.AddGoalRequest",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.UpdateGoalRequest
 */
export const UpdateGoalRequest = proto3.makeMessageType(
  "patient.v1.UpdateGoalRequest",
  () => [
    { no: 1, name: "goal_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "new_description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.RemoveGoalRequest
 */
export const RemoveGoalRequest = proto3.makeMessageType(
  "patient.v1.RemoveGoalRequest",
  () => [
    { no: 1, name: "goal_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.ListPatientGoalsRequest
 */
export const ListPatientGoalsRequest = proto3.makeMessageType(
  "patient.v1.ListPatientGoalsRequest",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.ListPatientGoalsResponse
 */
export const ListPatientGoalsResponse = proto3.makeMessageType(
  "patient.v1.ListPatientGoalsResponse",
  () => [
    { no: 1, name: "goals", kind: "message", T: Goal, repeated: true },
  ],
);

/**
 * @generated from message patient.v1.AddServiceRequest
 */
export const AddServiceRequest = proto3.makeMessageType(
  "patient.v1.AddServiceRequest",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "service", kind: "enum", T: proto3.getEnumType(ServiceType) },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.RemoveServiceRequest
 */
export const RemoveServiceRequest = proto3.makeMessageType(
  "patient.v1.RemoveServiceRequest",
  () => [
    { no: 1, name: "service_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.AddDiagnosisRequest
 */
export const AddDiagnosisRequest = proto3.makeMessageType(
  "patient.v1.AddDiagnosisRequest",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "diagnosis", kind: "enum", T: proto3.getEnumType(DiagnosisType) },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.RemoveDiagnosisRequest
 */
export const RemoveDiagnosisRequest = proto3.makeMessageType(
  "patient.v1.RemoveDiagnosisRequest",
  () => [
    { no: 1, name: "diagnosis_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.ListPatientsRequest
 */
export const ListPatientsRequest = proto3.makeMessageType(
  "patient.v1.ListPatientsRequest",
  () => [
    { no: 1, name: "first_name", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 2, name: "last_name", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 3, name: "page", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
    { no: 4, name: "order_by", kind: "enum", T: proto3.getEnumType(ListPatientsOrderBy), opt: true },
    { no: 5, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.ListedPatient
 */
export const ListedPatient = proto3.makeMessageType(
  "patient.v1.ListedPatient",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "first_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "last_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "has_maladaptive_behaviors", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ],
);

/**
 * @generated from message patient.v1.ListedPatientWithInfo
 */
export const ListedPatientWithInfo = proto3.makeMessageType(
  "patient.v1.ListedPatientWithInfo",
  () => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "first_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "last_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "service", kind: "enum", T: proto3.getEnumType(ServiceType) },
    { no: 5, name: "service_count", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 6, name: "last_monthly_talk", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message patient.v1.ListPatientsResponse
 */
export const ListPatientsResponse = proto3.makeMessageType(
  "patient.v1.ListPatientsResponse",
  () => [
    { no: 1, name: "patients", kind: "message", T: ListedPatientWithInfo, repeated: true },
    { no: 2, name: "total", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "page", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "next_page", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
  ],
);

/**
 * @generated from message patient.v1.ListNursePatientsRequest
 */
export const ListNursePatientsRequest = proto3.makeMessageType(
  "patient.v1.ListNursePatientsRequest",
  () => [
    { no: 1, name: "nurse_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.ListNursePatientsResponse
 */
export const ListNursePatientsResponse = proto3.makeMessageType(
  "patient.v1.ListNursePatientsResponse",
  () => [
    { no: 1, name: "patients", kind: "message", T: ListedPatient, repeated: true },
  ],
);

/**
 * @generated from message patient.v1.ListPatientsNotAssignedToNurseRequest
 */
export const ListPatientsNotAssignedToNurseRequest = proto3.makeMessageType(
  "patient.v1.ListPatientsNotAssignedToNurseRequest",
  () => [
    { no: 1, name: "nurse_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.ListPatientsNotAssignedToNurseResponse
 */
export const ListPatientsNotAssignedToNurseResponse = proto3.makeMessageType(
  "patient.v1.ListPatientsNotAssignedToNurseResponse",
  () => [
    { no: 1, name: "patients", kind: "message", T: ListedPatient, repeated: true },
  ],
);

/**
 * @generated from message patient.v1.ListNursesNotAssignedToPatientRequest
 */
export const ListNursesNotAssignedToPatientRequest = proto3.makeMessageType(
  "patient.v1.ListNursesNotAssignedToPatientRequest",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.ListNursesNotAssignedToPatientResponse
 */
export const ListNursesNotAssignedToPatientResponse = proto3.makeMessageType(
  "patient.v1.ListNursesNotAssignedToPatientResponse",
  () => [
    { no: 1, name: "nurses", kind: "message", T: ListedNurse, repeated: true },
  ],
);

/**
 * @generated from message patient.v1.AssignPatientToNurseRequest
 */
export const AssignPatientToNurseRequest = proto3.makeMessageType(
  "patient.v1.AssignPatientToNurseRequest",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "nurse_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * @generated from message patient.v1.UnassignPatientToNurseRequest
 */
export const UnassignPatientToNurseRequest = proto3.makeMessageType(
  "patient.v1.UnassignPatientToNurseRequest",
  () => [
    { no: 1, name: "patient_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "nurse_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

