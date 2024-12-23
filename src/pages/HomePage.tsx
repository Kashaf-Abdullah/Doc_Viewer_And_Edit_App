import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Menu from "../components/Menu";
import Editor from "../components/Editor";
import MarkdownRenderer from "../components/MarkdownRenderer";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  CloudDownload as CloudDownloadIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import "../App.css";

interface Page {
  title: string;
  bodyText: string;
}

interface DocData {
  pages: { [key: string]: Page };
}

const HomePage: React.FC = () => {
  const [docData, setDocData] = useState<DocData | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (selectedPage && docData) {
      const pageTitle = docData.pages[selectedPage].title.replace(/\s+/g, "-");
      navigate(`/${pageTitle}`);
    }
  }, [selectedPage, navigate, docData]);

  useEffect(() => {
    const pageTitleFromUrl = decodeURIComponent(location.pathname.slice(1));
    if (docData) {
      const pageKey = Object.keys(docData.pages).find(
        (key) =>
          docData.pages[key].title.replace(/\s+/g, "-") === pageTitleFromUrl
      );
      if (pageKey) {
        setSelectedPage(pageKey);
      }
    }
  }, [location, docData]);

  const fetchData = async () => {
    try {
      if (!docUrl.trim()) {
        toast.error("Please enter a valid JSON URL");
        return;
      }

      setLoading(true);
      const response = await fetch(docUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data. Please check the URL.");
      }

      const data = await response.json();
      const pagesKey = data.pages ? "pages" : data.Pages ? "Pages" : null;
      if (!pagesKey) {
        throw new Error("Invalid JSON format: Missing 'pages' key.");
      }

      setDocData({
        ...data,
        pages: data[pagesKey],
      });

      setSelectedPage(Object.keys(data[pagesKey])[0]);
      toast.success("Documentation loaded successfully!");
    } catch (error: any) {
      console.error("Error fetching JSON:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePageContent = () => {
    if (!docData || !selectedPage) return;

    setDocData((prevData) => ({
      ...prevData!,
      pages: {
        ...prevData!.pages,
        [selectedPage]: {
          ...prevData!.pages[selectedPage],
          title: updatedTitle || prevData!.pages[selectedPage].title,
          bodyText: updatedContent || prevData!.pages[selectedPage].bodyText,
        },
      },
    }));
    setEditMode(false);
    toast.success("Page content updated successfully!");
  };

  const handleExport = () => {
    if (!docData || !selectedPage) return;

    const singlePageData = {
      title: updatedTitle || docData.pages[selectedPage].title,
      bodyText: updatedContent || docData.pages[selectedPage].bodyText,
    };

    const jsonString = JSON.stringify(singlePageData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${singlePageData.title.replace(/\s+/g, "_")}.json`;
    a.click();

    toast.success("Export successful!");
  };

  const handleRefresh = () => {
    setDocData(null);
    setSelectedPage(null);
    setEditMode(false);
    setDocUrl("");
    setUpdatedTitle("");
    setUpdatedContent("");
    navigate("/");
    toast.info("Application state refreshed!");
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="Enter JSON URL"
            fullWidth
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{ ml: 2 }}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudDownloadIcon />}
          sx={{ mt: 2 }}
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load Documentation"}
        </Button>
      </Paper>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Fetching data, please wait...
          </Typography>
        </Box>
      )}

      {docData && docData.pages && !loading && (
        <Box display="flex" sx={{ height: "calc(100vh - 64px)", gap: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#fff",
              flex: "0 0 300px",
              height: "100%",
            }}
          >
            <Menu
              pages={docData.pages}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              sx={{ mt: 2 }}
              onClick={handleExport}
              fullWidth
            >
              Export
            </Button>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fff",
              flex: 1,
              height: "100%",
              overflowY: "auto",
            }}
          >
            {editMode ? (
              <Box>
                <TextField
                  fullWidth
                  label="Title"
                  value={
                    updatedTitle ||
                    (selectedPage && docData.pages[selectedPage]?.title) ||
                    ""
                  }
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <Editor
                  content={
                    updatedContent ||
                    (selectedPage && docData.pages[selectedPage]?.bodyText) ||
                    ""
                  }
                  onContentChange={(content) => setUpdatedContent(content)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  sx={{ mt: 2 }}
                  onClick={updatePageContent}
                >
                  Complete Edit
                </Button>
              </Box>
            ) : (
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h4">
                    {selectedPage && docData.pages[selectedPage]?.title}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                </Box>
                <MarkdownRenderer
                  content={
                    selectedPage && docData.pages[selectedPage]?.bodyText
                      ? docData.pages[selectedPage].bodyText
                      : ""
                  }
                />

              </Box>
            )}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
