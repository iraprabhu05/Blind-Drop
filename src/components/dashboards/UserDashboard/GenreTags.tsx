
import React from 'react';
import { Badge } from '../../ui/badge';

const GenreTags = ({ genres }) => {
  const colors = ['bg-blue-600', 'bg-purple-600', 'bg-pink-600', 'bg-green-600', 'bg-yellow-600', 'bg-red-600'];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Genres</h2>
      <div className="flex flex-wrap gap-4">
        {genres.map((genre, index) => (
          <Badge key={genre} className={`${colors[index % colors.length]} text-white text-md px-4 py-2 rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-200`}>
            {genre}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default GenreTags;
