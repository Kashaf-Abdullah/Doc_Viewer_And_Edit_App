import React from "react";
import ReactMarkdown from "react-markdown";
import { Box } from "@mui/material";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Box mt={2}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
