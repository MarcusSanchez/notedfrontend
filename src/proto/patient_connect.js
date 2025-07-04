// @generated by protoc-gen-connect-es v1.4.0
// @generated from file patient.proto (package patient.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { AddDiagnosisRequest, AddGoalRequest, AddServiceRequest, AssignPatientToNurseRequest, CreatePatientRequest, CreatePatientResponse, DeletePatientRequest, GetPatientRequest, GetPatientResponse, ListNursePatientsRequest, ListNursePatientsResponse, ListNursesNotAssignedToPatientRequest, ListNursesNotAssignedToPatientResponse, ListPatientGoalsRequest, ListPatientGoalsResponse, ListPatientsNotAssignedToNurseRequest, ListPatientsNotAssignedToNurseResponse, ListPatientsRequest, ListPatientsResponse, RemoveDiagnosisRequest, RemoveGoalRequest, RemoveServiceRequest, UnassignPatientToNurseRequest, UpdateGoalRequest, UpdatePatientRequest } from "./patient_pb.js";
import { Empty, MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service patient.v1.PatientManagementService
 */
export const PatientManagementService = {
  typeName: "patient.v1.PatientManagementService",
  methods: {
    /**
     * @generated from rpc patient.v1.PatientManagementService.GetPatient
     */
    getPatient: {
      name: "GetPatient",
      I: GetPatientRequest,
      O: GetPatientResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.CreatePatient
     */
    createPatient: {
      name: "CreatePatient",
      I: CreatePatientRequest,
      O: CreatePatientResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.UpdatePatient
     */
    updatePatient: {
      name: "UpdatePatient",
      I: UpdatePatientRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.DeletePatient
     */
    deletePatient: {
      name: "DeletePatient",
      I: DeletePatientRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.AddGoal
     */
    addGoal: {
      name: "AddGoal",
      I: AddGoalRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.UpdateGoal
     */
    updateGoal: {
      name: "UpdateGoal",
      I: UpdateGoalRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.RemoveGoal
     */
    removeGoal: {
      name: "RemoveGoal",
      I: RemoveGoalRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.ListPatientGoals
     */
    listPatientGoals: {
      name: "ListPatientGoals",
      I: ListPatientGoalsRequest,
      O: ListPatientGoalsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.AddService
     */
    addService: {
      name: "AddService",
      I: AddServiceRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.RemoveService
     */
    removeService: {
      name: "RemoveService",
      I: RemoveServiceRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.AddDiagnosis
     */
    addDiagnosis: {
      name: "AddDiagnosis",
      I: AddDiagnosisRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.RemoveDiagnosis
     */
    removeDiagnosis: {
      name: "RemoveDiagnosis",
      I: RemoveDiagnosisRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.ListPatients
     */
    listPatients: {
      name: "ListPatients",
      I: ListPatientsRequest,
      O: ListPatientsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.ListNursePatients
     */
    listNursePatients: {
      name: "ListNursePatients",
      I: ListNursePatientsRequest,
      O: ListNursePatientsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.ListPatientsNotAssignedToNurse
     */
    listPatientsNotAssignedToNurse: {
      name: "ListPatientsNotAssignedToNurse",
      I: ListPatientsNotAssignedToNurseRequest,
      O: ListPatientsNotAssignedToNurseResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.ListNursesNotAssignedToPatient
     */
    listNursesNotAssignedToPatient: {
      name: "ListNursesNotAssignedToPatient",
      I: ListNursesNotAssignedToPatientRequest,
      O: ListNursesNotAssignedToPatientResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.AssignPatientToNurse
     */
    assignPatientToNurse: {
      name: "AssignPatientToNurse",
      I: AssignPatientToNurseRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc patient.v1.PatientManagementService.UnassignPatientFromNurse
     */
    unassignPatientFromNurse: {
      name: "UnassignPatientFromNurse",
      I: UnassignPatientToNurseRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
  }
};

