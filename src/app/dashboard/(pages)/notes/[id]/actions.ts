"use server";

import { action, ActionRequest } from "@/lib/utils";
import { nc } from "@/lib/clients";
import { getSessionToken } from "@/lib/tools/session-cookies";
import { ConnectError } from "@connectrpc/connect";
import {
  AddChoiceToEventRequest,
  AddEventRequest,
  AddMethodToEventRequest,
  AddStepRequest,
  DeleteNoteRequest,
  EventInput,
  GenerateNoteContentRequest,
  GetNoteRequest,
  GoalProgress,
  Health,
  HealthAndSafetyStep,
  RemoveChoiceFromEventRequest,
  RemoveEventRequest,
  RemoveMethodFromEventRequest,
  RemoveStepRequest,
  UpdateChoiceInEventRequest,
  UpdateEventDescriptionRequest
} from "@/proto/note_pb";
import { PlainMessage, Timestamp } from "@bufbuild/protobuf";

type CreateNoteActionRequest = {
  patientId: string,
  date?: string,
  physicalHealth: Health,
  emotionalHealth: Health,
  exhibitedMaladaptiveBehavior: boolean,
  behaviorDescription?: string,
  goalId: string,
  goalProgress: GoalProgress,
  discussedMonthlyEducation: boolean,
  additionalInfo?: string,
  events: PlainMessage<EventInput>[],
  steps: HealthAndSafetyStep[],
}

export async function createNote(req: CreateNoteActionRequest) {
  return action(async () => {
    try {
      // @ts-ignore -- StrictRecord is funky here...
      return await nc.createNote({
        ...req,
        date: req.date ? Timestamp.fromJsonString(req.date) : undefined,
        token: getSessionToken(),
      })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to create note. Please try again.", status.code);
    }
  });
}

type UpdateNoteActionRequest = {
  noteId: string;
  date?: string;
  physicalHealth?: Health;
  emotionalHealth?: Health;
  exhibitedMaladaptiveBehavior?: boolean;
  behaviorDescription?: string;
  goalId?: string;
  goalProgress?: GoalProgress;
  discussedMonthlyEducation?: boolean;
  additionalInfo?: string;
};

export async function updateNote(req: UpdateNoteActionRequest) {
  return action(async () => {
    try {
      return await nc.updateNote({
        ...req,
        date: req.date ? Timestamp.fromJsonString(req.date) : undefined,
        token: getSessionToken()
      })
    } catch (error) {
      const status = ConnectError.from(error);
      console.error(status);
      throw new ConnectError("Failed to update note. Please try again.", status.code);
    }
  });
}

export async function deleteNote(req: ActionRequest<DeleteNoteRequest>) {
  return action(async () => {
    try {
      return await nc.deleteNote({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to delete note. Please try again.", status.code);
    }
  });
}

export async function getNote(req: ActionRequest<GetNoteRequest>) {
  return action(async () => {
    try {
      return await nc.getNote({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to get note. Please try again.", status.code);
    }
  });
}

export async function generateNoteContent(req: ActionRequest<GenerateNoteContentRequest>) {
  return action(async () => {
    try {
      return await nc.generateNoteContent({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to generate note content. Please try again.", status.code);
    }
  });
}

export async function addEvent(req: ActionRequest<AddEventRequest>) {
  return action(async () => {
    try {
      return await nc.addEvent({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to add event. Please try again.", status.code);
    }
  });
}

export async function removeEvent(req: ActionRequest<RemoveEventRequest>) {
  return action(async () => {
    try {
      return await nc.removeEvent({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to remove event. Please try again.", status.code);
    }
  });
}

export async function updateEventDescription(req: ActionRequest<UpdateEventDescriptionRequest>) {
  return action(async () => {
    try {
      return await nc.updateEventDescription({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to update event description. Please try again.", status.code);
    }
  });
}

export async function addChoiceToEvent(req: ActionRequest<AddChoiceToEventRequest>) {
  return action(async () => {
    try {
      return await nc.addChoiceToEvent({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to add choice to event. Please try again.", status.code);
    }
  });
}

export async function removeChoiceFromEvent(req: ActionRequest<RemoveChoiceFromEventRequest>) {
  return action(async () => {
    try {
      return await nc.removeChoiceFromEvent({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to remove choice from event. Please try again.", status.code);
    }
  });
}

export async function updateChoiceInEvent(req: ActionRequest<UpdateChoiceInEventRequest>) {
  return action(async () => {
    try {
      return await nc.updateChoiceInEvent({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to update choice in event. Please try again.", status.code);
    }
  });
}

export async function addMethodToEvent(req: ActionRequest<AddMethodToEventRequest>) {
  return action(async () => {
    try {
      return await nc.addMethodToEvent({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to add method to event. Please try again.", status.code);
    }
  });
}

export async function removeMethodFromEvent(req: ActionRequest<RemoveMethodFromEventRequest>) {
  return action(async () => {
    try {
      return await nc.removeMethodFromEvent({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to remove method from event. Please try again.", status.code);
    }
  });
}

export async function addStep(req: ActionRequest<AddStepRequest>) {
  return action(async () => {
    try {
      return await nc.addStep({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to add step. Please try again.", status.code);
    }
  });
}

export async function removeStep(req: ActionRequest<RemoveStepRequest>) {
  return action(async () => {
    try {
      return await nc.removeStep({ ...req, token: getSessionToken() })
    } catch (error) {
      const status = ConnectError.from(error);
      throw new ConnectError("Failed to remove step. Please try again.", status.code);
    }
  });
}
