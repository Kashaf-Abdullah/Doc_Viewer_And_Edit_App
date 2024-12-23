import React from "react";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";

interface MenuProps {
  pages: { [key: string]: { title: string } };
  selectedPage: string | null;
  setSelectedPage: (page: string) => void;
}

const Menu: React.FC<MenuProps> = ({ pages, selectedPage, setSelectedPage }) => {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {Object.keys(pages).map((page) => (
        <ListItem disablePadding key={page}>
          <ListItemButton
            selected={selectedPage === page}
            onClick={() => setSelectedPage(page)}
          >
            <ListItemText primary={pages[page].title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default Menu;
