import axios from "axios";
import type { Note, NoteId, SortBy, CategoryNoAll } from "../types/note";
import { CATEGORIES } from "../types/note";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

if (API_TOKEN) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${API_TOKEN}`;
}

export interface NotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
}

export async function fetchNotes(
  page: number,
  perPage: number,
  search?: string,
  tag?: CategoryNoAll,
  sortBy?: SortBy
): Promise<NotesResponse> {
  const params: Record<string, string> = {
    page: String(page),
    perPage: String(perPage),
  };

  if (search) params.search = search;
  if (tag) params.tag = tag;
  if (sortBy) params.sortBy = sortBy;

  const { data } = await apiClient.get<NotesResponse>("/notes", { params });
  return data;
}

export async function createNote(
  newNote: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  const { data } = await apiClient.post<Note>("/notes", newNote);
  return data;
}

export async function deleteNote(noteId: NoteId): Promise<Note> {
  const { data } = await apiClient.delete<Note>(`/notes/${noteId}`);
  return data;
}

export async function fetchNoteById(noteId: NoteId): Promise<Note> {
  const { data } = await apiClient.get<Note>(`/notes/${noteId}`);
  return data;
}

export const getCategories = () => CATEGORIES;
