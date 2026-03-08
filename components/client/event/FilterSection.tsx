import React from 'react';

const FilterSection = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Lọc sự kiện</h2>
      <div className="flex flex-wrap gap-2">
        {['Tất cả', 'Hôm nay', 'Cuối tuần', 'Hội thảo', 'Workshop', 'Triển lãm', 'Miễn phí', 'Đang diễn ra'].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-full border transition-colors ${
              filter === 'Tất cả'
                ? 'bg-purple-700 text-white border-purple-700'
                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:text-purple-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
};

export default FilterSection;
