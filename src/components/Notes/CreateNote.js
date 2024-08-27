import React, { useState, useRef } from "react";
import { MdNoteAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import QuillEditor from "./QuillEditor";

const CreateNote = () => {
  const navigate = useNavigate();
  const quillRef = useRef();
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const handleTextChange = (content) => {
    // Ensure content is a string
    if (typeof content === "string") {
      setEditorContent(content);
    } else {
      setEditorContent("");
    }
  };

  const handleSubmit = async () => {
    if (editorContent.trim().length === 0) {
      return toast.error("Note content is required");
    }
    try {
      setLoading(true);
      const noteData = { content: editorContent };
      await api.post("/notes", noteData);
      toast.success("Note created successfully");
      navigate("/notes");
    } catch (err) {
      toast.error("Error creating note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex flex-col p-10">
      <div className="flex items-center gap-1 pb-5">
        <h1 className="font-montserrat text-slate-800 sm:text-4xl text-2xl font-semibold ">
          Create New Note
        </h1>
        <MdNoteAlt className="text-slate-700 text-4xl" />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 h-[500px]">
          <QuillEditor
            ref={quillRef}
            defaultValue={null} 
            onTextChange={handleTextChange}
            className="h-full"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Buttons
            disabled={loading}
            onClickhandler={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 rounded-sm"
          >
            {loading ? <span>Loading...</span> : "Create Note"}
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;
