import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/config';
export default function useMasterData(type) {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!type) return;
    axios.get(`${API_URL}/masterdata/type/${encodeURIComponent(type)}`)
      .then(res => setData(res.data.filter(item => item.isActive)))
      .catch(() => setData([]));
  }, [type]);
  return data;
} 