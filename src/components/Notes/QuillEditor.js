import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import PropTypes from "prop-types";
import "quill/dist/quill.snow.css";

const QuillEditor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);

    // Keep these in refs to avoid re-creating handlers
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    // Sync the latest prop values with refs
    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    // Enable/disable the editor based on the readOnly prop
    useEffect(() => {
      if (quillRef.current) {
        quillRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    // Initialize Quill
    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("article")
      );

      const quill = new Quill(editorContainer, {
        theme: "snow",
        readOnly: readOnly,
        modules: {
          toolbar: [
            [{ 'font': [] }, { 'size': [] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link']
          ]
        }
      });

      quillRef.current = quill;
      ref.current = quill;

      if (defaultValueRef.current) {
        quill.root.innerHTML = defaultValueRef.current;
      }

      quill.on("text-change", () => {
        const content = quill.root.innerHTML; 
        onTextChangeRef.current?.(content); 
      });

      quill.on("selection-change", (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        ref.current = null;
        quillRef.current = null;
        container.innerHTML = "";
      };
    }, [ref]);

    return <section ref={containerRef}></section>;
  }
);

QuillEditor.displayName = "QuillEditor";

QuillEditor.propTypes = {
  readOnly: PropTypes.bool,
  defaultValue: PropTypes.string,
  onTextChange: PropTypes.func,
  onSelectionChange: PropTypes.func,
};

export default QuillEditor;
