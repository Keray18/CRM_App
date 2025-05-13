import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useMasterData(type) {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!type) return;
    axios.get(`http://localhost:8080/api/masterdata/type/${encodeURIComponent(type)}`)
      .then(res => setData(res.data.filter(item => item.isActive)))
      .catch(() => setData([]));
  }, [type]);
  return data;
} 