// @generated by protoc-gen-connect-es v1.4.0
// @generated from file patient.proto (package patient.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { AddDiagnosisRequest, AddGoalRequest, AddServiceRequest, AssignPatientToNurseRequest, CreatePatientRequest, CreatePatientResponse, DeletePatientRequest, GetPatientRequest, GetPatientResponse, ListNursePatientsRequest, ListNursePatientsResponse, ListNursesNotAssignedToPatientRequest, ListNursesNotAssignedToPatientResponse, ListPatientGoalsRequest, ListPatientGoalsResponse, ListPatientsNotAssignedToNurseRequest, ListPatientsNotAssignedToNurseResponse, ListPatientsRequest, ListPatientsResponse, RemoveDiagnosisRequest, RemoveGoalRequest, RemoveServiceRequest, UnassignPatientToNurseRequest, UpdateGoalRequest, UpdatePatientRequest } from "./patient_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service patient.v1.PatientManagementService
 */
export declare const PatientManagementService: {
  readonly typeName: "patient.v1.PatientManagementService",
  readonly methods: {
    /**
     * @generated from rpc patient.v1.PatientManagementService.GetPatient
     */
    readonly getPatient: {
      readonly name: "GetPatient",
      readonly I: typeof GetPatientRequest,
      readonly O: typeof GetPatientResponse,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.CreatePatient
     */
    readonly createPatient: {
      readonly name: "CreatePatient",
      readonly I: typeof CreatePatientRequest,
      readonly O: typeof CreatePatientResponse,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.UpdatePatient
     */
    readonly updatePatient: {
      readonly name: "UpdatePatient",
      readonly I: typeof UpdatePatientRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.DeletePatient
     */
    readonly deletePatient: {
      readonly name: "DeletePatient",
      readonly I: typeof DeletePatientRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.AddGoal
     */
    readonly addGoal: {
      readonly name: "AddGoal",
      readonly I: typeof AddGoalRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.UpdateGoal
     */
    readonly updateGoal: {
      readonly name: "UpdateGoal",
      readonly I: typeof UpdateGoalRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.RemoveGoal
     */
    readonly removeGoal: {
      readonly name: "RemoveGoal",
      readonly I: typeof RemoveGoalRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.ListPatientGoals
     */
    readonly listPatientGoals: {
      readonly name: "ListPatientGoals",
      readonly I: typeof ListPatientGoalsRequest,
      readonly O: typeof ListPatientGoalsResponse,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.AddService
     */
    readonly addService: {
      readonly name: "AddService",
      readonly I: typeof AddServiceRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.RemoveService
     */
    readonly removeService: {
      readonly name: "RemoveService",
      readonly I: typeof RemoveServiceRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.AddDiagnosis
     */
    readonly addDiagnosis: {
      readonly name: "AddDiagnosis",
      readonly I: typeof AddDiagnosisRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.RemoveDiagnosis
     */
    readonly removeDiagnosis: {
      readonly name: "RemoveDiagnosis",
      readonly I: typeof RemoveDiagnosisRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.ListPatients
     */
    readonly listPatients: {
      readonly name: "ListPatients",
      readonly I: typeof ListPatientsRequest,
      readonly O: typeof ListPatientsResponse,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.ListNursePatients
     */
    readonly listNursePatients: {
      readonly name: "ListNursePatients",
      readonly I: typeof ListNursePatientsRequest,
      readonly O: typeof ListNursePatientsResponse,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.ListPatientsNotAssignedToNurse
     */
    readonly listPatientsNotAssignedToNurse: {
      readonly name: "ListPatientsNotAssignedToNurse",
      readonly I: typeof ListPatientsNotAssignedToNurseRequest,
      readonly O: typeof ListPatientsNotAssignedToNurseResponse,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.ListNursesNotAssignedToPatient
     */
    readonly listNursesNotAssignedToPatient: {
      readonly name: "ListNursesNotAssignedToPatient",
      readonly I: typeof ListNursesNotAssignedToPatientRequest,
      readonly O: typeof ListNursesNotAssignedToPatientResponse,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.AssignPatientToNurse
     */
    readonly assignPatientToNurse: {
      readonly name: "AssignPatientToNurse",
      readonly I: typeof AssignPatientToNurseRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.UnassignPatientFromNurse
     */
    readonly unassignPatientFromNurse: {
      readonly name: "UnassignPatientFromNurse",
      readonly I: typeof UnassignPatientToNurseRequest,
      readonly O: typeof Empty,
      readonly kind: MethodKind.Unary,
    },
  }
};

