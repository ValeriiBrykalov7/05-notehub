import css from "./App.module.css";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import { fetchNotes } from "../../services/noteService";

import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["notes", debouncedQuery, currentPage],
    queryFn: () => fetchNotes(debouncedQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const changeQuery = (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onChange={changeQuery} />
        {notes.length > 0 && totalPages > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button type="button" className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {notes.length > 0 && <NoteList notes={notes} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          children={<NoteForm onClose={closeModal} />}
        />
      )}
    </div>
  );
}
