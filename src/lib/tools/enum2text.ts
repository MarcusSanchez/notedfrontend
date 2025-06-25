import { Role, Status } from "@/proto/user_pb";
import { DiagnosisType, ListPatientsOrderBy, ServiceType, Sex } from "@/proto/patient_pb";
import { GoalProgress, Health, HealthAndSafetyStep, MethodType } from "@/proto/note_pb";
import { SubscriptionStatus } from "@/proto/company_pb";

export function role2text(role?: Role): string {
  switch (role) {
    case Role.Admin:
      return "Admin";
    case Role.Nurse:
      return "Nurse";
    default:
      return "All";
  }
}

export function status2text(status?: Status): string {
  switch (status) {
    case Status.Accepted:
      return "Accepted";
    case Status.Rejected:
      return "Rejected";
    default:
      return "All";
  }
}

export function sex2text(sex?: Sex): string {
  switch (sex) {
    case Sex.Male:
      return "Male";
    case Sex.Female:
      return "Female";
    case Sex.Other:
      return "Other";
    default:
      return "Unspecified";
  }
}

export function diagnosis2text(diagnosis?: DiagnosisType): string {
  switch (diagnosis) {
    case DiagnosisType.Autism:
      return "Autism";
    case DiagnosisType.DownSyndrome:
      return "Down Syndrome";
    case DiagnosisType.CerebralPalsy:
      return "Cerebral Palsy";
    case DiagnosisType.IntellectualDisability:
      return "Intellectual Disability";
    case DiagnosisType.RettSyndrome:
      return "Rett Syndrome";
    case DiagnosisType.SpinaBifida:
      return "Spina Bifida";
    case DiagnosisType.PraderWilliSyndrome:
      return "Prader-Willi Syndrome";
    case DiagnosisType.PhelanMcdermidSyndrome:
      return "Phelan-McDermid Syndrome";
    default:
      return "Unspecified";
  }
}

export function service2text(service?: ServiceType): string {
  switch (service) {
    case ServiceType.Respite:
      return "Respite";
    case ServiceType.PersonalSupport:
      return "Personal Support";
    case ServiceType.Lifeskills:
      return "Lifeskills";
    case ServiceType.SupportedLiving:
      return "Supported Living";
    case ServiceType.SupportedEmployment:
      return "Supported Employment";
    default:
      return "Unspecified";
  }
}

export function listPatientsOrderBy2text(orderBy?: ListPatientsOrderBy): string {
  switch (orderBy) {
    case ListPatientsOrderBy.CreatedAtAsc:
      return "Created (Oldest First)";
    case ListPatientsOrderBy.CreatedAtDesc:
      return "Created (Newest First)";
    case ListPatientsOrderBy.LastMonthlyTalkAsc:
      return "Last Monthly Talk (Oldest First)";
    case ListPatientsOrderBy.LastMonthlyTalkDesc:
      return "Last Monthly Talk (Newest First)";
    default:
      return "Unspecified";
  }

}

export function health2text(health?: Health): string {
  switch (health) {
    case Health.Good:
      return "Good";
    case Health.Fair:
      return "Fair";
    case Health.Poor:
      return "Poor";
    default:
      return "Unspecified";
  }
}

export function progress2text(progress: GoalProgress): string {
  switch (progress) {
    case GoalProgress.Progressing:
      return "Progressing";
    case GoalProgress.Regressing:
      return "Regressing";
    case GoalProgress.Stagnant:
      return "Stagnant";
    default:
      return "Unspecified";
  }
}

export function step2text(step: HealthAndSafetyStep): string {
  switch (step) {
    case HealthAndSafetyStep.ConstantSupervision:
      return "Constant Supervision";
    case HealthAndSafetyStep.OneOnOneMonitoring:
      return "One-on-One Monitoring";
    case HealthAndSafetyStep.SafeStreetNavigation:
      return "Safe Street Navigation"
    case HealthAndSafetyStep.ProperHandHygiene:
      return "Proper Hand Hygiene"
    case HealthAndSafetyStep.VehicleSafetyAwareness:
      return "Vehicle Safety Awareness"
    case HealthAndSafetyStep.SafeEatingAndChokingPrevention:
      return "Safe Eating and Choking Prevention"
    case HealthAndSafetyStep.ProperUseOfEquipment:
      return "Proper Use Of Equipment"
    case HealthAndSafetyStep.MedicationReminders:
      return "Medication Reminders"
    case HealthAndSafetyStep.ReinforceCommunityEtiquette:
      return "Reinforce Community Etiquette"
    case HealthAndSafetyStep.TeachingSelfAdvocacy:
      return "Teaching Self Advocacy"
    case HealthAndSafetyStep.MedicalOrDentalAppointmentAssitance:
      return "Medical or Dental Appointment Assitance"
    case HealthAndSafetyStep.HouseholdChoresAndMaintenance:
      return "Household Chores and Maintenance"
    case HealthAndSafetyStep.ProperShoppingAwareness:
      return "Proper Shopping Awareness"
    default:
      return "Unspecified";
  }
}

export function method2text(method: MethodType): string {
  switch (method) {
    case MethodType.VerbalPrompt:
      return "Verbal Prompt"
    case MethodType.VisualQueue:
      return "Visual Queue"
    case MethodType.Gesture:
      return "Gesture"
    case MethodType.PhysicalPrompt:
      return "Physical Prompt"
    case MethodType.Shadowing:
      return "Shadowing"
    case MethodType.HandOverHand:
      return "Hand Over Hand"
    case MethodType.TotalAssist:
      return "Total Assist"
    default:
      return "Unspecified";
  }
}

export function subscription2text(status: SubscriptionStatus): string {
  switch (status) {
    case SubscriptionStatus.Active:
      return "Active";
    case SubscriptionStatus.PastDue:
      return "Past Due";
    case SubscriptionStatus.Nonexistent:
      return "Nonexistent";
    case SubscriptionStatus.Cancelled:
      return "Cancelled";
    default:
      return "Unspecified";
  }
}
