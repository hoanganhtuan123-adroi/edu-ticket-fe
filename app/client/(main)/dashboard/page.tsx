"use client";

import { useState } from "react";
import DashboardHeader from "@/components/client/layout/DashboardHeader";
import DashboardFooter from "@/components/client/layout/DashboardFooter";
import FilterSection from "@/components/client/event/FilterSection";
import FeaturedEvents from "@/components/client/event/FeaturedEvents";
import { useEvents } from "@/hooks/user/useEvent";

const DashboardPage = () => {
  const [filters, setFilters] = useState({
    categorySlug: "",
    title: "",
    status: "",
  });

  const { events, loading, error, pagination, loadMore } = useEvents({
    limit: 6,
    offset: 0,
    categorySlug: filters.categorySlug || undefined,
    title: filters.title || undefined,
    status: filters.status || undefined,
  });

  // Transform API data to EventCard format
  const transformedEvents = events.map((event) => ({
    slug: event.slug,
    title: event.title,
    description: event.description,
    bannerUrl: event.bannerUrl,
    location: event.location,
    startTime: event.startTime,
    status: event.ticketSaleStatus,
    isFree: event.minPrice === 0, // Calculate free from minPrice
    isSoldOut: event.isSoldOut,
    category: event.category,
    price: event.minPrice,
    maxPrice: event.maxPrice, // Add maxPrice from API
  }));

  const handleFilterChange = (newFilters: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <FilterSection onFilterChange={handleFilterChange} />

        <FeaturedEvents
          events={transformedEvents}
          loading={loading}
          onLoadMore={loadMore}
          hasNext={pagination.hasNext}
        />
      </main>

      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;
