import { Models, ID } from "appwrite";
import { databases } from "@/lib/appwrite";
import { LiveBeatEvent } from "@/types/events";
import { deleteFileById } from "./storage";

export async function getEvents() {
  const { documents } = await databases.listDocuments(
    import.meta.env.VITE_APPWRITE_EVENTS_DATABASES_ID,
    import.meta.env.VITE_APPWRITE_EVENTS_COLLECTIONS_ID
  );
  return {
    events: documents.map(mapDocumentToEvent),
  };
}

export async function getEventById(eventId: LiveBeatEvent["$id"]) {
  const document = await databases.getDocument(
    import.meta.env.VITE_APPWRITE_EVENTS_DATABASES_ID,
    import.meta.env.VITE_APPWRITE_EVENTS_COLLECTIONS_ID,
    eventId
  );
  return {
    event: mapDocumentToEvent(document),
  };
}

export async function deleteEventById(eventId: LiveBeatEvent["$id"]) {
  const { event } = await getEventById(eventId);
  if (event.imageFileId) {
   await deleteFileById(event.imageFileId);
  }
  await databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_EVENTS_DATABASES_ID,
    import.meta.env.VITE_APPWRITE_EVENTS_COLLECTIONS_ID,
    eventId
  );
}

export async function createEvent(event: Omit<LiveBeatEvent, "$id">) {
  const document = await databases.createDocument(
    import.meta.env.VITE_APPWRITE_EVENTS_DATABASES_ID,
    import.meta.env.VITE_APPWRITE_EVENTS_COLLECTIONS_ID,
    ID.unique(),
    event
  );
  return {
    event: mapDocumentToEvent(document),
  };
}

function mapDocumentToEvent(document: Models.Document) {
  const event: LiveBeatEvent = {
    $id: document.$id,
    name: document.name,
    location: document.location,
    date: document.date,
    imageHeight: document.imageHeight,
    imageWidth: document.imageWidth,
    imageFileId: document.imageFileId,
  };
  return event;
}
