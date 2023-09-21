import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { InputBase, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import {tokens } from "../assets/styles/theme";
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Box display="flex" borderRadius="3px" backgroundColor={colors.primary[400]}>
      <InputBase
        sx={{ ml: 2, flex: 1 }}
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
      />
      <IconButton type="submit" sx={{ p: 1 }} onClick={submitHandler}>
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchBox;
