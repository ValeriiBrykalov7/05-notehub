import axios from "axios";
import type { Note, NewNote } from "../types/note";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

export const fetchNotes = async (
  query: string,
  page: number,
): Promise<NotesHttpResponse> => {
  const response = await axios.get<NotesHttpResponse>(
    `https://notehub-public.goit.study/api/notes?search=${query}&page=${page}&perPage=12`,
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
        accept: "application/json",
      },
    },
  );

  return {
    notes: response.data.notes,
    totalPages: response.data.totalPages,
  };
};

export const createNote = async (newNote: NewNote): Promise<NewNote> => {
  const response = await axios.post<NewNote>(
    "https://notehub-public.goit.study/api/notes",
    newNote,
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
        accept: "application/json",
      },
    },
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
        accept: "application/json",
      },
    },
  );
  return response.data;
};
