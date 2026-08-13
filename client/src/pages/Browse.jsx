import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import BrowseList from "../components/BrowseList";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import FilterChips from "../components/FilterChips";
import Sorting from "../components/Sorting";
import "./Browse.css";
import Footer from "../components/Footer";
import toast from 'react-hot-toast'

const Browse = () => {
  // functions
  const removeExtraSpaces = (str) => {
    let i = 0;
    const n = str.length;
    let res = "";

    while (i < n) {
      while (i < n && str.charAt(i) === " ") i++;
      while (i < n && str.charAt(i) !== " ") {
        res += str.charAt(i);
        i++;
      }
      if (i < n) res += " ";
    }

    return res;
  };

  // states
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("downloads");
  const [sortOrder, setSortOrder] = useState("desc");

  // functions
  // access the previous state, then add the new key-value pair
  const setFilter = (key, value) => {
    if (value === "") {
      removeFilter(key);
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // access previous state using callback fn in state updater fn, create a deep copy of prev state so as to maintain immutability, use the delete keyword to delete the specific attribute you wanna delete i.e. filter you wanna remove. then return the updated object in the callback fn of state updater
  const removeFilter = (key) => {
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const onSortByChange = (data) => {
    setSortBy(data);
  };

  const onSortOrderChange = (data) => {
    setSortOrder(data);
  };

  // variables
  // chain filters (result of filter1 is input of filter2). filter 1 checks if the title matches the searchTerm, while the filter 2 checks which element(s) of filer 1 array satisfy all the applied features
  const filteredResources = resources
    .filter((item) => {
      const str = removeExtraSpaces(searchTerm.toLowerCase());
      return item.title.toLowerCase().includes(str);
    })
    .filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        // semester comes from dummy data as a number, but <select> values are always strings
        return String(item[key]) === String(value);
      });
    });

  const sortedResources = [...filteredResources].sort((a, b) => {
    const dir = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "downloads") return (a.downloads - b.downloads) * dir;
    if (sortBy === "dateUploaded")
      return (new Date(a.createdAt) - new Date(b.createdAt)) * dir;
    return 0;
  });

  // effects
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/resources`);
        if (!res.ok) throw new Error("Failed to fetch resources");
        const data = await res.json();
        setResources(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch resources!")
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="browse-container">
      <NavBar />
      <div className="browse-sub-container">
        <SearchBar setSearchTerm={setSearchTerm} />
        <FilterBar
          resources={resources}
          filters={filters}
          setFilter={setFilter}
        />
        <FilterChips filters={filters} removeFilter={removeFilter} />
        <Sorting
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={onSortByChange}
          onSortOrderChange={onSortOrderChange}
        />
        {loading ? (
          "Loading..."
        ) : resources.length === 0 ? (
          "No resources have been uploaded yet. Be the first!"
        ) : sortedResources.length === 0 ? (
          <div>
            <p>No resources match your search or filters.</p>
            <button onClick={() => setFilters({})}>Clear All Filters</button>
          </div>
        ) : (
          <BrowseList resources={sortedResources} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
