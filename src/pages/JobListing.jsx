import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useSession, useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import React, { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";

const JobListing = () => {
  const { isLoaded } = useUser();
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    fn,
    loading,
    data: jobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  const { fn: companyFn, data: companies } = useFetch(getCompanies);

  // console.log(data);

  useEffect(() => {
    if (isLoaded) fn();
  }, [isLoaded, location, company_id, searchQuery]);

  useEffect(() => {
    if (isLoaded) companyFn();
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader color="#36d7b7" size={80} />
      </div>
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");

    console.log("Search Query:", query);
    if (query) {
      setSearchQuery(query);
    }
  };

  const clearFilters = () => {
    setLocation("");
    setCompany_id("");
    setSearchQuery("");
  };

  return (
    <div>
      <h1 className="gradient-title font-bold text-6xl sm:text-7xl text-center pb-8">
        Latest jobs
      </h1>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="flex w-full h-12 gap-3 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search by title"
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
              <SelectItem value="apple">Apple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
              <SelectItem value="apple">Apple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          className="sm:w-1/2"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear filter
        </Button>
      </div>

      {loading && <PuffLoader />}

      {loading == false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs?.map((job) => {
              return (
                <JobCard
                  job={job}
                  id={job.id}
                  savedInit={job.saved.length > 0}
                />
              );
            })
          ) : (
            <div>No jobs found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
