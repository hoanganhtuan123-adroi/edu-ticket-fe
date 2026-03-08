"use client";

import DashboardHeader from '@/components/client/layout/DashboardHeader';
import DashboardFooter from '@/components/client/layout/DashboardFooter';
import FilterSection from '@/components/client/event/FilterSection';
import FeaturedEvents from '@/components/client/event/FeaturedEvents';
import { useEvents } from '@/hooks/user/useEvent';

const DashboardPage = () => {
  const { events, loading, error, pagination, loadMore } = useEvents({
    limit: 3,
    offset: 0,
  });

  // Transform API data to EventCard format
  const transformedEvents = events.map(event => ({
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    bannerUrl: event.bannerUrl,
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
    status: event.status,
    isFree: true, // You might need to determine this from the API
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <FilterSection />
        
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
