import React, { useEffect, useState } from "react";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import ReactMarkdown from "react-markdown";

interface EditorProps {
  content: string;
  onContentChange: (text: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onContentChange }) => {
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleEditorChange = ({ text }: { text: string }) => {
    setEditedContent(text);
    onContentChange(text);
  };

  return (
    <MarkdownEditor
      value={editedContent}
      style={{ height: "300px" }}
      renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
      onChange={handleEditorChange}
    />
  );
};

export default Editor;
