import { useState, useRef, useCallback } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export const useSearchGuest = () => {
  const [form, setForm] = useState({ query: '', searchBy: 'name', reason: '' });
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, hasNextPage: false, totalDocs: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [flaggingGuest, setFlaggingGuest] = useState(null);

  // Store the abort controller to cancel old requests
  const abortControllerRef = useRef(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const performSearch = async (pageToLoad = 1, isLoadMore = false) => {
    if (!form.query.trim() || !form.reason.trim()) {
      toast.error('Search term and reason are mandatory.');
      return;
    }

    // Cancel previous request if it's still running
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setSearched(true);
    setError('');

    try {
      const response = await apiClient.post('/police/search', {
        ...form,
        page: pageToLoad,
        limit: 10 // Fetch 10 at a time
      }, {
        signal: abortControllerRef.current.signal
      });

      const { guests, pagination: pagingData } = response.data.data;

      if (isLoadMore) {
        setResults(prev => [...prev, ...guests]);
      } else {
        setResults(guests);
      }
      
      setPagination({
        page: pagingData.page,
        hasNextPage: pagingData.hasNextPage,
        totalDocs: pagingData.totalDocs
      });

    } catch (err) {
      if (err.name === 'CanceledError') return; // Ignore cancelled requests
      setError(err.response?.data?.message || 'Search failed.');
      if (!isLoadMore) setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // New search always starts at page 1
    performSearch(1, false);
  };

  const loadMore = () => {
    if (pagination.hasNextPage && !loading) {
        performSearch(pagination.page + 1, true);
    }
  };

  const handleFlagSubmit = async (reason) => {
    const toastId = toast.loading('Submitting alert...');
    try {
      const payload = { guestId: flaggingGuest._id, reason };
      await apiClient.post('/police/alerts', payload);
      toast.success(`Guest "${flaggingGuest.primaryGuest.name}" has been flagged.`, { id: toastId });
      setFlaggingGuest(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit alert.', { id: toastId });
    }
  };

  return { 
    form, 
    results, 
    pagination,
    loading, 
    error, 
    searched, 
    flaggingGuest, 
    setFlaggingGuest, 
    handleFormChange, 
    handleSearch, 
    loadMore, // Export loadMore
    handleFlagSubmit 
  };
};